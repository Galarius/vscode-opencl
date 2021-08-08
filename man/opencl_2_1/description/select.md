
## Description

For each component of a vector type, result\[`i`\] = if MSB of
`c`\[`i`\] is set ? `b`\[`i`\] : `a`\[`i`\].

For scalar type, *result* = `c` ? `b` : `a`.

`igentype` and `ugentype` must have the same number of elements and bits
as `gentype`.

|   |   |
---|---|
|  Note                              |  The above definition means that     the behavior of select and the      ternary operator for vector and     scalar types is dependent on        different interpretations of the    bit pattern of `c`.               |

## Notes

General information about relational functions:

The argment type `gentype` can be `char`, `charn`, `uchar`, `ucharn`,
`short`, `shortn`, `ushort`, `ushortn`, `int`, `intn`, `uint`, `uintn`,
`long`, `longn`, `ulong`, `ulongn`, `float`, `floatn`, `double`, and
`doublen`.

The argument type `igentype` refers to the built-in signed integer
types, i.e. `char`, `charn`, `short`, `shortn`, `int`, `intn`, `long`,
and `longn`. n is 2, 3, 4, 8, or 16.

The argument type `ugentype` refers to the built-in unsigned integer
types, i.e. `uchar`, `ucharn`, `ushort`, `ushortn`, `uint`, `uintn`,
`ulong`, and `ulongn`. n is 2, 3, 4, 8, or 16.

If an implementation extends this specification to support IEEE-754
flags or exceptions, then all built-in relational functions shall
proceed without raising the `invalid` floating-point exception when one
or more of the operands are NaNs.

The built-in relational functions are extended with
[`cl_khr_fp16`](cl_khr_fp16.html) to include versions that take `half`,
and `half{2|3|4|8|16}` as arguments.

## Also see

[Relational Functions](relationalFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
90](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=90)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
