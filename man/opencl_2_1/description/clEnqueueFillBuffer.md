
## Parameters

`command_queue`  
Refers to the host command-queue in which the fill command will be
queued. The OpenCL context associated with `command_queue` and `buffer`
must be the same.

`buffer`  
A valid buffer object.

`pattern`  
A pointer to the data pattern of size `pattern_size` in bytes. `pattern`
will be used to fill a region in `buffer` starting at `offset` and is
`size` bytes in size. The data pattern must be a scalar or vector
integer or floating-point data type. For example, if `buffer` is to be
filled with a pattern of `float4` values, then `pattern` will be a
pointer to a `cl_float4` value and `pattern_size` will be
`sizeof(cl_float4)`. The maximum value of `pattern_size` is the size of
the largest integer or floating-point vector data type supported by the
OpenCL device. The memory associated with `pattern` can be reused or
freed after the function returns.

`offset`  
The location in bytes of the region being filled in `buffer` and must be
a multiple of `pattern_size`.

`size`  
The size in bytes of region being filled in `buffer` and must be a
multiple of `pattern_size`.

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

Enqueues a command to fill a buffer object with a pattern of a given
pattern size. The usage information which indicates whether the memory
object can be read or written by a kernel and/or the host and is given
by the `cl_mem_flags` argument value specified when `buffer` is created
is ignored by `clEnqueueFillBuffer`.

## Errors

`clEnqueueFillBuffer` returns `CL_SUCCESS` if the function is executed
successfully. Otherwise, it returns one of the following errors.

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and `buffer` are not the same or if the context associated with
    `command_queue` and events in `event_wait_list` are not the same.

-   `CL_INVALID_MEM_OBJECT` if `buffer` is not a valid buffer object.

-   `CL_INVALID_VALUE` if `offset` or `offset` + `size` require
    accessing elements outside the `buffer` buffer object respectively.

-   `CL_INVALID_VALUE` if `pattern` is NULL or if `pattern_size` is 0 or
    if `pattern_size` is not one of {1, 2, 4, 8, 16, 32, 64, 128}.

-   `CL_INVALID_VALUE` if `offset` and `size` are not a multiple of
    `pattern_size`.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_MISALIGNED_SUB_BUFFER_OFFSET` if `buffer` is a sub-buffer object
    and offset specified when the sub-buffer object is created is not
    aligned to `CL_DEVICE_MEM_BASE_ADDR_ALIGN` value for device
    associated with `queue`.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with `buffer`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueBarrierWithWaitList`](clEnqueueBarrierWithWaitList.html)

## Specification

[OpenCL 2.1 API Specification, page
122](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=122)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
