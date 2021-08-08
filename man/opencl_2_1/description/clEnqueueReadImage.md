
## Parameters

`command_queue`  
Refers to the host command-queue in which the read command will be
queued. `command_queue` and `image` must be created with the same OpenCL
context.

`image`  
Refers to a valid image or image array object.

`blocking_read`  
Indicates if the read operations are `blocking` or `non-blocking`.

If `blocking_read` is `CL_TRUE` i.e. the read command is blocking,
`clEnqueueReadImage` does not return until the buffer data has been read
and copied into memory pointed to by `ptr`.

If `blocking_read` is `CL_FALSE` i.e. map operation is non-blocking,
`clEnqueueReadImage` queues a non-blocking read command and returns. The
contents of the buffer that `ptr` points to cannot be used until the
read command has completed. The `event` argument returns an event object
which can be used to query the execution status of the read command.
When the read command has completed, the contents of the buffer that
`ptr` points to can be used by the application.

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
image is a 1D image array object, `region`\[2\] must be 1. The values in
`region` cannot be 0.

`row_pitch`  
The length of each row in bytes. This value must be greater than or
equal to the element size in bytes \* `width`. If `row_pitch` is set to
0, the appropriate row pitch is calculated based on the size of each
element in bytes multiplied by `width`.

`slice_pitch`  
Size in bytes of the 2D slice of the 3D region of a 3D image or each
image of a 1D or 2D image array being read. This must be 0 if `image` is
a 1D or 2D image. Otherwise this value must be greater than or equal to
`row_pitch` \* `height`. If `slice_pitch` is set to 0, the appropriate
slice pitch is calculated based on the `row_pitch` \* `height`.

`ptr`  
The pointer to a buffer in host memory where image data is to be written
to.

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
Returns an event object that identifies this particular read command and
can be used to query or queue a wait for this particular command to
complete. `event` can be NULL in which case it will not be possible for
the application to query the status of this command or queue a wait for
this command to complete. If the `event_wait_list` and the `event`
arguments are not NULL, the `event` argument should not refer to an
element of the `event_wait_list` array.

## Notes

Calling `clEnqueueReadImage` to read a region of the `image` with the
`ptr` argument value set to `host_ptr` + (`origin`\[2\] \*
`image slice pitch` + `origin`\[1\] \* `image row pitch` + `origin`\[0\]
\* `bytes per pixel`), where `host_ptr` is a pointer to the memory
region specified when the `image` being read is created with
`CL_MEM_USE_HOST_PTR`, must meet the following requirements in order to
avoid undefined behavior:

-   All commands that use this image object have finished execution
    before the read command begins execution.

-   The `row_pitch` and `slice_pitch` argument values in
    `clEnqueueReadImage` must be set to the image row pitch and slice
    pitch.

-   The image object is not mapped.

-   The image object is not used by any command-queue until the read
    command has finished execution.

If the mipmap extensions are enabled with
[`cl_khr_mipmap_image`](cl_khr_mipmap_image.html), calls to
`clEnqueueReadImage`, [`clEnqueueWriteImage`](clEnqueueWriteImage.html)
and [`clEnqueueMapImage`](clEnqueueMapImage.html) can be used to read
from or write to a specific mip-level of a mip-mapped image. If image
argument is a 1D image, `origin`\[1\] specifies the mip-level to use. If
image argument is a 1D image array, `origin`\[2\] specifies the
mip-level to use. If image argument is a 2D image, `origin`\[3\]
specifies the mip-level to use. If image argument is a 2D image array or
a 3D image, `origin`\[3\] specifies the mip-level to use.

## Errors

`clEnqueueReadImage` returns `CL_SUCCESS` if the function is executed
successfully. Otherwise, it returns one of the following errors.

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and `image` are not the same or if the context associated with
    `command_queue` and events in `event_wait_list` are not the same.

-   `CL_INVALID_MEM_OBJECT` if `image` is not a valid image object.

-   `CL_INVALID_VALUE` if the region being read specified by `origin`
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

-   `CL_INVALID_OPERATION` if the device associated with `command_queue`
    does not support images (i.e. `CL_DEVICE_IMAGE_SUPPORT` specified in
    the table of allowed values for `param_name` for
    [`clGetDeviceInfo`](clGetDeviceInfo.html) is `CL_FALSE`).

-   `CL_INVALID_OPERATION` if `clEnqueueReadImage` is called on `image`
    which has been created with `CL_MEM_HOST_WRITE_ONLY` or
    `CL_MEM_HOST_NO_ACCESS`

-   `CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST` if the read and write
    operations are blocking and the execution status of any of the
    events in `event_wait_list` is a negative integer value.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueWriteImage`](clEnqueueWriteImage.html),
[`clEnqueueCopyImage`](clEnqueueCopyImage.html),
[`cl_khr_mipmap_image`](cl_khr_mipmap_image.html)

## Specification

[OpenCL 2.1 API Specification, page
140](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=140)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
