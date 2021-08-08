
## Description

Returns a vector in the same direction as `p` but with a length of 1.
`fast_normalize` is computed as:

              p * half_rsqrt(p.x2 + p.y2 +...)

The result shall be within 8192 ulps error from the infinitely precise
result of:

              if (all(p == 0.0f))
                        result = p;
              else
                        result = p /  sqrt(p.x2 + p.y2 +...);

with the following exceptions:

1.  If the sum of squares is greater than `FLT_MAX` then the value of
    the floating-point values in the result vector are undefined.

2.  If the sum of squares is less than `FLT_MIN` then the implementation
    may return back `p`.

3.  If the device is in 'denorms are flushed to zero' mode, individual
    operand elements with magnitude less than
    [`sqrt`](sqrt.html)(`FLT_MIN`) may be flushed to zero before
    proceeding with the calculation.

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
