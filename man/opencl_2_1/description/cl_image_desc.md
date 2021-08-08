
## Members

image\_type  
Describes the image type and must be either `CL_MEM_OBJECT_IMAGE1D`,
`CL_MEM_OBJECT_IMAGE1D_BUFFER`, `CL_MEM_OBJECT_IMAGE1D_ARRAY`,
`CL_MEM_OBJECT_IMAGE2D`, `CL_MEM_OBJECT_IMAGE2D_ARRAY`, or
`CL_MEM_OBJECT_IMAGE3D`.

image\_width  
The width of the image in pixels. For a 2D image and image array, the
image width must be a value >= 1 and ≤ `CL_DEVICE_IMAGE2D_MAX_WIDTH`.
For a 3D image, the image width must be a value ≥ 1 and ≤
`CL_DEVICE_IMAGE3D_MAX_WIDTH`. For a 1D image buffer, the image width
must be a value ≥ 1 and ≤ `CL_DEVICE_IMAGE_MAX_BUFFER_SIZE`. For a 1D
image and 1D image array, the image width must be a value ≥ 1 and ≤
`CL_DEVICE_IMAGE2D_MAX_WIDTH`.

image\_height  
The height of the image in pixels. This is only used if the image is a
2D or 3D image, or a 2D image array. For a 2D image or image array, the
image height must be a value ≥ 1 and ≤ `CL_DEVICE_IMAGE2D_MAX_HEIGHT`.
For a 3D image, the image height must be a value ≥ 1 and ≤
`CL_DEVICE_IMAGE3D_MAX_HEIGHT`.

image\_depth  
The depth of the image in pixels. This is only used if the image is a 3D
image and must be a value ≥ 1 and ≤ `CL_DEVICE_IMAGE3D_MAX_DEPTH`.

image\_array\_size  
The number of images in the image array. This is only used if the image
is a 1D or 2D image array. The values for `image_array_size`, if
specified, must be a value ≥ 1 and ≤ `CL_DEVICE_IMAGE_MAX_ARRAY_SIZE`.

Note that reading and writing 2D image arrays from a kernel with
`image_array_size` = 1 may be lower performance than 2D images.

image\_row\_pitch  
The scan-line pitch in bytes. This must be 0 if `host_ptr` is NULL and
can be either 0 or ≥ `image_width` \* size of element in bytes if
`host_ptr` is not NULL. If `host_ptr` is not NULL and `image_row_pitch`
= 0, `image_row_pitch` is calculated as `image_width` \* size of element
in bytes. If `image_row_pitch` is not 0, it must be a multiple of the
image element size in bytes. For a 2D image created from a buffer, the
pitch specified (or computed if pitch specified is 0) must be a multiple
of the maximum of the `CL_DEVICE_IMAGE_PITCH_ALIGNMENT` value for all
devices in the context associated with `image_desc→mem_object` and that
support images.

image\_slice\_pitch  
The size in bytes of each 2D slice in the 3D image or the size in bytes
of each image in a 1D or 2D image array. This must be 0 if `host_ptr` is
NULL. If `host_ptr` is not NULL, `image_slice_pitch` can be either 0 or
≥ `image_row_pitch` \* `image_height` for a 2D image array or 3D image
and can be either 0 or ≥ `image_row_pitch` for a 1D image array. If
`host_ptr` is not NULL and `image_slice_pitch` = 0, `image_slice_pitch`
is calculated as `image_row_pitch` \* `image_height` for a 2D image
array or 3D image and `image_row_pitch` for a 1D image array. If
`image_slice_pitch` is not 0, it must be a multiple of the
`image_row_pitch`.

num\_mip\_levelnum\_samples  
Must be 0.

mem\_object  
Refers to a valid buffer or image memory object. `mem_object` can be a
buffer memory object if image\_type is `CL_MEM_OBJECT_IMAGE1D_BUFFER` or
`CL_MEM_OBJECT_IMAGE2D` (To create a 2D image from a buffer object that
share the data store between the image and buffer object) . `mem_object`
can be a image object if `image_type` is `CL_MEM_OBJECT_IMAGE2D` (To
create an image object from another image object that share the data
store between these image objects). Otherwise it must be NULL. The image
pixels are taken from the memory object’s data store. When the contents
of the specified memory object’s data store are modified, those changes
are reflected in the contents of the image object and vice-versa at
corresponding sychronization points. For a 1D image buffer object, the
`image_width` \* size of element in bytes must be ≤ size of buffer
object data store. For a 2D image created from a buffer, the
`image_row_pitch * image_height` must be ≤ size of buffer object data
store. For an image object created from another image object, the values
specified in the image descriptor except for `mem_object` must match the
image descriptor information associated with `mem_object`.

## Note

Concurrent reading from, writing to and copying between both a buffer
object and 1D image buffer or 2D image object associated with the buffer
object is undefined. Only reading from both a buffer object and 1D image
buffer or 2D image object associated with the buffer object is defined.

Writing to an image created from a buffer and then reading from this
buffer in a kernel even if appropriate synchronization operations (such
as a barrier) are performed between the writes and reads is undefined.
Similarly, writing to the buffer and reading from the image created from
this buffer with appropriate synchronization between the writes and
reads is undefined.

## Also see

[`cl_image_format`](cl_image_format.html)

## Specification

[OpenCL 2.1 API Specification, page
134](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=134)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
