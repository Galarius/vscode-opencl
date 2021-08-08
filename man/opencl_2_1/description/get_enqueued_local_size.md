
## Description

Returns the same value as that returned by
[`get_local_size`](get_local_size.html)(`dimindx`) if the kernel is
executed with a uniform work-group size.

If the kernel is executed with a non-uniform work-group size, returns
the number of local work-items in each of the work-groups that make up
the uniform region of the global range in the dimension identified by
`dimindx`. If the `local_work_size` argument to
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) is not NULL,
this value will match the value specified in
`local_work_size`\[`dimindx`\]. If `local_work_size` is NULL, this value
will match the local size that the implementation determined would be
most efficient at implementing the uniform region of the global range.

Valid values of `dimindx` are 0 to [`get_work_dim`](get_work_dim.html)()
- 1. For other values of `dimindx`, `get_enqueued_local_size`() returns
1.

## Also see

[`get_local_size`](get_local_size.html), [Work-Item
Functions](workItemFunctions.html),
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html)

## Specification

[OpenCL 2.0 C Language Specification, page
69](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=69)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
