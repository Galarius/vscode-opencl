
## Description

Extract mantissa and exponent from `x`. For each component the mantissa
returned is a float with magnitude in the interval \[1/2, 1) or 0. Each
component of `x` equals mantissa returned \* 2<sup>exp</sup>.

## Notes

The built-in math functions are not affected by the prevailing rounding
mode in the calling environment, and always return the same value as
they would if called with the round to nearest even rounding mode.

An application that wants to use `half` and `halfn` types will need to
include the `#pragma OPENCL EXTENSION cl_khr_fp16 : enable` directive.

## Also see

[Math Functions](mathFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
72](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=72)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
