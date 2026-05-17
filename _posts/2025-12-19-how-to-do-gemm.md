---
layout: post

title: How to do GEMM on ARM SME

date:   2025-12-19 10:00:00 +0800

description: A guide on performing General Matrix Multiplication (GEMM) using ARM Scalable Matrix Extension (SME) # Add post description (optional)

img: software.jpg # Add image post (optional)

fig-caption: 

tags: [GEMM, ARM, SME, Matrix Multiplication]
---

# How to do GEMM on ARM SME

## Step 0: Terms and Definitions

You should check with the following terms often. Although you may already be familiar with some of them, it's better to have a quick review before diving into the details.

A standard GEMM operator accepts following parameters:

- **M**: Number of rows in matrix A and matrix C.
- **N**: Number of columns in matrix B and matrix C.
- **K**: Number of columns in matrix A and number of rows in matrix B.
- **α (alpha)**: Scalar multiplier for the product of matrices A and B.
- **β (beta)**: Scalar multiplier for matrix C.
- **A**: Input matrix A of dimensions M x K. Column-Major (In this post, we assume all elements are float32)
- **B**: Input matrix B of dimensions K x N. Column-Major
- **C**: Input/output matrix C of dimensions M x N. Column-Major

We also define following terms for better explanation in the section of blocking strategy:

- **$SVL$**: The length of the SME vector in bytes.
- **$KC$**: The blocking size for the K dimension.
- **$MC$**: The blocking size for the M dimension.
- **$NC$**: The blocking size for the N dimension.
- **$MR$**: The register blocking size for the M dimension.
- **$NR$**: The register blocking size for the N dimension.

## Step 1: Build the mental model first

Before writing assembly, it is better to decide what we want the machine to do.
GEMM is simple in math:

$$
C = \alpha A B + \beta C
$$

But a fast GEMM is not just three loops. The real problem is data movement. If
we read one element from memory, use it once, and throw it away, the CPU will
spend most of the time waiting for data. The usual GEMM trick is:

1. Split the problem into blocks.
2. Pack blocks of A and B into contiguous buffers.
3. Run a small micro-kernel that reuses the packed data many times.
4. Write the result back to C, handling `alpha`, `beta`, and edge cases.

SME changes the micro-kernel part because it gives us the **ZA matrix register**.
Instead of accumulating many vector registers manually, we can accumulate a tile
of C inside ZA.

For float32, if the vector length has `VL` float elements, one SME tile such as
`ZA0.s` has shape:

```text
VL rows x VL columns
```

For example, if `SVL = 512 bits`, then `VL = 512 / 32 = 16`, so one float32 tile
is `16 x 16`.

This is why SME is attractive for GEMM: the inner kernel naturally looks like
"load a column/row fragment, do outer-product, accumulate into ZA".

## Step 2: Decide the data layout

In this post I assume Fortran/BLAS-style column-major matrices:

```c
// A is M x K
A[i + p * lda]

// B is K x N
B[p + j * ldb]

// C is M x N
C[i + j * ldc]
```

This layout is good for walking down a column, but a GEMM micro-kernel wants a
very regular access pattern. So I would not directly feed the original A and B
into the inner kernel. I would pack them first.

A useful packed layout is:

```text
packed A panel: MC x KC
  stored as small MR x KC panels
  each micro-kernel can load one A vector for a fixed k

packed B panel: KC x NC
  stored as small KC x NR panels
  each micro-kernel can load one B vector for a fixed k
```

The goal is not to make the packed data pretty. The goal is to make the inner
kernel boring. If the kernel contains complicated address arithmetic, we already
lost some of the benefit of packing.

## Step 3: Blocking strategy

A common GEMM loop structure is:

```c
for (jc = 0; jc < N; jc += NC) {
    int nc = min(NC, N - jc);

    for (pc = 0; pc < K; pc += KC) {
        int kc = min(KC, K - pc);

        pack_B_panel(B + pc + jc * ldb, packed_B, kc, nc, ldb);

        for (ic = 0; ic < M; ic += MC) {
            int mc = min(MC, M - ic);

            pack_A_panel(A + ic + pc * lda, packed_A, mc, kc, lda);

            macro_kernel(
                mc, nc, kc,
                packed_A, packed_B,
                C + ic + jc * ldc,
                ldc,
                alpha,
                beta_for_this_k_block
            );
        }
    }
}
```

There is one important detail here: `beta` should only be applied when we touch
the original C for the first K block. For later K blocks, we want to accumulate
on top of the partial result already written to C.

So conceptually:

```c
beta_for_this_k_block = (pc == 0) ? beta : 1.0f;
```

The exact values of `MC`, `NC`, and `KC` depend on the target CPU, cache sizes,
memory bandwidth, and packing cost. I would start with conservative values and
then tune. The important relation is:

- `MR` and `NR` are decided by the SME micro-kernel shape.
- `KC` controls how much work each packed panel does before being discarded.
- `MC` and `NC` control cache reuse of packed A, packed B, and C.

## Step 4: Choose MR and NR from SME

For float32 SME, a natural first micro-kernel shape is:

```text
MR = VL
NR = VL
```

That means one micro-kernel computes one `VL x VL` block of C.

```text
C block:

          NR columns
      +----------------+
 MR   |                |
 rows | accumulated in |
      |      ZA        |
      +----------------+
```

This is the easiest shape to reason about. Later, if the implementation wants
multiple tiles, it can try wider shapes such as `MR = VL`, `NR = 2*VL`, using
more ZA tiles. But I would start with one tile because correctness is already
enough work.

For an SME micro-kernel, the inner computation for each `k` is basically:

```text
ZA += A_vector(:, k) outer_product B_vector(k, :)
```

In pseudocode:

```c
// Computes C[0:MR, 0:NR] += A[0:MR, 0:KC] * B[0:KC, 0:NR]
zero_ZA();

for (p = 0; p < KC; ++p) {
    a_vec = load MR elements from packed_A[:, p];
    b_vec = load NR elements from packed_B[p, :];
    ZA += outer_product(a_vec, b_vec);
}

store ZA to temporary/output C block;
```

With SME assembly, this is the place where the `fmopa` family of instructions is
used for float outer-product accumulation. The exact assembly spelling depends
on assembler syntax and predicate setup, so I prefer to keep the first version
small and verify it with a reference GEMM.

## Step 5: Packing A

Packing A should transform a column-major `mc x kc` block into a sequence of
micro-panels that the kernel reads linearly.

For a `MR x KC` A micro-panel:

```text
original A, column-major:

for p in 0..KC-1:
    A[i + p*lda], A[i+1 + p*lda], ...

packed A:

for p in 0..KC-1:
    packed_A[p*MR + 0]
    packed_A[p*MR + 1]
    ...
    packed_A[p*MR + MR-1]
```

Pseudocode:

```c
void pack_A_panel(
    const float *A,
    float *pack,
    int mc,
    int kc,
    int lda
) {
    for (int i = 0; i < mc; i += MR) {
        int mr = min(MR, mc - i);

        for (int p = 0; p < kc; ++p) {
            for (int r = 0; r < MR; ++r) {
                if (r < mr) {
                    pack[p * MR + r] = A[(i + r) + p * lda];
                } else {
                    pack[p * MR + r] = 0.0f;
                }
            }
        }

        pack += kc * MR;
    }
}
```

The zero padding is useful. It lets the micro-kernel always read a full `MR`
vector even near the bottom edge of the matrix.

## Step 6: Packing B

B packing is similar, but now we want each `KC x NR` block to provide one
contiguous B vector for every `p`.

```text
packed B:

for p in 0..KC-1:
    packed_B[p*NR + 0]
    packed_B[p*NR + 1]
    ...
    packed_B[p*NR + NR-1]
```

Pseudocode:

```c
void pack_B_panel(
    const float *B,
    float *pack,
    int kc,
    int nc,
    int ldb
) {
    for (int j = 0; j < nc; j += NR) {
        int nr = min(NR, nc - j);

        for (int p = 0; p < kc; ++p) {
            for (int c = 0; c < NR; ++c) {
                if (c < nr) {
                    pack[p * NR + c] = B[p + (j + c) * ldb];
                } else {
                    pack[p * NR + c] = 0.0f;
                }
            }
        }

        pack += kc * NR;
    }
}
```

Again, padding with zero makes the main kernel cleaner. The edge values do not
contribute to the real C matrix, and we can avoid a separate tiny kernel at the
beginning.

## Step 7: The SME micro-kernel

The micro-kernel is the only place where I would write SME-specific code at
first. Everything outside it can be plain C/C++.

Conceptually:

```c
void sme_sgemm_kernel_vl_vl(
    int kc,
    const float *packed_A,
    const float *packed_B,
    float *C,
    int ldc,
    float alpha,
    float beta,
    int mr,
    int nr
) {
    // mr and nr are the real edge sizes.
    // The packed panels are already padded to MR x NR.

    zero_ZA();

    for (int p = 0; p < kc; ++p) {
        // Load a_vec = packed_A[p*MR : p*MR+MR]
        // Load b_vec = packed_B[p*NR : p*NR+NR]
        // ZA += outer_product(a_vec, b_vec)
    }

    // Store ZA into C with alpha/beta handling.
}
```

An assembly skeleton might look like this at a very high level:

```asm
// Pseudocode only, not copy-paste-ready assembly.
// Enter streaming/ZA mode.
smstart za

// Clear accumulator tile.
zero {za}

loop_k:
    // Load one vector from packed A.
    ld1w zA.s, p0/z, [a_ptr]

    // Load one vector from packed B.
    ld1w zB.s, p1/z, [b_ptr]

    // ZA += zA outer zB.
    fmopa za0.s, p0/m, p1/m, zA.s, zB.s

    // Advance packed pointers.
    add a_ptr, a_ptr, MR_bytes
    add b_ptr, b_ptr, NR_bytes
    subs kc, kc, #1
    b.ne loop_k

// Store ZA rows/columns back.
// Leave streaming/ZA mode.
smstop za
```

Real code needs correct predicates, calling convention handling, and store
instructions for ZA. My personal suggestion is to first implement the smallest
kernel, compare against a scalar reference, and only then start tuning.

## Step 8: Store back with alpha and beta

After the accumulation, the mathematical result inside ZA is only:

```text
acc = A_panel * B_panel
```

The real GEMM result is:

```text
C = alpha * acc + beta * C
```

There are two common ways to do this.

The simple way is to store the ZA tile into a temporary `MR x NR` buffer and do
the alpha/beta operation in normal C:

```c
float tmp[MR * NR];

store_ZA_to_tmp(tmp);

for (int j = 0; j < nr; ++j) {
    for (int i = 0; i < mr; ++i) {
        float acc = tmp[j * MR + i];
        C[i + j * ldc] = alpha * acc + beta * C[i + j * ldc];
    }
}
```

This is not the final fastest version, but it is very useful for getting the
kernel correct.

The optimized way is to combine the store-back path with vector loads from C:

```text
for each row/column slice of ZA:
    load old C
    result = alpha * ZA_slice + beta * old_C
    store result to C
```

This avoids the temporary buffer, but it also makes the first implementation
more fragile. I would not start from here unless the assembler code is already
well tested.

Special cases are worth handling:

- If `alpha == 1` and `beta == 0`, store the accumulator directly.
- If `alpha == 1` and `beta == 1`, add old C.
- If `beta == 0`, do not load old C, because old C may contain NaN and BLAS
  semantics usually expect it not to matter when beta is zero.

## Step 9: Edge handling

There are two kinds of edges:

- M edge: fewer than `MR` rows remain.
- N edge: fewer than `NR` columns remain.

Because A and B packing padded missing values with zero, the computation itself
can still run as a full tile. The only risky part is store-back. We must only
write the valid `mr x nr` part:

```c
int mr = min(MR, M - ic);
int nr = min(NR, N - jc);

micro_kernel(
    kc,
    packed_A,
    packed_B,
    C + ic + jc * ldc,
    ldc,
    alpha,
    beta,
    mr,
    nr
);
```

For the first correct version, using scalar loops for edge store-back is totally
acceptable. Later, predicates can be used to make edge stores vectorized.

K edge is simpler. If `K` is not a multiple of `KC`, the last `kc` block is
shorter, and the micro-kernel just loops over the actual `kc`.

## Step 10: Put the macro-kernel together

The macro-kernel walks over packed A and packed B micro-panels:

```c
void macro_kernel(
    int mc,
    int nc,
    int kc,
    const float *packed_A,
    const float *packed_B,
    float *C,
    int ldc,
    float alpha,
    float beta
) {
    for (int j = 0; j < nc; j += NR) {
        int nr = min(NR, nc - j);
        const float *b_panel = packed_B + (j / NR) * kc * NR;

        for (int i = 0; i < mc; i += MR) {
            int mr = min(MR, mc - i);
            const float *a_panel = packed_A + (i / MR) * kc * MR;

            sme_sgemm_kernel_vl_vl(
                kc,
                a_panel,
                b_panel,
                C + i + j * ldc,
                ldc,
                alpha,
                beta,
                mr,
                nr
            );
        }
    }
}
```

At this point the GEMM has the same structure as many BLIS-style GEMM
implementations. The main difference is that the register block is a ZA tile
instead of a manually managed group of SIMD registers.

## Step 11: Correctness checks

Before performance tuning, I would run many small correctness tests:

```c
for M in [1, 2, 3, VL-1, VL, VL+1, 2*VL+3]
for N in [1, 2, 5, VL-1, VL, VL+2]
for K in [0, 1, 2, 7, KC-1, KC, KC+1]
for alpha in [0, 1, -1, 0.5]
for beta in [0, 1, -1, 0.25]
    compare sme_gemm with reference_gemm
```

I would also test non-contiguous leading dimensions:

```c
lda > M
ldb > K
ldc > M
```

This catches a surprising number of bugs. A GEMM that only works for tightly
packed matrices is not a BLAS-like GEMM yet.

For float32 comparison, do not expect bitwise identical results against a
different loop order. A reasonable check is:

```text
abs(actual - expected) <= atol + rtol * abs(expected)
```

The tolerance should be chosen based on K and the expected numerical range.

## Step 12: Performance checklist

After correctness is solid, these are the things I would check one by one.

### Packing

- Is A packing reading original A mostly contiguously?
- Is B packing producing exactly the layout the kernel wants?
- Is packing cost small compared with the amount of compute per packed panel?
- Are packed buffers aligned well enough for vector loads?

### Blocking

- Does `KC` give enough reuse before packed A/B are discarded?
- Does `MC x KC` fit the intended cache level?
- Does `KC x NC` fit the intended cache level?
- Are `MC`, `NC`, and `KC` multiples of `MR`, `NR`, or at least friendly to
  them?

### Micro-kernel

- Is ZA cleared once per output tile, not inside the K loop?
- Are A and B pointers advanced linearly?
- Is the K loop free from unnecessary branches?
- Are predicates set outside the loop when possible?
- Is store-back separated from accumulation enough to keep the inner loop clean?

### Store-back

- Does `beta == 0` avoid loading old C?
- Are full-tile stores fast?
- Are edge stores correct and not accidentally writing outside C?
- Is the temporary-buffer version removed only after the direct store version is
  tested?

### Measurement

- Measure square and non-square matrices.
- Measure small, medium, and large K.
- Separate packing time from micro-kernel time when debugging.
- Always compare against a trusted implementation for correctness.
- Avoid claiming a speedup from one size only. GEMM performance is very shape
  dependent.

## Final picture

The whole implementation path can be summarized like this:

```text
User GEMM call
    |
    v
Block N by NC
    |
    v
Block K by KC  ---> pack B(KC x NC)
    |
    v
Block M by MC  ---> pack A(MC x KC)
    |
    v
Loop over MR x NR output tiles
    |
    v
SME micro-kernel:
    zero ZA
    for k in KC:
        load A vector
        load B vector
        ZA += outer_product(A, B)
    store alpha * ZA + beta * C
```

The most important idea is that SME does not remove the normal GEMM engineering
work. We still need blocking, packing, edge handling, and careful store-back.
SME mainly gives us a powerful accumulator shape for the micro-kernel. If the
data arrives in the right order, ZA can do the part it is good at: accumulating a
dense tile of C.
