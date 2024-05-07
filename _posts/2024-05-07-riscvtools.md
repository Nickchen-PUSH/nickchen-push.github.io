---
layout: post
title: M1 MacOS 配置 riscv-gnu-toolchain
date: 2024-05-8 00:00:00 +0800
description: My first blog # Add post description (optional)
img: workflow.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [compiler,Mac,ARM,RISC-V]
---

### 简介
本文章将简要讲述目前在 MacOS 上配置 riscv-gnu-toolchain 的可用方法。  

项目 | Availbility
------|------
riscv64-unknown-elf-gcc | ✅
riscv64-linux-gnu-gcc | ❌

### 前置要求
1. brew

### riscv64-unknown-elf-gcc 和 riscv64-linux-gnu-gcc 的区别
根据 RISC-V GNU Compiler Toolchain 的文档， `riscv64-unknown-elf-gcc` 使用的是 `Newlib` C函数库，`riscv64-linux-gnu-gcc` 使用的是linux下的 `glibc` 库。我还留意到二者的区别是，`riscv64-unknown-elf-gcc` 的 `thread mode` 为 `single` ， `riscv64-linux-gnu-gcc` 的 `thread mode` 为 `posix` 。所以我在用`riscv64-unknown-elf-gcc`编译一个使用 antlr 库作为前端的sysy编译器时，就出现了相关的问题。

### 安装 riscv64-unknown-elf-gcc 
brew 上提供了相应的 Formulae ，只需要这两行命令，你应该就可以安装好 riscv64-unknown-elf-gcc 相关的toolchain了。
```shell
brew tap riscv/riscv
brew install riscv-tools
```

### 在 MacOS 下安装 riscv64-linux-gnu-gcc 的失败尝试  
我尝试了在 MacOS 下使用文档中的方法编译安装`riscv64-linux-gnu-gcc`。遇到的问题简单来说，是 riscv-gcc-stage1 在编译 gcc ，构建 riscv-gcc-stage2 时，需要使用 `unwind` 库。而 `unwind` 库目前并不支持 MacOS 。通常 Apple clang 使用的 `unwind` 库是其内置的“另一种没有很大关系的” `unwind` 库[libunwind](http://opensource.apple.com/source/libunwind/)。而我没有办法让 riscv-gcc-stage1 使用这个库，所以没有实现在 MacOS 下安装riscv64-linux-gnu-gcc  相关的讨论在[building-libunwind-for-mac](https://stackoverflow.com/questions/27842377/building-libunwind-for-mac)  

