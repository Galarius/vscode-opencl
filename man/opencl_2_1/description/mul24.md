
## Description

`mul24` multiplies two 24-bit integer values `x` and `y`. `x` and `y`
are 32-bit integers but only the low 24-bits are used to perform the
multiplication. `mul24` should only be used when values in `x` and `y`
are in the range \[-2<sup>23</sup>, 2<sup>23</sup>-1\] if `x` and `y`
are signed integers and in the range \[0, 2<sup>24</sup>-1\] if `x` and
`y` are unsigned integers. If `x` and `y` are not in this range, the
multiplication result is implementation-defined.

## Notes

Fast integer functions can be used for optimizing performance of
kernels. We use the generic type name `gentype` to indicate that the
function can take `int`, `int2`, `int3`, `int4`, `int8`, `int16`,
`uint`, `uint2`, `uint3`, `uint4`, `uint8`, or `uint16` as the type for
the arguments.

## Also see

[Integer Functions](integerFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
82](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=82)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
