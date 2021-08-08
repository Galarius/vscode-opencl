
## Description

`wait_group_events` waits for events that identify the
[`async_work_group_copy`](async_work_group_copy.html) operations to
complete. The event objects specified in `event_list` will be released
after the wait is performed.

This function must be encountered by all work-items in a work-group
executing the kernel with the same `num_events` and event objects
specified in `event_list`; otherwise the results are undefined. This
rule applies to ND-ranges implemented with uniform and non-uniform
work-groups.

## Notes

The kernel must wait for the completion of all async copies using the
`wait_group_events` built-in function before exiting; otherwise the
behavior is undefined.

## Also see

[Async Copy and Prefetch Functions](asyncCopyFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
100](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=100)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
