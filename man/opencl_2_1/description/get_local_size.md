
## Description

Returns the number of local work-items specified in dimension identified
by `dimindx`. This value is at most the value given by the
`local_work_size` argument to
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) if
`local_work_size` is not NULL; otherwise the OpenCL implementation
chooses an appropriate `local_work_size` value which is returned by this
function. If the kernel is executed with a nonuniform work-group size
(i.e. the `global_work_size` values specified to
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) are not evenly
divisable by the `local_work_size` values for each dimension), calls to
this built-in from some work-groups may return different values than
calls to this built-in from other work-groups.

Valid values of `dimindx` are 0 to [`get_work_dim`](get_work_dim.html)()
- 1. For other values of `dimindx`, `get_local_size`() returns 1.

## Also see

[Work-Item Functions](workItemFunctions.html),
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html)

## Specification

[OpenCL 2.0 C Language Specification, page
69](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=69)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
