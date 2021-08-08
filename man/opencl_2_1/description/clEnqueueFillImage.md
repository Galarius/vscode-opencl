
## Parameters

`command_queue`  
Refers to the host command-queue in which the fill command will be
queued. The OpenCL context associated with `command_queue` and `image`
must be the same.

`image`  
A valid image object.

`fill_color`  
The color used to fill the image. The fill color is a single floating
point value if the channel order is `CL_DEPTH`. Otherwise, the fill
color is a four component RGBA floating-point color value if the `image`
channel data type is not an unnormalized signed or unsigned integer
type, is a four component signed integer value if the `image` channel
data type is an unnormalized signed integer type and is a four component
unsigned integer value if the `image` channel data type is an
unnormalized unsigned integer type. The fill color will be converted to
the appropriate image channel format and order associated with `image`
as described in sections 6.12.14 and 8.3.

`origin`  
Defines the (*x, y, z*) offset in pixels in the 1D, 2D, or 3D image, the
(*x, y*) offset and the image index in the image array or the (x) offset
and the image index in the 1D image array. If `image` is a 2D image
object, `origin`\[2\] must be 0. If `image` is a 1D image or 1D image
buffer object, `origin`\[1\] and `origin`\[2\] must be 0. If `image` is
a 1D image array object, `origin`\[2\] must be 0. If `image` is a 1D
image array object, `origin`\[1\] describes the image index in the 1D
image array. If `image` is a 2D image array object, `origin`\[2\]
describes the image index in the 2D image array.

`region`  
Defines the (*width, height, depth*) in pixels of the 1D, 2D or 3D
rectangle, the (*width, height*) in pixels of the 2D rectangle and the
number of images of a 2D image array or the (*width*) in pixels of the
1D rectangle and the number of images of a 1D image array. If `image` is
a 2D image object, `region`\[2\] must be 1. If `image` is a 1D image or
1D image buffer object, `region`\[1\] and `region`\[2\] must be 1. If
`image` is a 1D image array object, `region`\[2\] must be 1. The values
in `region` cannot be 0.

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
Returns an event object that identifies this particular write command
and can be used to query or queue a wait for this particular command to
complete. `event` can be NULL in which case it will not be possible for
the application to query the status of this command or queue a wait for
this command to complete.
[`clEnqueueBarrierWithWaitList`](clEnqueueBarrierWithWaitList.html) can
be used instead. If the `event_wait_list` and the `event` arguments are
not NULL, the `event` argument should not refer to an element of the
`event_wait_list` array.

## Notes

The usage information which indicates whether the memory object can be
read or written by a kernel and/or the host and is given by the
`cl_mem_flags` argument value specified when `image` is created is
ignored by `clEnqueueFillImage`.

If the [`cl_khr_mipmap_image`](cl_khr_mipmap_image.html) extension is
enabled, calls to [`clEnqueueFillImage`](#) can be used to write to a
specific mip-level of a mip-mapped image. If image argument is a 1D
image, origin\[1\] specifies the mip-level to use. If image argument is
a 1D image array, origin\[2\] specifies the mip-level to use. If image
argument is a 2D image, origin\[2\] specifies the mip-level to use. If
image argument is a 2D image array or a 3D image, origin\[3\] specifies
the mip-level to use.

## Errors

`clEnqueueFillImage` return `CL_SUCCESS` if the function is executed
successfully. Otherwise, it returns one of the following errors.

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and `image` are not the same or if the context associated with
    `command_queue` and events in `event_wait_list` are not the same.

-   `CL_INVALID_MEM_OBJECT` if `image` is not a valid image object.

-   `CL_INVALID_VALUE` if `fill_color` is NULL.

-   `CL_INVALID_VALUE` if the region being written specified by `origin`
    and `region` is out of bounds or if `ptr` is a NULL value.

-   `CL_INVALID_VALUE` if values in `origin` and `region` do not follow
    rules described in the argument description for `origin` and
    `region`.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_INVALID_IMAGE_SIZE` if image dimensions (image width, height,
    specified or compute row and/or slice pitch) for `image` are not
    supported by device associated with `queue`.

-   `CL_IMAGE_FORMAT_NOT_SUPPORTED` if image format (image channel order
    and data type) for `image` are not supported by device associated
    with `queue`.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with `image`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueReadImage`](clEnqueueReadImage.html),
[`clEnqueueWriteImage`](clEnqueueWriteImage.html),
[`clEnqueueCopyImage`](clEnqueueCopyImage.html),
[`clEnqueueBarrierWithWaitList`](clEnqueueBarrierWithWaitList.html)

## Specification

[OpenCL 2.1 API Specification, page
147](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=147)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
