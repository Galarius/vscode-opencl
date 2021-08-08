
## Description

`nan` returns a quiet NaN. The `nancode` may be placed in the
significand of the resulting NaN.

## Notes

General information about built-in math functions: The built-in math
functions are categorized into the following:

-   A list of built-in functions that have scalar or vector argument
    versions, and,

-   A list of built-in functions that only take scalar float arguments.

The vector versions of the math functions operate component-wise. The
description is per-component.

The built-in math functions are not affected by the prevailing rounding
mode in the calling environment, and always return the same value as
they would if called with the round to nearest even rounding mode.

The built-in math functions take scalar or vector arguments. For any
specific use of these function, the actual type has to be the same for
all arguments and the return type unless otherwise specified.

The generic type name `gentype` is used to indicate that the function
can take `float`, `float2`, `float3`, `float4`, `float8`, `float16`,
`double`, `double2`, `double3`, `double4`, `double8`, or `double16` as
the type for the arguments.

If extended with [`cl_khr_fp16`](cl_khr_fp16.html), generic type name
`gentype` may indicate `half` and `half{2|3|4|8|16}` as arguments and
return values.

The generic type name `gentypef` is used to indicate that the function
can take `float`, `float2`, `float3`, `float4`, `float8`, or `float16`
as the type for the arguments.

The generic type name `gentyped` is used to indicate that the function
can take `double`, `double2`, `double3`, `double4`, `double8`, or
`double16` as the type for the arguments.

## Also see

[Math Functions](mathFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
72](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=72)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
