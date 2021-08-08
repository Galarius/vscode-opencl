
## Parameters

`command_queue`  
A valid host command queue.

`event_wait_list`, `num_events_in_wait_list`  
Specify events that need to complete before this particular command can
be executed.

If `event_wait_list` is NULL, `num_events_in_wait_list` must be 0. If
`event_wait_list` is not NULL, the list of events pointed to by
`event_wait_list` must be valid and `num_events_in_wait_list` must be
greater than 0. The events specified in `event_wait_list` act as
synchronization points. The context associated with events in
`event_wait_list` and `command_queue` must be the same. The memory
associated with `event_wait_list` can be reused or freed after the
function returns.

If `event_wait_list` is NULL, then this particular command waits until
all previous enqueued commands to command\_queue have completed.

`event`  
Returns an event object that identifies this particular command. Event
objects are unique and can be used to identify this barrier command
later on. `event` can be NULL in which case it will not be possible for
the application to query the status of this command or queue a wait for
this command to complete. If the `event_wait_list` and the `event`
arguments are not NULL, the `event` argument should not refer to an
element of the `event_wait_list` array.

## Notes

Enqueues a barrier command which waits for either a list of events to
complete, or if the list is empty it waits for all commands previously
enqueued in `command_queue` to complete before it completes. This
command blocks command execution, that is, any following commands
enqueued after it do not execute until it completes. This command
returns an `event` which can be waited on, i.e. this event can be waited
on to insure that all events either in the `event_wait_list` or all
previously enqueued commands, queued before this command to
`command_queue`, have completed.

## Errors

Returns `CL_SUCCESS` if the function was successfully executed.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command queue.

-   `CL_INVALID_CONTEXT` if context associated with `command_queue` and
    events in `event_wait_list` are not the same.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueFillBuffer`](clEnqueueFillBuffer.html),
[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html),
[`clEnqueueCopyBufferRect`](clEnqueueCopyBufferRect.html),
[`clEnqueueFillImage`](clEnqueueFillImage.html),
[`clEnqueueCopyImage`](clEnqueueCopyImage.html),
[`clEnqueueCopyImageToBuffer`](clEnqueueCopyImageToBuffer.html),
[`clEnqueueCopyBufferToImage`](clEnqueueCopyBufferToImage.html),
[`clEnqueueUnmapMemObject`](clEnqueueUnmapMemObject.html)

## Specification

[OpenCL 2.1 API Specification, page
260](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=260)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
