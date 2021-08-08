
## Description

This value is given by the `global_work_size` argument to
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html). Valid values of
`dimindx` are 0 to [`get_work_dim`](get_work_dim.html)() - 1. For other
values of `dimindx`, `get_global_size`() returns 1.

For `clEnqueueTask`, this always returns 1.

## Also see

[Work-Item Functions](workItemFunctions.html),
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html),

## Specification

[OpenCL 2.0 C Language Specification, page
69](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=69)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
