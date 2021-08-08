
## Description

Returns the distance between `p0` and `p1`. This is calculated as
[`length`](length.html)(`p0` - `p1`).

## Notes

General information about built-in geometric functions: Built-in
geometric functions operate component-wise. The description is
per-component. `floatn` is `float`, `float2`, `float3`, or `float4` and
`doublen` is `double`, `double2`, `double3`, or `double4`. The built-in
geometric functions are implemented using the round to nearest even
rounding mode.

The geometric functions can be implemented using contractions such as
[`mad`](mad.html) or [`fma`](fma.html).

If extended with [`cl_khr_fp16`](cl_khr_fp16.html), generic type name
`gentype` may indicate `half` and `half{2|3|4}` as arguments.

## Also see

[Geometric Functions](geometricFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
88](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=88)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
