
## Description

Returns the linear blend of `x` and `y` implemented as: *x* + (*y* -
*x*) \* *a*

`a` must be a value in the range 0.0 …​ 1.0. If `a` is not in the range
0.0 …​ 1.0, the return values are undefined.

## Notes

These all operate component-wise. The description is per-component. The
generic type name `gentype` is used to indicate that the function can
take `float`, `float2`, `float3`, `float4`, `float8`, `float16`,
`double`, `double2`, `double3`, `double4`, `double8`, or `double16` as
the type for the arguments.

The generic type name `gentypef` is used to indicate that the function
can take `float`, `float2`, `float3`, `float4`, `float8`, or `float16`
as the type for the arguments.

The generic type name `gentyped` is used to indicate that the function
can take `double`, `double2`, `double3`, `double4`, `double8`, or
`double16` as the type for the arguments.

The built-in common functions are implemented using the round to nearest
even rounding mode.

If extended with [`cl_khr_fp16`](cl_khr_fp16.html), generic type name
`gentype` may indicate `half` and `half{2|3|4|8|16}` as arguments and
return values.

The mix and smoothstep functions can be implemented using contractions
such as [`mad`](mad.html) or [`fma`](fma.html).

## Also see

[Common Functions](commonFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
86](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=86)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
