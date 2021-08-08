
## Parameters

`command_queue`  
Must be a valid host command-queue.

`memobj`  
A valid memory (buffer or image) object. The OpenCL context associated
with `command_queue` and `memobj` must be the same.

`mapped_ptr`  
The host address returned by a previous call to
[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) or
[`clEnqueueMapImage`](clEnqueueMapImage.html) for `memobj`.

`event_wait_list ,` `num_events_in_wait_list`  
Specify events that need to complete before `clEnqueueUnmapMemObject`
can be executed. If `event_wait_list` is NULL, then
`clEnqueueUnmapMemObject` does not wait on any event to complete. If
`event_wait_list` is NULL, `num_events_in_wait_list` must be 0. If
`event_wait_list` is not NULL, the list of events pointed to by
`event_wait_list` must be valid and `num_events_in_wait_list` must be
greater than 0. The events specified in `event_wait_list` act as
synchronization points. The context associated with events in
`event_wait_list` and `command_queue` must be the same. The memory
associated with `event_wait_list` can be reused or freed after the
function returns.

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

Reads or writes from the host using the pointer returned by
[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) or
[`clEnqueueMapImage`](clEnqueueMapImage.html) are considered to be
complete.

[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) and
[`clEnqueueMapImage`](clEnqueueMapImage.html) increment the mapped count
of the memory object. The initial mapped count value of a memory object
is zero. Multiple calls to
[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) or
[`clEnqueueMapImage`](clEnqueueMapImage.html) on the same memory object
will increment this mapped count by appropriate number of calls.
`clEnqueueUnmapMemObject` decrements the mapped count of the memory
object.

[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) and
[`clEnqueueMapImage`](clEnqueueMapImage.html) act as synchronization
points for a region of the buffer object being mapped.

Accessing mapped regions of a memory object

This section describes the behavior of OpenCL commands that access
mapped regions of a memory object.

The contents of the region of a memory object and associated memory
objects (sub-buffer objects or 1D image buffer objects that overlap this
region) mapped for writing (i.e. `CL_MAP_WRITE` or
`CL_MAP_WRITE_INVALIDATE_REGION` is set in `map_flags` argument to
[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) or
[`clEnqueueMapImage`](clEnqueueMapImage.html)) are considered to be
undefined until this region is unmapped.

Multiple commands in command-queues can map a region or overlapping
regions of a memory object and associated memory objects (sub-buffer
objects or 1D image buffer objects that overlap this region) for reading
(i.e. `map_flags` = `CL_MAP_READ`). The contents of the regions of a
memory object mapped for reading can also be read by kernels and other
OpenCL commands (such as
[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html)) executing on a
device(s).

Mapping (and unmapping) overlapped regions in a memory object and/or
associated memory objects (sub-buffer objects or 1D image buffer objects
that overlap this region) for writing is an error and will result in
`CL_INVALID_OPERATION` error returned by
[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) or
[`clEnqueueMapImage`](clEnqueueMapImage.html).

If a memory object is currently mapped for writing, the application must
ensure that the memory object is unmapped before any enqueued kernels or
commands that read from or write to this memory object or any of its
associated memory objects (sub-buffer or 1D image buffer objects) or its
parent object (if the memory object is a sub-buffer or 1D image buffer
object) begin execution; otherwise the behavior is undefined.

If a memory object is currently mapped for reading, the application must
ensure that the memory object is unmapped before any enqueued kernels or
commands that write to this memory object or any of its associated
memory objects (sub-buffer or 1D image buffer objects) or its parent
object (if the memory object is a sub-buffer or 1D image buffer object)
begin execution; otherwise the behavior is undefined.

A memory object is considered as mapped if there are one or more active
mappings for the memory object irrespective of whether the mapped
regions span the entire memory object.

Accessing the contents of the memory region referred to by the mapped
pointer that has been unmapped is undefined.

The mapped pointer returned by
[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) or
[`clEnqueueMapImage`](clEnqueueMapImage.html) can be used as `ptr`
argument value to [`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clEnqueueReadBufferRect`](clEnqueueReadBufferRect.html),
[`clEnqueueWriteBufferRect`](clEnqueueWriteBufferRect.html),
[`clEnqueueReadImage`](clEnqueueReadImage.html), and
[`clEnqueueWriteImage`](clEnqueueWriteImage.html), provided the rules
described above are adhered to.

## Errors

`clEnqueueUnmapMemObject` returns `CL_SUCCESS` if the function is
executed successfully. Otherwise, it returns one of the following
errors:.

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_MEM_OBJECT` if `memobj` is not a valid memory object or
    is a pipe object.

-   `CL_INVALID_VALUE` if `mapped_ptr` is not a valid pointer returned
    by [`clEnqueueMapBuffer`](clEnqueueMapBuffer.html) or
    [`clEnqueueMapImage`](clEnqueueMapImage.html) for `memobj`.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and `memobj` are not the same or if the context associated with
    `command_queue` and events in `event_wait_list` are not the same.

## Also see

[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html),
[`clEnqueueMapImage`](clEnqueueMapImage.html)

## Specification

[OpenCL 2.1 API Specification, page
165](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=165)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
