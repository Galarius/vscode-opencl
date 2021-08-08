
## Description

Returns the length of vector `p` computed as:

[`half_sqrt`](sqrt.html)(`p.x`<sup>2</sup> + `p.y`<sup>2</sup> + …​)

## Notes

General information about built-in geometric functions: Built-in
geometric functions operate component-wise. The description is
per-component. `floatn` is `float`, `float2`, `float3`, or `float4` and
`doublen` is `double`, `double2`, `double3`, or `double4`. The built-in
geometric functions are implemented using the round to nearest even
rounding mode.

The geometric functions can be implemented using contractions such as
[`mad`](mad.html) or [`fma`](fma.html).

## Also see

[Geometric Functions](geometricFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
88](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=88)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
