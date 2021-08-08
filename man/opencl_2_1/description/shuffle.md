
## Description

The `shuffle` and `shuffle2` built-in functions construct a permutation
of elements from one or two input vectors respectively that are of the
same type, returning a vector with the same element type as the input
and length that is the same as the shuffle mask. The size of each
element in the `mask` must match the size of each element in the result.
For `shuffle`, only the [`ilogb`](ilogb.html)(2m-1) least significant
bits of each `mask` element are considered. For `shuffle2`, only the
[`ilogb`](ilogb.html)(2m-1)+1 least significant bits of each `mask`
element are considered. Other bits in the `mask` shall be ignored.

The elements of the input vectors are numbered from left to right across
one or both of the vectors. For this purpose, the number of elements in
a vector is given by [`vec_step`](vec_step.html)(gentypem). The shuffle
`mask` operand specifies, for each element of the result vector, which
element of the one or two input vectors the result element gets.

General information about miscellaneous vector functions: We use the
generic type name `gentypen` (or `gentypem`) to indicate the built-in
data types `char{2|4|8|16}`, `uchar{2|4|8|16}`, `short{2|4|8|16}`,
`ushort{2|4|8|16}`, `int{2|4|8|16}`, `uint{2|4|8|16}`, `long{2|4|8|16}`,
`ulong{2|4|8|16}`, `float{2|4|8|16}` or `double{2|4|8|16}` as the type
for the arguments unless otherwise stated. We use the generic name
`ugentypen` to indicate the built-in unsigned integer data types.

The generic type name `gentypen` (or `gentypem`) may indicate the data
type `half{2|4|8|16}` if the [`cl_khr_fp16`](cl_khr_fp16.html) extension
is supported.

## Example

    uint4 mask = (uint4)(3, 2, 1, 0);
    float4 a;
    float4 r = shuffle(a, mask);
    // r.s0123 = a.wzyx

    uint8 mask = (uint8)(0, 1, 2, 3, 4, 5, 6, 7);

    float4 a, b;
    float8 r = shuffle2(a, b, mask);
    // r.s0123 = a.xyzw
    // r.s4567 = b.xyzw

    uint4 mask;
    float8 a;
    float4 b;
    b = shuffle(a, mask);

Examples that are not valid are:

    uint8 mask;
    short16 a;
    short8 b;
    b = shuffle(a, mask); // invalid

## Also see

[Miscellaneous Vector Functions](miscVectorFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
113](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=113)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
