
## Parameters

`command_queue`  
Is is a valid host command-queue in which the read command will be
queued. `command_queue` and `buffer` must be created with the same
OpenCL context.

`buffer`  
Refers to a valid buffer object.

`blocking_read`  
Indicates if the read operations are `blocking` or `non-blocking`.

If `blocking_read` is `CL_TRUE` i.e. the read command is blocking,
`clEnqueueReadBufferRect` does not return until the buffer data has been
read and copied into memory pointed to by `ptr`.

If `blocking_read` is `CL_FALSE` i.e. the read command is non-blocking,
`clEnqueueReadBufferRect` queues a non-blocking read command and
returns. The contents of the buffer that `ptr` points to cannot be used
until the read command has completed. The `event` argument argument
returns an event object which can be used to query the execution status
of the read command. When the read command has completed, the contents
of the buffer that `ptr` points to can be used by the application.

`buffer_origin`  
The (*x, y, z*) offset in the memory region associated with `buffer`.
For a 2D rectangle region, the `z` value given by `buffer_origin`\[2\]
should be 0. The offset in bytes is computed as `buffer_origin`\[2\] \*
`buffer_slice_pitch` + `buffer_origin`\[1\] \* `buffer_row_pitch` +
`buffer_origin`\[0\].

`host_origin`  
The (*x, y, z*) offset in the memory region pointed to by `ptr`. For a
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
The pointer to buffer in host memory where data is to be read into.

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
Returns an event object that identifies this particular read command and
can be used to query or queue a wait for this particular command to
complete. `event` can be NULL in which case it will not be possible for
the application to query the status of this command or queue a wait for
this command to complete. If the `event_wait_list` and the `event`
arguments are not NULL, the `event` argument should not refer to an
element of the `event_wait_list` array.

## Notes

Calling `clEnqueueReadBufferRect` to read a region of the buffer object
with the `ptr` argument value set to `host_ptr` and `host_origin`,
`buffer_origin` values are the same, where `host_ptr` is a pointer to
the memory region specified when the buffer object being read is created
with `CL_MEM_USE_HOST_PTR`, must meet the same requirements given for
[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html):

-   All commands that use this buffer object or a memory object (buffer
    or image) created from this buffer object have finished execution
    before the read command begins execution.

-   The buffer object or memory objects created from this buffer object
    are not mapped.

-   The buffer object or memory objects created from this buffer object
    are not used by any command-queue until the read command has
    finished execution.

## Errors

`clEnqueueReadBufferRect` returns `CL_SUCCESS` if the function is
executed successfully. Otherwise, it returns one of the following
errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and `buffer` are not the same or if the context associated with
    `command_queue` and events in `event_wait_list` are not the same.

-   `CL_INVALID_MEM_OBJECT` if `buffer` is not a valid buffer object.

-   `CL_INVALID_VALUE` if the region being read specified by
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

-   `CL_INVALID_OPERATION` if `clEnqueueReadBufferRect` is called on
    `buffer` which has been created with `CL_MEM_HOST_WRITE_ONLY` or
    `CL_MEM_HOST_NO_ACCESS`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html),
[`clEnqueueCopyBufferRect`](clEnqueueCopyBufferRect.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clEnqueueWriteBufferRect`](clEnqueueWriteBufferRect.html),
[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html)

## Specification

[OpenCL 2.1 API Specification, page
112](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=112)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
