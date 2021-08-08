
## Description

Multiply `x` by 2 to the power `k`.

## Notes

The vector versions of the math functions operate component-wise. The
description is per-component.

The built-in math functions are not affected by the prevailing rounding
mode in the calling environment, and always return the same value as
they would if called with the round to nearest even rounding mode.

The built-in math functions take scalar or vector arguments. The generic
type name `gentype` is used to indicate that the function can take
`float`, `float2`, `float3`, `float4`, `float8`, or `float16` as the
type for the arguments. For any specific use of these function, the
actual type has to be the same for all arguments and the return type.

If extended with [`cl_khr_fp16`](cl_khr_fp16.html), generic type name
`gentype` may indicate `half` and `half{2|3|4|8|16}` as arguments and
return values.

## Also see

[Math Functions](mathFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
72](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=72)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
