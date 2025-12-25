---
layout: post

title: My misunderstanding about SME

date: 2025-12-25 16:00:00 +0800

description: My misunderstanding about SME ZA register

img: xmax25.png

fig-caption: # Add figcaption (optional)

tags: [ARM, SME, ZA register]
---
# Misunderstanding about ZA size and shape

Assume SVL = 512 bits, and the element type is float32.

Misunderstanding ❌: ~~ZA has size $SVL×SVL$, so I would have $512*512 = 2^{18}$ bits, which means my ZA register can hold $2^{13}$ floats.~~

Correct ✅: **The ZA matrix is square at the “byte” level, not at the “bit” level.**

ZA is not a bitmap. It is a “rectangle” with a height of $SVL/8$ **rows**, and each row is $SVL/8$ bytes wide.

```
      <--------- Width = 512 bits (64 Bytes) --------->
    +--------------------------------------------------+
 R  | Byte 0 | Byte 1 | ...                  | Byte 63 |
 o  |--------+--------+----------------------+---------|
 w  | Byte 0 | Byte 1 | ...                  | Byte 63 |
 s  |--------+--------+----------------------+---------|
    | ...    | ...    | ...                  | ...     |
(64)|--------+--------+----------------------+---------|
    | Byte 0 | Byte 1 | ...                  | Byte 63 |
    +--------------------------------------------------+
```

So the actual size of the ZA matrix is:

$64*512 \text{ bits} = 2^{15} \text{ bits} = 2^{12} \text{ bytes}$

## About tile size and shape

In SME: one tile is always a square of **N x N elements**.

The value of **N** depends on how many such elements fit in one **Z** register.

Therefore, the number of tiles changes with the element size.

| **Data type**   | **Element size (Bytes)** | **Vector capacity (Elements)** | **Tile shape (Elements)** | **Number of tiles** | **Naming**        |
| --------------------- | ------------------------------ | ------------------------------------ | ------------------------------- | ------------------------- | ----------------------- |
| **int8 (byte)** | 1                              | 64                                   | 64 x 64                         | 1                         | `ZA0.b`               |
| **float16**     | 2                              | 32                                   | 32 x 32                         | 2                         | `ZA0.h`, `ZA1.h`    |
| **float32**     | 4                              | 16                                   | 16 x 16                         | 4                         | `ZA0.s` ... `ZA3.s` |
| **float64**     | 8                              | 8                                    | 8 x 8                           | 8                         | `ZA0.d` ... `ZA7.d` |
