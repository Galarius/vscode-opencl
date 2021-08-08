
## Description

`prefetch` prefetches `num_gentypes` \* sizeof(`gentype`) bytes into the
global cache. The prefetch instruction is applied to a work-item in a
work-group and does not affect the functional behavior of the kernel.

The kernel must wait for the completion of all async copies using the
`wait_group_events` built-in function before exiting; otherwise the
behavior is undefined.

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

## Also see

[Async Copy and Prefetch Functions](asyncCopyFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
100](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=100)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
