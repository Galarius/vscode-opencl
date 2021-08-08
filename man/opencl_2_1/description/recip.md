
## Description

The `half_recip` computes reciprocal.

`native_recip` computes reciprocal over an implementation-defined range.
The maximum error is implementation-defined.

The vector versions of the math functions operate component-wise. The
description is per-component.

The built-in math functions are not affected by the prevailing rounding
mode in the calling environment, and always return the same value as
they would if called with the round to nearest even rounding mode.

For any specific use of a function, the actual type has to be the same
for all arguments and the return type, unless otherwise specified.

Half and Native forms

A subset of Math functions (table 6.8) are defined with the `half_`
prefix. These functions are implemented with a minimum of 10-bits of
accuracy i.e. an ULP value ≤ 8192 ulp.

A subset of Math functions (table 6.8) are defined with the `native_`
prefix. These functions may map to one or more native device
instructions and will typically have better performance compared to the
corresponding functions (without the `native__` prefix). The accuracy
(and in some cases the input range(s)) of these functions is
implementation-defined.

For the half and native forms, we use the generic type name gentype to
indicate that the functions (table 6.9) can take `float`, `float2`,
`float3`, `float4`, `float8` or `float16` as the type for the arguments.

Support for denormal values is optional for `half_` functions. The
`half_` functions may return any result allowed by section 7.5.3, even
when `-cl-denorms-are-zero` (see section 5.8.4.2) is not in force.
Support for denormal values is implementation-defined for `native_`
functions.

## Also see

[Math Functions](mathFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
72](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=72)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
