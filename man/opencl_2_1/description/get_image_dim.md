
## Description

`aQual` refers to one of the access qualifiers `read_only`,
`write_only`, or `read_write`.

`get_image_dim` with [`image2d_t`](otherDataTypes.html),
[`image2d_array_t`](otherDataTypes.html),
[`image2d_depth_t`](otherDataTypes.html), and
[`image2d_array_depth_t`](otherDataTypes.html) returns the 2D image
width and height as an `int2` type. The width is returned in the *x*
component, and the height in the *y* component.

`get_image_dim` with [`image3d_t`](otherDataTypes.html) returns the 3D
image width, height, and depth as an `int4` type. The width is returned
in the *x* component, height in the *y* component, depth in the *z*
component and the *w* component is 0.

## Also see

[Image Functions](imageFunctions.html),
[`cl_khr_gl_msaa_sharing`](cl_khr_gl_msaa_sharing.html)

## Specification

[OpenCL 2.0 C Language Specification, page
127](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=127)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
