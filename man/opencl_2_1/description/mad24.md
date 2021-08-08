
## Description

`mad24` multiplies two 24-bit integer values `x` and `y` and adds the
32-bit integer result to the 32-bit integer `z`. See
[`mul24`](mul24.html) to see how the 24-bit integer multiplication is
performed.

## Notes

Fast integer functions can be used for optimizing performance of
kernels. We use the generic type name `gentype` to indicate that the
function can take `int`, `int2`, `int3`, `int4`, `int8`, `int16`,
`uint`, `uint2`, `uint3`, `uint4`, `uint8`, or `uint16` as the type for
the arguments.

## Also see

[Integer Functions](integerFunctions.html), [`mul24`](mul24.html)

## Specification

[OpenCL 2.0 C Language Specification, page
82](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=82)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
