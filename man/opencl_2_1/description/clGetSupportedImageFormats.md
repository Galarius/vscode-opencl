
## Parameters

`context`  
A valid OpenCL context on which the image object(s) will be created.

`flags`  
A bit-field that is used to specify allocation and usage information
about the image memory object being queried and is described in the
table below. To get a list of supported image formats that can be read
from or written to by a kernel, `flags` must be set to
`CL_MEM_READ_WRITE` (get a list of images that can be read from and
written to by different kernel instances when correctly ordered by event
dependencies), `CL_MEM_READ_ONLY` (list of images that can be read from
by a kernel) or `CL_MEM_WRITE_ONLY` (list of images that can be written
to by a kernel). To get a list of supported image formats that can be
both read from and written to by a kernel, `flags` must be set to
`CL_MEM_KERNEL_READ_AND_WRITE`. Please see section 5.3.2.2 for
clarification.

| cl\_mem\_flags                    | Description                       |
| --- | --- |
|  `CL_MEM_READ_WRITE`               |  This flag specifies that the        memory object will be read and      written by a kernel. This is the    default.                          |
|  `CL_MEM_WRITE_ONLY`               |  This flag specifies that the        memory object will be written but   not read by a kernel.               Reading from a buffer or image      object created with                 `CL_MEM_WRITE_ONLY` inside a        kernel is undefined.                `CL_MEM_READ_WRITE` and             `CL_MEM_WRITE_ONLY` are mutually    exclusive.                        |
|  `CL_MEM_READ_ONLY`                |  This flag specifies that the        memory object is a read-only        memory object when used inside a    kernel.                             Writing to a buffer or image        object created with                 `CL_MEM_READ_ONLY` inside a         kernel is undefined.                `CL_MEM_READ_WRITE` or              `CL_MEM_WRITE_ONLY` and             `CL_MEM_READ_ONLY` are mutually     exclusive.                        |
|  `CL_MEM_USE_HOST_PTR`             |  This flag is valid only if          `host_ptr` is not NULL. If          specified, it indicates that the    application wants the OpenCL        implementation to use memory        referenced by `host_ptr` as the     storage bits for the memory         object.                             OpenCL implementations are          allowed to cache the buffer         contents pointed to by `host_ptr`   in device memory. This cached       copy can be used when kernels are   executed on a device.               The result of OpenCL commands       that operate on multiple buffer     objects created with the same       `host_ptr` or overlapping host      regions is considered to be         undefined.                        |
|  `CL_MEM_ALLOC_HOST_PTR`           |  This flag specifies that the        application wants the OpenCL        implementation to allocate memory   from host accessible memory.        `CL_MEM_ALLOC_HOST_PTR` and         `CL_MEM_USE_HOST_PTR` are           mutually exclusive.               |
|  `CL_MEM_COPY_HOST_PTR`            |  This flag is valid only if          `host_ptr` is not NULL. If          specified, it indicates that the    application wants the OpenCL        implementation to allocate memory   for the memory object and copy      the data from memory referenced     by `host_ptr`.                      `CL_MEM_COPY_HOST_PTR` and          `CL_MEM_USE_HOST_PTR` are           mutually exclusive.                 `CL_MEM_COPY_HOST_PTR` can be       used with `CL_MEM_ALLOC_HOST_PTR`   to initialize the contents of the   `cl_mem` object allocated using     host-accessible (e.g. PCIe)         memory.                           |
|  `CL_MEM_HOST_WRITE_ONLY`          |  This flag specifies that the host   will only write to the memory       object (using OpenCL APIs that      enqueue a write or a map for        write). This can be used to         optimize write access from the      host (e.g. enable write-combined    allocations for memory objects      for devices that communicate with   the host over a system bus such     as PCIe).                         |
|  `CL_MEM_HOST_READ_ONLY`           |  This flag specifies that the host   will only read the memory object    (using OpenCL APIs that enqueue a   read or a map for read).            `CL_MEM_HOST_WRITE_ONLY` and        `CL_MEM_HOST_READ_ONLY` are         mutually exclusive.               |
|  `CL_MEM_HOST_NO_ACCESS`           |  This flag specifies that the host   will not read or write the memory   object.                             `CL_MEM_HOST_WRITE_ONLY` or         `CL_MEM_HOST_READ_ONLY` and         `CL_MEM_HOST_NO_ACCESS` are         mutually exclusive.               |

`image_type`  
Describes the image type and must be either `CL_MEM_OBJECT_IMAGE1D`,
`CL_MEM_OBJECT_IMAGE1D_BUFFER`, `CL_MEM_OBJECT_IMAGE2D`,
`CL_MEM_OBJECT_IMAGE3D`, `CL_MEM_OBJECT_IMAGE1D_ARRAY` or
`CL_MEM_OBJECT_IMAGE2D_ARRAY`.

`num_entries`  
Specifies the number of entries that can be returned in the memory
location given by `image_formats`.

`image_formats`  
A pointer to a memory location where the list of supported image formats
are returned. Each entry describes a
[`cl_image_format`](cl_image_format.html) structure supported by the
OpenCL implementation. If `image_formats` is NULL, it is ignored.

`num_image_formats`  
The actual number of supported image formats for a specific `context`
and values specified by `flags`. If `num_image_formats` is NULL, it is
ignored.

## Notes

`clGetSupportedImageFormats` can be used to get the list of image
formats supported by an OpenCL implementation when the following
information about an image memory object is specified:

-   Context

-   Image type - 1D, 2D, or 3D image, 1D image buffer, 1D or 2D image
    array.

-   Image object allocation information

`clGetSupportedImageFormats` returns a union of image formats supported
by all devices in the context.

If `CL_DEVICE_IMAGE_SUPPORT` specified in table 4.3 (see
[`clGetDeviceInfo`](clGetDeviceInfo.html)) is `CL_TRUE`, the values
assigned to `CL_DEVICE_MAX_READ_IMAGE_ARGS`,
`CL_DEVICE_MAX_WRITE_IMAGE_ARGS`, `CL_DEVICE_IMAGE2D_MAX_WIDTH`,
`CL_DEVICE_IMAGE2D_MAX_HEIGHT`, `CL_DEVICE_IMAGE3D_MAX_WIDTH`,
`CL_DEVICE_IMAGE3D_MAX_HEIGHT`, `CL_DEVICE_IMAGE3D_MAX_DEPTH` and
`CL_DEVICE_MAX_SAMPLERS` by the implementation must be greater than or
equal to the minimum values specified in table 4.3 (see
[`clGetDeviceInfo`](clGetDeviceInfo.html)).

Minimum List of Supported Image Formats

For 1D, 1D image from buffer, 2D, 3D image objects, 1D and 2D image
array objects, the mandated minimum list of image formats that must be
supported by all devices (that can be read from or written to by a
kernel but not both) that support images is described in the table below
(Table 5.8a):

| ----            | ----            | ----            | ---- read/write |
| --- | --- | --- | --- |
|  num\_channels     ----                  1           |  channel\_order    ----                  CL_R        |  chan              nel\_data\_type   ----                CL_UNORM_INT8    CL_UNORM_INT16     CL_SNORM_INT8    CL_SNORM_INT16    CL_SIGNED_INT8   CL_SIGNED_INT16   CL_SIGNED_INT32       C             L_UNSIGNED_INT8       CL            _UNSIGNED_INT16       CL            _UNSIGNED_INT32 |  ----                  read+write  |
|      1           |      CL_DEPTH    |    CL_HALF_FLOAT       CL_FLOAT       CL_UNORM_INT16       CL_FLOAT    |      read+write    `CL_DEPTH`        channel order     is supported      only for 2D     |
|      2           |      CL_RG       |    CL_UNORM_INT8    CL_UNORM_INT16     CL_SNORM_INT8    CL_SNORM_INT16    CL_SIGNED_INT8   CL_SIGNED_INT16   CL_SIGNED_INT32       C             L_UNSIGNED_INT8       CL            _UNSIGNED_INT16       CL            _UNSIGNED_INT32 |  image and 2D      image array       objects.              read+write  |
|      4           |      CL_RGBA     |    CL_HALF_FLOAT       CL_FLOAT        CL_UNORM_INT8    CL_UNORM_INT16     CL_SNORM_INT8    CL_SNORM_INT16    CL_SIGNED_INT8   CL_SIGNED_INT16   CL_SIGNED_INT32       C             L_UNSIGNED_INT8       CL            _UNSIGNED_INT16       CL            _UNSIGNED_INT32 |      read+write  |
|||    CL_HALF_FLOAT ||
|      4                 4           |      CL_BGRA           CL_sRGBA    |      CL_FLOAT        CL_UNORM_INT8     CL_UNORM_INT8 |      read+write    read+write if     the               [`cl_khr_srgb_    image_writes`](   cl_khr_srgb_ima   ge_writes.html)   extension is      supported, else   read only. sRGB   channel order     support is not    required for 1D   image buffers.    Writes to         images with       sRGB channel      orders requires   device support    of the            [`cl_khr_srgb_    image_writes`]( |
|      1           |      C             L_DEPTH_STENCIL |   CL_UNORM_INT24       CL_FLOAT    |  cl_khr_srgb_ima   ge_writes.html)   extension.            read only     (applies if the       cl_khr_     |

For 1D, 1D image from buffer, 2D, 3D image objects, 1D and 2D image
array objects, the mandated minimum list of image formats that must be
supported by all devices (that can be read from and written to by a
kernel) that support images is described in the table below (Table
5.8b):

| ---- num\_channels   | ---- channel\_order  | ----                  |
| --- | --- | --- |
|  ----                       1                |  ----                       CL_R             |  channel\_data\_type     ----                        CL_UNORM_INT8           CL_SIGNED_INT8          CL_SIGNED_INT16         CL_SIGNED_INT32         CL_UNSIGNED_INT8        CL_UNSIGNED_INT16       CL_UNSIGNED_INT32 |
|      4                |      CL_RGBA          |      CL_HALF_FLOAT           CL_FLOAT                CL_UNORM_INT8           CL_UNORM_INT16          CL_SIGNED_INT8          CL_SIGNED_INT16         CL_SIGNED_INT32         CL_UNSIGNED_INT8        CL_UNSIGNED_INT16       CL_UNSIGNED_INT32 |
|      1                |      CL_DEPTH_STE       NCIL (applies if the       cl                 _khr_gl_depth_images |      CL_HALF_FLOAT           CL_FLOAT                CL_UNORM_INT24          CL_FLOAT          |

. Image format mapping to OpenCL C image access qualifiers

Image arguments to kernels may have the `read_only`, `write_only` or
`read_write` qualifier. Not all image formats supported by the device
and platform are valid to be passed to all of these access qualifiers.
For each access qualifier, only images whose format is in the list of
formats returned by clGetSupportedImageFormats with the given flag
arguments in the table below are permitted. It is not valid to pass an
image supporting writing as both a read\_only image and a write\_only
image parameter, or to a read\_write image parameter and any other image
parameter.

| ---- Access Qualifier ----        | ---- cl\_mem\_flags ----          |
| --- | --- |
|  `read_only`                       |  `CL_MEM_READ_ONLY`,                 `CL_MEM_READ_WRITE`,                `CL_MEM_KERNEL_READ_AND_WRITE`    |
|  `write_only`                      |  `CL_MEM_WRITE_ONLY`,                `CL_MEM_READ_WRITE`,                `CL_MEM_KERNEL_READ_AND_WRITE`    |
|  `read_write`                      |  `CL_MEM_KERNEL_READ_AND_WRITE`    |

Additional notes if the
[`cl_khr_gl_depth_images`](cl_khr_gl_depth_images.html) extension is
enabled:

For the image format given by channel order of `CL_DEPTH_STENCIL` and
channel data type of `CL_UNORM_INT24`, the depth is stored as an
unsigned normalized 24-bit value.

For the image format given by channel order of `CL DEPTH_STENCIL` and
channel data type of `CL_FLOAT`, each pixel is two 32-bit values. The
depth is stored as a single precision floating point value followed by
the stencil which is stored as a 8-bit integer value.

The stencil value cannot be read or written using the `read_imagef` and
`write_imagef` built-in functions in an OpenCL kernel.

Depth image objects with an image channel order = `CL_DEPTH_STENCIL`
cannot be used as arguments to
[`clEnqueueReadImage`](clEnqueueReadImage.html),
[`clEnqueueWriteImage`](clEnqueueWriteImage.html),
[`clEnqueueCopyImage`](clEnqueueCopyImage.html),
[`clEnqueueCopyImageToBuffer`](clEnqueueCopyImageToBuffer.html),
[`clEnqueueCopyBufferToImage`](clEnqueueCopyBufferToImage.html),
[`clEnqueueMapImage`](clEnqueueMapImage.html) and
[`clEnqueueFillImage`](clEnqueueFillImage.html) and will return a
`CL_INVALID_OPERATION` error.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if `flags` or `image_type` are not valid, or if
    `num_entries` is 0 and `image_formats` is not NULL.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`cl_image_format`](cl_image_format.html),
[`clGetDeviceInfo`](clGetDeviceInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
136](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=136)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
