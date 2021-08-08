
## Parameters

`command_queue`  
The host command-queue in which the copy command will be queued. The
OpenCL context associated with `command_queue`, `src_buffer`, and
`dst_buffer` must be the same.

`src_offset`  
The offset where to begin copying data from `src_buffer`.

`dst_offset`  
The offset where to begin copying data into `dst_buffer`.

`size`  
Refers to the size in bytes to copy.

`event_wait_list` `num_events_in_wait_list`  
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

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`,
    `src_buffer`, and `dst_buffer` are not the same or if the context
    associated with `command_queue` and events in `event_wait_list` are
    not the same.

-   `CL_INVALID_MEM_OBJECT` if `src_buffer` and `dst_buffer` are not
    valid buffer objects.

-   `CL_INVALID_VALUE` if `src_offset`, `dst_offset`, `size`,
    `src_offset` + `size`, or `dst_offset` + `size` require accessing
    elements outside the `src_buffer` and `dst_buffer` buffer objects
    respectively.

-   `CL_INVALID_VALUE` if `size` is 0.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` is > 0, or `event_wait_list` is not NULL
    and `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_MISALIGNED_SUB_BUFFER_OFFSET` if `src_buffer` is a sub-buffer
    object and `offset` specified when the sub-buffer object is created
    is not aligned to `CL_DEVICE_MEM_BASE_ADDR_ALIGN` value for device
    associated with `queue`.

-   `CL_MISALIGNED_SUB_BUFFER_OFFSET` if `dst_buffer` is a sub-buffer
    object and `offset` specified when the sub-buffer object is created
    is not aligned to `CL_DEVICE_MEM_BASE_ADDR_ALIGN` value for device
    associated with `queue`.

-   `CL_MEM_COPY_OVERLAP` if `src_buffer` and `dst_buffer` are the same
    buffer or subbuffer object and the source and destination regions
    overlap or if `src_buffer` and `dst_buffer` are different
    sub-buffers of the same associated buffer object and they overlap.
    The regions overlap if `src_offset` ≤ `dst_offset` ≤ `src_offset` +
    size - 1, or if `dst_offset` ≤ `src_offset` ≤ `dst_offset` + size -
    1.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with `src_buffer` or `dst_buffer`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clCreateBuffer`](clCreateBuffer.html),
[`clCreateSubBuffer`](clCreateSubBuffer.html),
[`clEnqueueCopyBufferToImage`](clEnqueueCopyBufferToImage.html),
[`clEnqueueCopyImageToBuffer`](clEnqueueCopyImageToBuffer.html)

## Specification

[OpenCL 2.1 API Specification, page
117](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=117)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
