
## Description

Return sizeof (`gentypen`) bytes of data read from address (`p` +
(`offset` \* `n`)).

The read address computed as (`p` + (`offset` \* `n`)) must be 8-bit
aligned if `gentype` is `char` or `uchar`; 16-bit aligned if `gentype`
is `short`, `ushort`, or `half`; 32-bit aligned if `gentype` is `int`,
`uint`, or `float`; 64-bit aligned if `gentype` is `long` or `ulong`.

If the `half` extension is enabled, the address computed as (`p` +
(`offset` \* `n`)) must be 16-bit aligned.

## Notes

The generic type `gentype` is used to indicate the built-in data types
`char`, `uchar`, `short`, `ushort`, `int`, `uint`, `long`, `ulong`,
`float`, or `double`.

The generic type name `gentypen` represents n-element vectors of
`gentype` elements. The suffix n is also used in the function names
(i.e. `vloadn`, `vstoren`, etc.), where n = 2, 3, 4, 8, or 16.

Vector Data Load and Store Functions allow you to read and write vector
types from a pointer to memory.

The suffix `n` in the function names (i.e. vload\`n\`, vstore\`n\` etc.)
represent `n`-element vectors, where `n` = 2, 3, 4, 8 or 16.

The results of vector data load and store functions are undefined if the
address being read from or written to is not correctly aligned. The
pointer argument `p` can be a pointer to [`global`](global.html),
[`local`](local.html), or [`private`](private.html) memory for store
functions. The pointer argument `p` can be a pointer to global, local,
constant or private memory for load functions.

|   |   |
---|---|
|  Note                              |  The vector data load and store      functions variants that take        pointer arguments which point to    the generic address space are       also supported.                   |

When extended by the [`cl_khr_fp16`](cl_khr_fp16.html) extension, the
generic type `gentypen` is extended to include `half`, `half2`, `half3`,
`half4`, `half8`, and `half16`.

`vload3` and `vload_half3` read `x`, `y`, `z` components from address
(`p` + (`offset` \* 3)) into a 3-component vector.

## Also see

[Vector Data Load and Store
Functions](vectorDataLoadandStoreFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
93](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=93)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
