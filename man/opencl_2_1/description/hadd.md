
## Description

`hadd` returns (`x`+`y`) &gt;&gt; 1. The intermediate sum does not
modulo overflow.

`rhadd` returns (`x`+`y`+1) &gt;&gt; 1. The intermediate sum does not
modulo overflow.

Frequently vector operations need n + 1 bits temporarily to calculate a
result. The `rhadd` instruction gives you an extra bit without needing
to upsample and downsample. This can be a profound performance win.

## Notes

General information about built-in integer functions: Built-in integer
functions take scalar or vector arguments. The vector versions of the
integer functions operate component-wise. The description is per
component.

We use the generic type name `gentype` to indicate that the function can
take `char`, `char{2|3|4|8|16}`, `uchar`, `uchar{2|3|4|8|16}`, `short`,
`short{2|3|4|8|16}`, `ushort`, `ushort{2|3|4|8|16}`, `int`,
`int{2|3|4|8|16}`, `uint`, `uint{2|3|4|8|16}`, `long`,
`long{2|3|4|8|16}`, `ulong`, or `ulong{2|3|4|8|16}` as the type for the
arguments. We use the generic type name `ugentype` to refer to unsigned
versions of `gentype`. For example, if `gentype` is `char4`, `ugentype`
is `uchar4`.

We also use the generic type name `sgentype` to indicate that the
function can take a scalar data type i.e. `char`, `uchar`, `short`,
`ushort`, `int`, `uint`, `long`, or `ulong` as the type for the
arguments. For built-in integer functions that take `gentype` and
`sgentype` arguments, the `gentype` argument must be a vector or scalar
version of the `sgentype` argument. For example, if `sgentype` is
`uchar`, `gentype` must be `uchar` or `uchar{2|3|4|8|16}`. For vector
versions, `sgentype` is implicitly widened to `gentype` as described in
section 6.3.a of the OpenCL specification.

For any specific use of a function, the actual type has to be the same
for all arguments and the return type unless otherwise specified.

## Also see

[Integer Functions](integerFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
82](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=82)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
