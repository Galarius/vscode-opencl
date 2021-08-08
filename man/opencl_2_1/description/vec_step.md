
## Description

The `vec_step` built-in function takes a built-in scalar or vector data
type argument and returns an integer value representing the number of
elements in the scalar or vector.

For all scalar types, `vec_step` returns 1.

The `vec_step` built-in functions that take a 3-component vector return
4.

`vec_step` may also take a pure type as an argument, e.g.
`vec_step`(`float2`)

We use the generic type name `gentypen` (or `gentypem`) to indicate the
built-in data types `char{2|4|8|16}`, `uchar{2|4|8|16}`,
`short{2|4|8|16}`, `ushort{2|4|8|16}`, `int{2|4|8|16}`,
`uint{2|4|8|16}`, `long{2|4|8|16}`, `ulong{2|4|8|16}`, `float{2|4|8|16}`
or `double{2|4|8|16}` as the type for the arguments unless otherwise
stated. We use the generic name `ugentypen` to indicate the built-in
unsigned integer data types.

The generic type name `gentypen` (or `gentypem`) may indicate the data
type `half{2|4|8|16}` if the [`cl_khr_fp16`](cl_khr_fp16.html) extension
is supported.

## Also see

[Miscellaneous Vector Functions](miscVectorFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
113](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=113)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
