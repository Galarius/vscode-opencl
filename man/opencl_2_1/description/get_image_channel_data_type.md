
## Description

`aQual` refers to one of the access qualifiers `read_only`,
`write_only`, or `read_write`.

Return the channel data type. Valid values are:

    CLK_SNORM_INT8
    CLK_SNORM_INT16
    CLK_UNORM_INT8
    CLK_UNORM_INT16
    CLK_UNORM_SHORT_565
    CLK_UNORM_SHORT_555
    CLK_UNORM_SHORT_101010
    CLK_SIGNED_INT8
    CLK_SIGNED_INT16
    CLK_SIGNED_INT32
    CLK_UNSIGNED_INT8
    CLK_UNSIGNED_INT16
    CLK_UNSIGNED_INT32
    CLK_HALF_FLOAT
    CLK_FLOAT

## Notes

The values returned by `get_image_channel_data_type` and
`get_image_channel_order` as specified the table above with the `CLK_`
prefixes correspond to the `CL_` prefixes used to describe the image
channel order and data type in tables 5.4 (see
[`clCreateSubBuffer`](clCreateSubBuffer.html)) and 5.5 (see
[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html)). For example, both
`CL_UNORM_INT8` and `CLK_UNORM_INT8` refer to an image channel data type
that is an unnormalized unsigned 8-bit integer.

## Also see

[Image Functions](imageFunctions.html),
[`cl_khr_gl_msaa_sharing`](cl_khr_gl_msaa_sharing.html),
[`clCreateSubBuffer`](clCreateSubBuffer.html),
[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html)

## Specification

[OpenCL 2.0 C Language Specification, page
127](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=127)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
