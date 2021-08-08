
## Parameters

`command_queue`  
Refers to the host command-queue in which the copy command will be
queued. The OpenCL context associated with `command_queue`, `src_image`
and `dst_image` must be the same.

`src_image,` `dst_image,`  
Can be 1D, 2D, 3D image or a 1D, 2D image array objects. It is possible
to copy subregions between any combinations of source and destination
types, provided that the dimensions of the subregions are the same e.g.,
one can copy a rectangular region from a 2D image to a slice of a 3D
image.

`src_origin`  
Defines the (x, y, z) offset in pixels in the 1D, 2D or 3D image, the
(x, y) offset and the image index in the 2D image array or the (x)
offset and the image index in the 1D image array. If `image` is a 2D
image object, `src_origin`\[2\] must be 0. If `src_image` is a 1D image
object, `src_origin`\[1\] and `src_origin`\[2\] must be 0. If
`src_image` is a 1D image array object, `src_origin`\[2\] must be 0. If
`src_image` is a 1D image array object, `src_origin`\[1\] describes the
image index in the 1D image array. If `src_image` is a 2D image array
object, `src_origin`\[2\] describes the image index in the 2D image
array.

`dst_origin`  
Defines the (x, y, z) offset in pixels in the 1D, 2D or 3D image, the
(x, y) offset and the image index in the 2D image array or the (x)
offset and the image index in the 1D image array. If `dst_image` is a 2D
image object, `dst_origin`\[2\] must be 0. If `dst_image` is a 1D image
or 1D image buffer object, `dst_origin`\[1\] and `dst_origin`\[2\] must
be 0. If `dst_image` is a 1D image array object, `dst_origin`\[2\] must
be 0. If `dst_image` is a 1D image array object, `dst_origin`\[1\]
describes the image index in the 1D image array. If `dst_image` is a 2D
image array object, `dst_origin`\[2\] describes the image index in the
2D image array.

`region`  
Defines the *(width, height, depth)* in pixels of the 1D, 2D or 3D
rectangle, the *(width, height)* in pixels of the 2D rectangle and the
number of images of a 2D image array or the *(width)* in pixels of the
1D rectangle and the number of images of a 1D image array. If
`src_image` or `dst_image` is a 2D image object, `region`\[2\] must be
1. If `src_image` or `dst_image` is a 1D image or 1D image buffer
object, `region`\[1\] and `region`\[2\] must be 1. If `src_image` or
`dst_image` is a 1D image array object, `region`\[2\] must be 1. The
values in `region` cannot be 0.

`event_wait_list ,` `num_events_in_wait_list`  
Specify events that need to complete before this particular command can
be executed. If `event_wait_list` is NULL, then this particular command
does not wait on any event to complete. If `event_wait_list` is NULL,
`num_events_in_wait_list` must be 0. If `event_wait_list` is not NULL,
the list of events pointed to by `event_wait_list` must be valid and
`num_events_in_wait_list` must be greater than 0. The events specified
in `event_wait_list` act as synchronization points. The context
associated with events in `event_wait_list` and `command_queue` must be
the same. The memory associated with `event_wait_list` can be reused or
freed after the function returns.

`event`  
Returns an event object that identifies this particular copy command and
can be used to query or queue a wait for this particular command to
complete. `event` can be NULL in which case it will not be possible for
the application to query the status of this command or queue a wait for
this command to complete.
[`clEnqueueBarrierWithWaitList`](clEnqueueBarrierWithWaitList.html) can
be used instead. If the `event_wait_list` and the `event` arguments are
not NULL, the `event` argument should not refer to an element of the
`event_wait_list` array.

## Notes

It is currently a requirement that the `src_image` and `dst_image` image
memory objects for `clEnqueueCopyImage` must have the exact same image
format (i.e. the [`cl_image_format`](cl_image_format.html) descriptor
specified when `src_image` and `dst_image` are created must match).

If the mipmap extensions are enabled with
[`cl_khr_mipmap_image`](cl_khr_mipmap_image.html), calls to
`clEnqueueCopyImage`,
[`clEnqueueCopyImageToBuffer`](clEnqueueCopyImageToBuffer.html), and
[`clEnqueueCopyBufferToImage`](clEnqueueCopyBufferToImage.html) can also
be used to copy from and to a specific mip-level of a mip-mapped image.
If `src_image` argument is a 1D image, `src_origin`\[1\] specifies the
mip-level to use. If `src_image` argument is a 1D image array,
`src_origin`\[2\] specifies the mip-level to use. If `src_image`
argument is a 2D image, `src_origin`\[3\] specifies the mip-level to
use. If `src_image` argument is a 2D image array or a 3D image,
`src_origin`\[3\] specifies the mip-level to use. If `dst_image`
argument is a 1D image, `dst_origin`\[1\] specifies the mip-level to
use. If `dst_image` argument is a 1D image array, `dst_origin`\[2\]
specifies the mip-level to use. If `dst_image` argument is a 2D image,
`dst_origin`\[3\] specifies the mip-level to use. If `dst_image`
argument is a 2D image array or a 3D image, `dst_origin`\[3\] specifies
the mip-level to use.

If the mip level specified is not a valid value, these functions return
the error `CL_INVALID_MIP_LEVEL`.

## Errors

`clEnqueueCopyImage` returns `CL_SUCCESS` if the function is executed
successfully. Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`,
    `src_image` and `dst_image` are not the same or if the context
    associated with `command_queue` and events in `event_wait_list` are
    not the same.

-   `CL_INVALID_MEM_OBJECT` if `src_image` and `dst_image` are not valid
    image objects.

-   `CL_IMAGE_FORMAT_MISMATCH` if `src_image` and `dst_image` do not use
    the same image format.

-   `CL_INVALID_VALUE` if the 2D or 3D rectangular region specified by
    `src_origin` and `src_origin` + `region` refers to a region outside
    `src_image`, or if the 2D or 3D rectangular region specified by
    `dst_origin` and `dst_origin` + `region` refers to a region outside
    `dst_image`.

-   `CL_INVALID_VALUE` if values in `src_origin`, `dst_origin` and
    `region` do not follow rules described in the argument description
    for `src_origin`, `dst_origin` and `region`.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_INVALID_IMAGE_SIZE` if image dimensions (image width, height,
    specified or compute row and/or slice pitch) for `src_image` or
    `dst_image` are not supported by device associated with `queue`.

-   `CL_IMAGE_FORMAT_NOT_SUPPORTED` if image format (image channel order
    and data type) for `src_image` or `dst_image` are not supported by
    device associated with `queue`.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with `src_image` or `dst_image`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

-   `CL_INVALID_OPERATION` if the device associated with `command_queue`
    does not support images (i.e. `CL_DEVICE_IMAGE_SUPPORT` specified in
    the table of OpenCL Device Queries for
    [`clGetDeviceInfo`](clGetDeviceInfo.html) is `CL_FALSE`).

-   `CL_MEM_COPY_OVERLAP` if `src_image` and `dst_image` are the same
    image object and the source and destination regions overlap.

## Also see

[`clEnqueueReadImage`](clEnqueueReadImage.html),
[`clEnqueueWriteImage`](clEnqueueWriteImage.html),
[`cl_khr_mipmap_image`](cl_khr_mipmap_image.html)

## Specification

[OpenCL 2.1 API Specification, page
144](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=144)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
