
## Parameters

`command_queue`  
The host command-queue in which the copy command will be queued. The
OpenCL context associated with `command_queue`, `src_buffer`, and
`dst_buffer` must be the same.

`src_origin`  
The (*x, y, z*) offset in the memory region associated with
`src_buffer`. For a 2D rectangle region, the `z` value given by
`src_origin`\[2\] should be 0. The offset in bytes is computed as
`src_origin`\[2\] \* `src_slice_pitch` + `src_origin`\[1\] \*
`src_row_pitch` + `src_origin`\[0\].

`dst_origin`  
The (*x, y, z*) offset in the memory region associated with
`dst_buffer`. For a 2D rectangle region, the `z` value given by
`dst_origin`\[2\] should be 0. The offset in bytes is computed as
`dst_origin`\[2\] \* `dst_slice_pitch` + `dst_origin`\[1\] \*
`dst_row_pitch` + `dst_origin`\[0\].

`region`  
The (`width` in bytes, `height` in rows, `depth` in slices) in bytes of
the 2D or 3D rectangle being copied. For a 2D rectangle, the `depth`
value given by `region`\[2\] should be 1. The values in `region` cannot
be 0.

`src_row_pitch`  
The length of each row in bytes to be used for the memory region
associated with `src_buffer`. If `src_row_pitch` is 0, `src_row_pitch`
is computed as `region`\[0\].

`src_slice_pitch`  
The length of each 2D slice in bytes to be used for the memory region
associated with `src_buffer`. If `src_slice_pitch` is 0,
`src_slice_pitch` is computed as `region`\[1\] \* `src_row_pitch`.

`dst_row_pitch`  
The length of each row in bytes to be used for the memory region
associated with `dst_buffer`. If `dst_row_pitch` is 0, `dst_row_pitch`
is computed as `region`\[0\].

`dst_slice_pitch`  
The length of each 2D slice in bytes to be used for the memory region
associated with `dst_buffer`. If `dst_slice_pitch` is 0,
`dst_slice_pitch` is computed as `region`\[1\] \* `dst_row_pitch`.

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

## Notes

`clEnqueueCopyBufferRect` enqueues a command to copy a 2D or 3D
rectangular region from the buffer object identified by `src_buffer` to
a 2D or 3D region in the buffer object identified by `dst_buffer`.
Copying begins at the source offset and destination offset which are
computed as described in the description for `src_origin` and
`dst_origin`.

Each byte of the region’s width is copied from the source offset to the
destination offset. After copying each width, the source and destination
offsets are incremented by their respective source and destination row
pitches. After copying each 2D rectangle, the source and destination
offsets are incremented by their respective source and destination slice
pitches.

|   |   |
---|---|
|  Note                              |  If `src_buffer` and `dst_buffer`    are the same buffer object,         `src_row_pitch` must equal          `dst_row_pitch` and                 `src_slice_pitch` must equal        `dst_slice_pitch`.                |

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

-   `CL_INVALID_VALUE` if (`src_origin`, `region`, `src_row_pitch`,
    `src_slice_pitch`) or (`dst_origin`, `region`, `dst_row_pitch`,
    `dst_slice_pitch`) require accessing elements outside the
    `src_buffer` and `dst_buffer` objects respectively.

-   `CL_INVALID_VALUE` if any `region` array element is 0.

-   `CL_INVALID_VALUE` if `src_row_pitch` is not 0 and is less than
    `region`\[0\].

-   `CL_INVALID_VALUE` if `dst_row_pitch` is not 0 and is less than
    `region`\[0\].

-   `CL_INVALID_VALUE` if `src_slice_pitch` is not 0 and is less than
    `region`\[1\] \* `src_row_pitch` or if `src_slice_pitch` is not 0
    and is not a multiple of `src_row_pitch`.

-   `CL_INVALID_VALUE` if `dst_slice_pitch` is not 0 and is less than
    `region`\[1\] \* `dst_row_pitch` or if `dst_slice_pitch` is not 0
    and is not a multiple of `dst_row_pitch`.

-   `CL_INVALID_VALUE` if `src_buffer` and `dst_buffer` are the same
    buffer object and `src_slice_pitch` is not equal to
    `dst_slice_pitch` and `src_row_pitch` is not equal to
    `dst_row_pitch`.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` is > 0, or `event_wait_list` is not NULL
    and `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_MEM_COPY_OVERLAP` if `src_buffer` and `dst_buffer` are the same
    buffer or sub-buffer object and the source and destination regions
    overlap or if `src_buffer` and `dst_buffer` are different
    sub-buffers of the same associated buffer object and they overlap.
    Refer to Appendix D in the OpenCL specification for details on how
    to determine if source and destination regions overlap.

-   `CL_MISALIGNED_SUB_BUFFER_OFFSET` if `src_buffer` is a sub-buffer
    object and `offset` specified when the sub-buffer object is created
    is not aligned to `CL_DEVICE_MEM_BASE_ADDR_ALIGN` value for device
    associated with `queue`.

-   `CL_MISALIGNED_SUB_BUFFER_OFFSET` if `dst_buffer` is a sub-buffer
    object and `offset` specified when the sub-buffer object is created
    is not aligned to `CL_DEVICE_MEM_BASE_ADDR_ALIGN` value for device
    associated with `queue`.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with `src_buffer` or `dst_buffer`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueReadBufferRect`](clEnqueueReadBufferRect.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clEnqueueWriteBufferRect`](clEnqueueWriteBufferRect.html),
[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html),
[`clCreateBuffer`](clCreateBuffer.html),
[`clCreateSubBuffer`](clCreateSubBuffer.html),
[`clEnqueueCopyBufferToImage`](clEnqueueCopyBufferToImage.html),
[`clEnqueueCopyImageToBuffer`](clEnqueueCopyImageToBuffer.html)

## Specification

[OpenCL 2.1 API Specification, page
119](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=119)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
