
## Members

image\_channel\_order  
Specifies the number of channels and the channel layout i.e. the memory
layout in which channels are stored in the image. Valid values are
described in the table (Table 5.6) below.

| Format                            | Description                       |
| --- | --- |
|  `CL_R`, `CL_Rx`, or `CL_A`        ||
|  `CL_INTENSITY`                    |  This format can only be used if     channel data type =                 `CL_UNORM_INT8`,                    `CL_UNORM_INT16`,                   `CL_SNORM_INT8`,                    `CL_SNORM_INT16`,                   `CL_HALF_FLOAT`, or `CL_FLOAT`.   |
|  `CL_LUMINANCE`                    |  This format can only be used if     channel data type =                 `CL_UNORM_INT8`,                    `CL_UNORM_INT16`,                   `CL_SNORM_INT8`,                    `CL_SNORM_INT16`,                   `CL_HALF_FLOAT`, or `CL_FLOAT`.   |
|  `CL_DEPTH`                        |  This format can only be used if     channel data type =                 `CL_UNORM_INT16` or `CL_FLOAT`.   |
|  `CL_RG`, `CL_RGx`, or `CL_RA`     ||
|  `CL_RGB` or `CL_RGBx`             |  These formats can only be used if   channel data type =                 `CL_UNORM_SHORT_565`,               `CL_UNORM_SHORT_555` or             `CL_UNORM_INT101010`.             |
|  `CL_RGBA`                         ||
|  `CL_sRGB`, `CL_sRGBx`,              `CL_sRGBA`, `CL_sBGRA`            |  These formats can only be used if   channel data type =                 `CL_UNORM_INT8`.                  |
|  `CL_ARGB`, `CL_BGRA`, `CL_ABGR`   |  These formats can only be used if   channel data type =                 `CL_UNORM_INT8`, `CL_SNORM_INT8`,   `CL_SIGNED_INT8` or                 `CL_UNSIGNED_INT8`.               |
|  `CL_DEPTH_STENCIL`                |  This format can only be used if     channel data type =                 `CL_UNORM_INT24` or `CL_FLOAT`      (applies if the                     [`cl_khr_gl_depth_imag              es`](cl_khr_gl_depth_images.html)   extension is enabled).            |

image\_channel\_data\_type  
Describes the size of the channel data type. The number of bits per
element determined by the `image_channel_data_type` and
`image_channel_order` must be a power of two. The list of supported
values is described in the table (Table 5.7) below.

| Image Channel Data Type           | Description                       |
| --- | --- |
|  `CL_SNORM_INT8`                   |  Each channel component is a         normalized signed 8-bit integer     value.                            |
|  `CL_SNORM_INT16`                  |  Each channel component is a         normalized signed 16-bit integer    value.                            |
|  `CL_UNORM_INT8`                   |  Each channel component is a         normalized unsigned 8-bit integer   value.                            |
|  `CL_UNORM_INT16`                  |  Each channel component is a         normalized unsigned 16-bit          integer value.                    |
|  `CL_UNORM_SHORT_565`              |  Represents a normalized 5-6-5       3-channel RGB image. The channel    order must be `CL_RGB` or           `CL_RGBx`.                        |
|  `CL_UNORM_SHORT_555`              |  Represents a normalized x-5-5-5     4-channel xRGB image. The channel   order must be `CL_RGB` or           `CL_RGBx`.                        |
|  `CL_UNORM_INT_101010`             |  Represents a normalized             x-10-10-10 4-channel xRGB image.    The channel order must be           `CL_RGB` or `CL_RGBx`.            |
|  `CL_SIGNED_INT8`                  |  Each channel component is an        unnormalized signed 8-bit integer   value.                            |
|  `CL_SIGNED_INT16`                 |  Each channel component is an        unnormalized signed 16-bit          integer value.                    |
|  `CL_SIGNED_INT32`                 |  Each channel component is an        unnormalized signed 32-bit          integer value.                    |
|  `CL_UNSIGNED_INT8`                |  Each channel component is an        unnormalized unsigned 8-bit         integer value.                    |
|  `CL_UNSIGNED_INT16`               |  Each channel component is an        unnormalized unsigned 16-bit        integer value.                    |
|  `CL_UNSIGNED_INT32`               |  Each channel component is an        unnormalized unsigned 32-bit        integer value.                    |
|  `CL_HALF_FLOAT`                   |  Each channel component is a         16-bit half-float value.          |
|  `CL_FLOAT`                        |  Each channel component is a         single precision floating-point     value.                            |
|  `CL_FLOAT`                        |  Each channel component is a         single precision floating point     value (applies if the               [`cl_khr_gl_depth_imag              es`](cl_khr_gl_depth_images.html)   extension is enabled).            |
|  `CL_UNORM_INT24`                  |  Each channel component is a         normalized unsigned 24-bit          integer value (applies if the       [`cl_khr_gl_depth_imag              es`](cl_khr_gl_depth_images.html)   extension is enabled).            |

## Description

For example, to specify a normalized unsigned 8-bit / channel RGBA
image:

              image_channel_order = CL_RGBA
              image_channel_data_type = CL_UNORM_INT8

`image_channel_data_type` values of `CL_UNORM_SHORT_565`,
`CL_UNORM_SHORT_555`, `CL_UNORM_INT_101010`, and `CL_UNORM_INT_101010_2`
are special cases of packed image formats where the channels of each
element are packed into a single unsigned short or unsigned int. For
these special packed image formats, the channels are normally packed
with the first channel in the most significant bits of the bitfield, and
successive channels occupying progressively less significant locations.
For `CL_UNORM_SHORT_565`, R is in bits 15:11, G is in bits 10:5 and B is
in bits 4:0. For `CL_UNORM_SHORT_555`, bit 15 is undefined, R is in bits
14:10, G in bits 9:5 and B in bits 4:0. For `CL_UNORM_INT_101010`, bits
31:30 are undefined, R is in bits 29:20, G in bits 19:10 and B in bits
9:0. For `CL_UNORM_INT_101010_2`, R is in bits 31:22, G in bits 21:12, B
in bits 11:2 and A in bits 1:0.

OpenCL implementations must maintain the minimum precision specified by
the number of bits in `image_channel_data_type`. If the image format
specified by `image_channel_order`, and `image_channel_data_type` cannot
be supported by the OpenCL implementation, then the call to
[`clCreateImage`](clCreateImage.html) will return a NULL memory object.

## Also see

[cl\_image\_desc Image Descriptor](cl_image_desc.html),
[EXTENSION](EXTENSION.html),
[`clGetSupportedImageFormats`](clGetSupportedImageFormats.html),
[`clCreateImage`](clCreateImage.html)

## Specification

[OpenCL 2.1 API Specification, page
131](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=131)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
