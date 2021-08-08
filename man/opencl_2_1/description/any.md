
## Description

`any` returns 1 if the most significant bit in any component of `x` is
set; otherwise returns 0.

`all` returns 1 if the most significant bit in all components of `x` is
set; otherwise returns 0.

## Notes

If an implementation extends this specification to support IEEE-754
flags or exceptions, then all built-in relational functions shall
proceed without raising the `invalid` floating-point exception when one
or more of the operands are NaNs.

The argument type `igentype` refers to the built-in signed integer
types, i.e. `char`, `charn`, `short`, `shortn`, `int`, `intn`, `long`,
and `longn`. n is 2, 3, 4, 8, or 16.

## Also see

[Relational Functions](relationalFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
90](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=90)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
