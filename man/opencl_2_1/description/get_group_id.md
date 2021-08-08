
## Description

Returns the work-group ID which is a number from 0 ..
[`get_num_groups`](get_num_groups.html)(`dimindx`) - 1. Valid values of
`dimindx` are 0 to [`get_work_dim`](get_work_dim.html)() - 1. For other
values, `get_group_id`() returns 0.

## Also see

[Work-Item Functions](workItemFunctions.html),
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html)

## Specification

[OpenCL 2.0 C Language Specification, page
69](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=69)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
