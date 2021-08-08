
## Parameters

`command_queue`  
Is is a valid host command-queue in which the write command will be
queued. `command_queue` and `buffer` must be created with the same
OpenCL context.

`buffer`  
Refers to a valid buffer object.

`blocking_write`  
Indicates if the write operations are `blocking` or `non-blocking`. If
`blocking_write` is `CL_TRUE`, the OpenCL implementation copies the data
referred to by `ptr` and enqueues the write operation in the
command-queue. The memory pointed to by `ptr` can be reused by the
application after the `clEnqueueWriteBufferRect` call returns.

If `blocking_write` is `CL_FALSE`, the OpenCL implementation will use
`ptr` to perform a nonblocking write. As the write is non-blocking the
implementation can return immediately. The memory pointed to by `ptr`
cannot be reused by the application after the call returns. The `event`
argument returns an event object which can be used to query the
execution status of the write command. When the write command has
completed, the memory pointed to by `ptr` can then be reused by the
application.

`buffer_origin`  
The (`x, y, z`) offset in the memory region associated with `buffer`.
For a 2D rectangle region, the `z` value given by `buffer_origin`\[2\]
should be 0. The offset in bytes is computed as `buffer_origin`\[2\] \*
`buffer_slice_pitch` + `buffer_origin`\[1\] \* `buffer_row_pitch` +
`buffer_origin`\[0\].

`host_origin`  
The (`x, y, z`) offset in the memory region pointed to by `ptr`. For a
2D rectangle region, the `z` value given by `host_origin`\[2\] should be
0. The offset in bytes is computed as `host_origin`\[2\] \*
`host_slice_pitch` + `host_origin`\[1\] \* `host_row_pitch` +
`host_origin`\[0\].

`region`  
The (`width` in bytes, `height` in rows, `depth` in slices) of the 2D or
3D rectangle being read or written. For a 2D rectangle copy, the `depth`
value given by `region`\[2\] should be 1. The values in region cannot
be 0.

`buffer_row_pitch`  
The length of each row in bytes to be used for the memory region
associated with `buffer`. If `buffer_row_pitch` is 0, `buffer_row_pitch`
is computed as `region`\[0\].

`buffer_slice_pitch`  
The length of each 2D slice in bytes to be used for the memory region
associated with `buffer`. If `buffer_slice_pitch` is 0,
`buffer_slice_pitch` is computed as `region`\[1\] \* `buffer_row_pitch`.

`host_row_pitch`  
The length of each row in bytes to be used for the memory region pointed
to by `ptr`. If `host_row_pitch` is 0, `host_row_pitch` is computed as
`region`\[0\].

`host_slice_pitch`  
The length of each 2D slice in bytes to be used for the memory region
pointed to by `ptr`. If `host_slice_pitch` is 0, `host_slice_pitch` is
computed as `region`\[1\] \* `host_row_pitch`.

`ptr`  
The pointer to buffer in host memory where data is to be written from.

`event_wait_list` `num_events_in_wait_list`  
`event_wait_list` and `num_events_in_wait_list` specify events that need
to complete before this particular command can be executed. If
`event_wait_list` is NULL, then this particular command does not wait on
any event to complete. If `event_wait_list` is NULL,
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
this command to complete. If the `event_wait_list` and the `event`
arguments are not NULL, the `event` argument should not refer to an
element of the `event_wait_list` array.

## Notes

Calling `clEnqueueWriteBufferRect` to update the latest bits in a region
of the buffer object with the `ptr` argument value set to `host_ptr` and
`host_origin`, `buffer_origin` values are the same, where `host_ptr` is
a pointer to the memory region specified when the buffer object being
written is created with `CL_MEM_USE_HOST_PTR`, must meet the following
requirements in order to avoid undefined behavior:

-   The host memory region given by (`buffer_origin region`) contains
    the latest bits when the enqueued write command begins execution.

-   The buffer object or memory objects created from this buffer object
    are not mapped.

-   The buffer object or memory objects created from this buffer object
    are not used by any command-queue until the write command has
    finished execution.

## Errors

`clEnqueueWriteBufferRect` returns `CL_SUCCESS` if the function is
executed successfully. Otherwise, it returns one of the following
errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and `buffer` are not the same or if the context associated with
    `command_queue` and events in `event_wait_list` are not the same.

-   `CL_INVALID_MEM_OBJECT` if `buffer` is not a valid buffer object.

-   `CL_INVALID_VALUE` if the region being written specified by
    (`buffer_origin`, `region`, `buffer_row_pitch`,
    `buffer_slice_pitch`) is out of bounds.

-   `CL_INVALID_VALUE` if `ptr` is a NULL value.

-   `CL_INVALID_VALUE` if any `region` array element is 0.

-   `CL_INVALID_VALUE` if `buffer_row_pitch` is not 0 and is less than
    `region`\[0\].

-   `CL_INVALID_VALUE` if `host_row_pitch` is not 0 and is less than
    `region`\[0\].

-   `CL_INVALID_VALUE` if `buffer_slice_pitch` is not 0 and is less than
    `region`\[1\] \* `buffer_row_pitch` and not a multiple of
    `buffer_row_pitch`.

-   `CL_INVALID_VALUE` if `host_slice_pitch` is not 0 and is less than
    `region`\[1\] \* `host_row_pitch` and not a multiple of
    `host_row_pitch`.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_MISALIGNED_SUB_BUFFER_OFFSET` if `buffer` is a sub-buffer object
    and `offset` specified when the sub-buffer object is created is not
    aligned to `CL_DEVICE_MEM_BASE_ADDR_ALIGN` value for device
    associated with `queue`.

-   `CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST` if the read and write
    operations are blocking and the execution status of any of the
    events in `event_wait_list` is a negative integer value.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with `buffer`.

-   `CL_INVALID_OPERATION` if `clEnqueueWriteBufferRect` is called on
    `buffer` which has been created with `CL_MEM_HOST_READ_ONLY` or
    `CL_MEM_HOST_NO_ACCESS`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html),
[`clEnqueueCopyBufferRect`](clEnqueueCopyBufferRect.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clEnqueueReadBufferRect`](clEnqueueReadBufferRect.html),
[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html)

## Specification

[OpenCL 2.1 API Specification, page
113](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=113)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
