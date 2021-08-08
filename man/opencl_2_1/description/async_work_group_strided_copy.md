
## Description

`async_work_group_strided_copy` performs an async gather of
`num_gentypes` `gentype` elements from `src` to `dst`. The `src_stride`
is the stride in elements for each `gentype` element read from `src`.
The async gather is performed by all work-items in a work-group and this
built-in function must therefore be encountered by all work-items in a
work-group executing the kernel with the same argument values; otherwise
the results are undefined. This rule applies to ND-ranges implemented
with uniform and non-uniform work-groups.

Returns an event object that can be used by
[`wait_group_events`](wait_group_events.html) to wait for the async copy
to finish. The `event` argument can also be used to associate the
`async_work_group_strided_copy` with a previous async copy allowing an
event to be shared by multiple async copies; otherwise `event` should be
zero.

If `event` argument is non-zero, the event object supplied in `event`
argument will be returned.

This function does not perform any implicit synchronization of source
data such as using a [`barrier`](barrier.html) before performing the
copy.

The behavior of `async_work_group_strided_copy` is undefined if
`src_stride` or `dst_stride` is 0, or if the `src_stride` or
`dst_stride` values cause the `src` or `dst` pointers to exceed the
upper bounds of the address space during the copy.

General information about async copy functions: The generic type name
`gentype` indicates the built-in data types `char`, `char{2|3|4|8|16}`,
`uchar`, `uchar{2|3|4|8|16}`, `short`, `short{2|3|4|8|16}`, `ushort`,
`ushort{2|3|4|8|16}`, `int`, `int{2|3|4|8|16}`, `uint`,
`uint{2|3|4|8|16}`, `long`, `long{2|3|4|8|16}`, `ulong`,
`ulong{2|3|4|8|16}`, `float`, `float{2|3|4|8|16}`, or `double`,
`double{2|3|4|8|16}` as the type for the arguments unless otherwise
stated.

When extended by the [`cl_khr_fp16`](cl_khr_fp16.html) extension, the
generic type `gentypen` is extended to include `half`, `half2`, `half3`,
`half4`, `half8`, and `half16`.

## Notes

`async_work_group_copy` and `async_work_group_strided_copy` for
3-component vector types behave as `async_work_group_copy` and
`async_work_group_strided_copy` respectively for 4-component vector
types.

## Also see

[Async Copy and Prefetch Functions](asyncCopyFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
100](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=100)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
