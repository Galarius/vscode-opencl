
## Description

Returns the work-items 1-dimensional global ID. For 1D work-groups, it
is the same value as [`get_local_id`](get_local_id.html)(0).

For 2D work-groups, it is computed as
[`get_local_id`](get_local_id.html)(1) \*
[`get_local_size`](get_local_size.html) (0) +
[`get_local_id`](get_local_id.html)(0).

For 3D work-groups, it is computed as
([`get_local_id`](get_local_id.html)(2) \*
[`get_local_size`](get_local_size.html)(1) \*
[`get_local_size`](get_local_size.html)(0)) +
([`get_local_id`](get_local_id.html)(1) \*
[`get_local_size`](get_local_size.html)(0)) +
[`get_local_id`](get_local_id.html)(0).

## Also see

[Work-Item Functions](workItemFunctions.html),
[`get_global_id`](get_global_id.html),
[`get_global_size`](get_global_size.html),
[`get_local_id`](get_local_id.html)

## Specification

[OpenCL 2.0 C Language Specification, page
69](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=69)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
