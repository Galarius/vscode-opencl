
## Description

Test if arguments are ordered. `isordered`() takes arguments `x` and
`y`, and returns the result [`isequal`](isequal.html)(`x`, `x`) &&
isequal(`y`, `y`).

## Notes

If an implementation extends this specification to support IEEE-754
flags or exceptions, then all built-in relational functions shall
proceed without raising the `invalid` floating-point exception when one
or more of the operands are NaNs.

The built-in relational functions are extended with
[`cl_khr_fp16`](cl_khr_fp16.html) to include versions that take `half`,
and `half{2|3|4|8|16}` as arguments.

The function returns a 0 if the specified relation is `false` and a 1 if
the specified relation is `true` for scalar argument types. These
functions shall return a 0 if the specified relation is `false` and a -
1 (i.e. all bits set) if the specified relation is `true` for vector
argument types.

## Also see

[Relational Functions](relationalFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
90](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=90)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
