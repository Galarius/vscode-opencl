
## Description

The `floatn` (or `doublen`) value given by `data` is converted to a
`halfn` value using the appropriate rounding mode. The `halfn` value is
then written to address computed as (`p` + (`offset` \* `n`)). The
address computed as (`p` + (`offset` \* `n`)) must be 16-bit aligned.

`vstore_halfn` uses the default rounding mode. The default rounding mode
is round to nearest even.

## Notes

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

`vload3` and `vload_half3` read `x`, `y`, `z` components from address
(`p` + (`offset` \* 3)) into a 3-component vector. `vstore3`, and
`vstore_half3` write `x`, `y`, `z` components from a 3-component vector
to address (`p` + (`offset` \* 3)).

In addition `vloada_half3` reads `x`, `y`, `z` components from address
(`p` + (`offset` \* 4)) into a 3- component vector and `vstorea_half3`
writes `x`, `y`, `z` components from a 3-component vector to address
(`p` + (`offset` \* 4)).

## Also see

[Vector Data Load and Store
Functions](vectorDataLoadandStoreFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
93](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=93)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
