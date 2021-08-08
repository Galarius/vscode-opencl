
## Description

Returns the cross product of `p0.xyz` and `p1.xyz`. For the form that
returns `float4`, the `w` component of `float4` result returned will be
0.0. For the forms that returns `half3` or `half4`, the `w` component of
`double` result will be 0.0.

## Notes

General information about built-in geometric functions: Built-in
geometric functions operate component-wise. The description is
per-component. `floatn` is `float`, `float2`, `float3`, or `float4` and
`doublen` is `double`, `double2`, `double3`, or `double4`. The built-in
geometric functions are implemented using the round to nearest even
rounding mode.

The geometric functions can be implemented using contractions such as
[`mad`](mad.html) or [`fma`](fma.html).

An application that wants to use `half` and `halfn` types will need to
include the `#pragma OPENCL EXTENSION cl_khr_fp16 : enable` directive.

## Also see

[Geometric Functions](geometricFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
88](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=88)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
