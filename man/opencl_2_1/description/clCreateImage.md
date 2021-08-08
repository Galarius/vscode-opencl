
## Parameters

`context`  
A valid OpenCL context on which the image object is to be created.

`flags`  
A bit-field that is used to specify allocation and usage information
about the image memory object being created and is described in the
table below.

For all image types except `CL_MEM_OBJECT_IMAGE1D_BUFFER`, if value
specified for `flags` is 0, the default is used which is
`CL_MEM_READ_WRITE`.

For `CL_MEM_OBJECT_IMAGE1D_BUFFER` image type, or an image created from
another memory object (image or buffer), if the `CL_MEM_READ_WRITE`,
`CL_MEM_READ_ONLY` or `CL_MEM_WRITE_ONLY` values are not specified in
`flags`, they are inherited from the corresponding memory access
qualifers associated with `mem_object`. The `CL_MEM_USE_HOST_PTR`,
`CL_MEM_ALLOC_HOST_PTR` and `CL_MEM_COPY_HOST_PTR` values cannot be
specified in `flags` but are inherited from the corresponding memory
access qualifiers associated with `mem_object`. If
`CL_MEM_COPY_HOST_PTR` is specified in the memory access qualifier
values associated with `mem_object` it does not imply any additional
copies when the image is created from `mem_object`. If the
`CL_MEM_HOST_WRITE_ONLY`, `CL_MEM_HOST_READ_ONLY` or
`CL_MEM_HOST_NO_ACCESS` values are not specified in `flags`, they are
inherited from the corresponding memory access qualifiers associated
with `mem_object`.

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

`image_format`  
A pointer to a structure that describes format properties of the image
to be allocated. See [`cl_image_format`](cl_image_format.html) for a
detailed description of the image format descriptor.

`image_desc`  
A pointer to a structure that describes type and dimensions of the image
to be allocated. See [`cl_image_desc`](cl_image_desc.html) for more
information.

`host_ptr`  
A pointer to the image data that may already be allocated by the
application. Refer to table below for a description of how large the
buffer that `host_ptr` points to must be.

| Image Type                        | Size of buffer that `host_ptr`    |
| --- | --- |
||  points to                         |
|  `CL_MEM_OBJECT_IMAGE1D`           |  `≥ image_row_pitch`               |
|  `CL_MEM_OBJECT_IMAGE1D_BUFFER`      `CL_MEM_OBJECT_IMAGE2D`           |  `≥ image_row_pitch`                 `                                 |
|  `CL_MEM_OBJECT_IMAGE3D`           |  ≥ image_row_pitch * image_height`   `≥                                |
|  `CL_MEM_OBJECT_IMAGE1D_ARRAY`     |   image_slice_pitch * image_depth`   `≥ imag                           |
|  `CL_MEM_OBJECT_IMAGE2D_ARRAY`     |  e_slice_pitch * image_array_size`   `≥ imag                           |

`clCreateImage` can be used to create a 2D image from a buffer object or
a 2D image from another 2D image object.

A 2D image can be created from a buffer by specifying a buffer object in
the `image_desc→mem_object` passed to `clCreateImage` for
`image_desc→image_type` = `CL_MEM_OBJECT_IMAGE2D`. If
`image_desc→mem_object` is created with `CL_MEM_USE_HOST_PTR`, the
`host_ptr` specified to `clCreateBuffer` must be aligned to the minimum
of the `CL_DEVICE_IMAGE_BASE_ADDRESS_ALIGNMENT` value for all devices in
the context associated with `image_desc→mem_object` and that support
images.

A 2D image can be created from another 2D image object by specifying an
image object in the `image_desc→mem_object` passed to `clCreateImage`
for `image_desc→image_type` = `CL_MEM_OBJECT_IMAGE2D`. This allows users
to create a new image object that shares the image data store with
`mem_object` but views the pixels in the image with a different channel
order and channel type. The restrictions are:

\(1\) all the values specified in `image_desc` except for `mem_object`
must match the image descriptor information associated with
`mem_object`.

\(2\) The `image_desc` used for creation of `mem_object` may not be
equivalent to image descriptor information associated with `mem_object`.
To ensure the values in `image_desc` will match one can query
`mem_object` for associated information using `clGetImageInfo` function
described in section 5.3.7.

\(3\) the channel data type specified in `image_format` must match the
channel data type associated with `mem_object`. The channel order values
supported are:

| image\_channel\_order specified   | image channel order of            |
| --- | --- |
|  in image\_format                  |  mem\_object                       |
|  `CL_sBGRA`                        |  `CL_BGRA`                         |
|  `CL_BGRA`                         |  `CL_sBGRA`                        |
|  `CL_sRGBA`                        |  `CL_RGBA`                         |
|  `CL_RGBA`                         |  `CL_sRGBA`                        |
|  `CL_sRGB`                         |  `CL_RGB`                          |
|  `CL_RGB`                          |  `CL_sRGB`                         |
|  `CL_sRGBx`                        |  `CL_RGBx`                         |
|  `CL_RGBx`                         |  `CL_sRGBx`                        |

\(4\) The channel order specified must have the same number of channels
as the channel order of `mem_object`.

This allows developers to create a sRGB view of the image from a linear
RGB view or vice-versa i.e. the pixels stored in the image can be
accessed aslinear RGB or sRGB values.

For a 3D image or 2D image array, the image data specified by `host_ptr`
is stored as a linear sequence of adjacent 2D image slices or 2D images
respectively. Each 2D image is a linear sequence of adjacent scanlines.
Each scanline is a linear sequence of image elements.

For a 2D image, the image data specified by `host_ptr` is stored as a
linear sequence of adjacent scanlines. Each scanline is a linear
sequence of image elements.

For a 1D image array, the image data specified by `host_ptr` is stored
as a linear sequence of adjacent 1D images respectively. Each 1D image
or 1D image buffer is a single scanline which is a linear sequence of
adjacent elements.

`errcode_ret`  
Will return an appropriate error code. If `errcode_ret` is NULL, no
error code is returned.

## Notes

If the [`cl_khr_mipmap_image`](cl_khr_mipmap_image.html) extension is
enabled, then a mip-mapped 1D image, 1D image array, 2D image, 2D image
array or 3D image is created by specifying `num_mip_levels` to be a
value &gt; 1 in `cl_image_desc` passed to `clCreateImage`. The
dimensions of a mip-mapped image can be a power of two or a non-power of
two. Each successively smaller mipmap level is half the size of the
previous level. If this half value is a fractional value, it is rounded
down to the nearest integer.

Restrictions

The following restrictions apply when mip-mapped images are created with
`clCreateImage`.

-   `CL_MEM_USE_HOST_PTR` or `CL_MEM_COPY_HOST_PTR` cannot be specified
    if a mipmapped image is created.

-   The `host_ptr` argument to `clCreateImage` must be a NULL value.

-   Mip-mapped images cannot be created for
    `CL_MEM_OBJECT_IMAGE1D_BUFFER` images, depth images or multi-sampled
    (i.e. msaa) images.

## Errors

`clCreateImage` returns a valid non-zero image object and `errcode_ret`
is set to `CL_SUCCESS` if the image object is created successfully.
Otherwise, it returns a NULL value with one of the following error
values returned in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if values specified in `flags` are not valid.

-   `CL_INVALID_IMAGE_FORMAT_DESCRIPTOR` if values specified in
    `image_format` are not valid or if `image_format` is NULL.

-   `CL_INVALID_IMAGE_FORMAT_DESCRIPTOR` if a 2D image is created from a
    buffer and the row pitch and base address alignment does not follow
    the rules described for creating a 2D image from a buffer.

-   `CL_INVALID_IMAGE_FORMAT_DESCRIPTOR` if a 2D image is created from a
    2D image object and the rules described above are not followed.

-   `CL_INVALID_IMAGE_DESCRIPTOR` if values specified in `image_desc`
    are not valid or if `image_desc` is NULL.

-   `CL_INVALID_IMAGE_SIZE` if image dimensions specified in
    `image_desc` exceed the maximum image dimensions described in the
    table of allowed values for `param_name` for
    [`clGetDeviceInfo`](clGetDeviceInfo.html) for all devices in
    `context`.

-   `CL_INVALID_HOST_PTR` if `host_ptr` is NULL and
    `CL_MEM_USE_HOST_PTR` or `CL_MEM_COPY_HOST_PTR` are set in `flags`
    or if `host_ptr` is not NULL but `CL_MEM_COPY_HOST_PTR` or
    `CL_MEM_USE_HOST_PTR` are not set in `flags`.

-   `CL_INVALID_VALUE` if an image buffer is being created and the
    buffer object was created with `CL_MEM_WRITE_ONLY` and `flags`
    specifies `CL_MEM_READ_WRITE` or `CL_MEM_READ_ONLY`, or if the
    buffer object was created with `CL_MEM_READ_ONLY` and `flags`
    specifies `CL_MEM_READ_WRITE` or `CL_MEM_WRITE_ONLY`, or if `flags`
    specifies `CL_MEM_USE_HOST_PTR` or `CL_MEM_ALLOC_HOST_PTR` or
    `CL_MEM_COPY_HOST_PTR`.

-   `CL_INVALID_VALUE` if an image buffer is being created or an image
    is being created from another memory object (image or buffer) and
    the `mem_object` object was created with `CL_MEM_HOST_WRITE_ONLY`
    and `flags` specifies `CL_MEM_HOST_READ_ONLY`, or if `mem_object`
    was created with `CL_MEM_HOST_READ_ONLY` and `flags` specifies
    `CL_MEM_HOST_WRITE_ONLY`, or if `mem_object` was created with
    `CL_MEM_HOST_NO_ACCESS` and `flags` specifies
    `CL_MEM_HOST_READ_ONLY` or `CL_MEM_HOST_WRITE_ONLY`.

-   `CL_IMAGE_FORMAT_NOT_SUPPORTED` if the `image_format` is not
    supported.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for image object.

-   `CL_INVALID_OPERATION` if there are no devices in `context` that
    support images (i.e. `CL_DEVICE_IMAGE_SUPPORT` (specified in the
    table of OpenCL Device Queries for
    [`clGetDeviceInfo`](clGetDeviceInfo.html)) is `CL_FALSE`).

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`cl_image_desc`](cl_image_desc.html),
[`cl_image_format`](cl_image_format.html), [Cardinality
Diagram](classDiagram.html),
[`cl_khr_mipmap_image`](cl_khr_mipmap_image.html)

## Specification

[OpenCL 2.1 API Specification, page
128](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=128)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
