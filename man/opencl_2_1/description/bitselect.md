
## Description

Each bit of result is corresponding bit of `a` if corresponding bit of
`c` is 0. Otherwise it is the corresponding bit of `b`.

## Notes

If an implementation extends this specification to support IEEE-754
flags or exceptions, then all built-in relational functions shall
proceed without raising the `invalid` floating-point exception when one
or more of the operands are NaNs.

The built-in relational functions are extended with
[`cl_khr_fp16`](cl_khr_fp16.html) to include versions that take `half`,
and `half{2|3|4|8|16}` as arguments.

The argment type `gentype` can be `char`, `charn`, `uchar`, `ucharn`,
`short`, `shortn`, `ushort`, `ushortn`, `int`, `intn`, `uint`, `uintn`,
`long`, `longn`, `ulong`, `ulongn`, `float`, `floatn`, `double`, and
`doublen`.

## Also see

[Relational Functions](relationalFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
90](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=90)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
