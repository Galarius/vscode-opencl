
## Parameters

`command_queue`  
Must be a valid host command-queue.

`blocking_map`  
Indicates if the map operation is `blocking` or `non-blocking`.

If `blocking_map` is `CL_TRUE`, `clEnqueueMapBuffer` does not return
until the specified region in `buffer` is mapped into the host address
space and the application can access the contents of the mapped region
using the pointer returned by `clEnqueueMapBuffer`.

If `blocking_map` is `CL_FALSE` i.e. map operation is non-blocking, the
pointer to the mapped region returned by `clEnqueueMapBuffer` cannot be
used until the map command has completed. The `event` argument returns
an event object which can be used to query the execution status of the
map command. When the map command is completed, the application can
access the contents of the mapped region using the pointer returned by
`clEnqueueMapBuffer`.

`map_flags`  
A bit-bield with the following supported values.

| cl\_map\_flags                    | Description                       |
| --- | --- |
|  `CL_MAP_READ`                     |  This flag specifies that the        region being mapped in the memory   object is being mapped for          reading.                            The pointer returned by             `clEnqueueMap{Buffer  guaranteed to contain the latest    bits in the region being mapped     when the                            `clEnqueueMap{Buffer  command has completed.            |
|  `CL_MAP_WRITE`                    |  This flag specifies that the        region being mapped in the memory   object is being mapped for          writing.                            The pointer returned by             `clEnqueueMap{Buffer  guaranteed to contain the latest    bits in the region being mapped     when the                            `clEnqueueMap{Buffer  command has completed.            |
|  `CL_MAP_WRITE_INVALIDATE_REGION`  |  This flag specifies that the        region being mapped in the memory   object is being mapped for          writing.                            The contents of the region being    mapped are to be discarded. This    is typically the case when the      region being mapped is              overwritten by the host. This       flag allows the implementation to   no longer guarantee that the        pointer returned by                 `clEnqueueMap{Buffer  contains the latest bits in the     region being mapped which can be    a significant performance           enhancement.                        `CL_MAP_READ` or `CL_MAP_WRITE`     and                                 `CL_MAP_WRITE_INVALIDATE_REGION`    are mutually exclusive.           |

`buffer`  
A valid buffer object. The OpenCL context associated with
`command_queue` and `buffer` must be the same.

`offset,` `size`  
The offset in bytes and the size of the region in the buffer object that
is being mapped.

`event_wait_list,` `num_events_in_wait_list`  
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
this command to complete. If the `event_wait_list` and the `event`
arguments are not NULL, the `event` argument should not refer to an
element of the `event_wait_list` array.

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Notes

The returned pointer maps a region starting at `offset` and is at least
`size` bytes in size. The result of a memory access outside this region
is undefined.

If the buffer object is created with `CL_MEM_USE_HOST_PTR` set in
`mem_flags`, the following will be true:

-   The `host_ptr` specified in [`clCreateBuffer`](clCreateBuffer.html)
    is guaranteed to contain the latest bits in the region being mapped
    when the `clEnqueueMapBuffer` command has completed.

-   The pointer value returned by `clEnqueueMapBuffer` will be derived
    from the `host_ptr` specified when the buffer object is created.

Mapped buffer objects are unmapped using
[`clEnqueueUnmapMemObject`](clEnqueueUnmapMemObject.html).

`clEnqueueMapBuffer` and [`clEnqueueMapImage`](clEnqueueMapImage.html)
increment the mapped count of the memory object. The initial mapped
count value of a memory object is zero. Multiple calls to
`clEnqueueMapBuffer` or [`clEnqueueMapImage`](clEnqueueMapImage.html) on
the same memory object will increment this mapped count by appropriate
number of calls.
[`clEnqueueUnmapMemObject`](clEnqueueUnmapMemObject.html) decrements the
mapped count of the memory object.

`clEnqueueMapBuffer` and [`clEnqueueMapImage`](clEnqueueMapImage.html)
act as synchronization points for a region of the buffer object being
mapped.

Accessing mapped regions of a memory object

This section describes the behavior of OpenCL commands that access
mapped regions of a memory object.

The contents of the region of a memory object and associated memory
objects (sub-buffer objects or 1D image buffer objects that overlap this
region) mapped for writing (i.e. `CL_MAP_WRITE` or
`CL_MAP_WRITE_INVALIDATE_REGION` is set in `map_flags` argument to
[`clEnqueueMapBuffer`](#) or
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
`CL_INVALID_OPERATION` error returned by [`clEnqueueMapBuffer`](#) or
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

The mapped pointer returned by [`clEnqueueMapBuffer`](#) or
[`clEnqueueMapImage`](clEnqueueMapImage.html) can be used as `ptr`
argument value to [`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clEnqueueReadBufferRect`](clEnqueueReadBufferRect.html),
[`clEnqueueWriteBufferRect`](clEnqueueWriteBufferRect.html),
[`clEnqueueReadImage`](clEnqueueReadImage.html), and
[`clEnqueueWriteImage`](clEnqueueWriteImage.html), provided the rules
described above are adhered to.

## Errors

`clEnqueueMapBuffer` will return a pointer to the mapped region. The
`errcode_ret` is set to `CL_SUCCESS`.

A NULL pointer is returned otherwise with one of the following error
values returned in `errcode_ret`:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and `buffer` are not the same or if the context associated with
    `command_queue` and events in `event_wait_list` are not the same.

-   `CL_INVALID_MEM_OBJECT` if `buffer` is not a valid image object.

-   `CL_INVALID_VALUE` if region being mapped given by (`offset`,
    `size`) is out of bounds or if `size` is 0 or values specified in
    `map_flags` are not valid.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_MISALIGNED_SUB_BUFFER_OFFSET` if `buffer` is a sub-buffer object
    and `offset` specified when the sub-buffer object is created is not
    aligned to `CL_DEVICE_MEM_BASE_ADDR_ALIGN` value for device
    associated with `queue`.

-   `CL_MAP_FAILURE` if there is a failure to map the requested region
    into the host address space. This error cannot occur for buffer
    objects created with `CL_MEM_USE_HOST_PTR` or
    `CL_MEM_ALLOC_HOST_PTR`.

-   `CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST` if the map operation
    is blocking and the execution status of any of the events in
    `event_wait_list` is a negative integer value.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with `buffer`.

-   `CL_INVALID_OPERATION` if `buffer` has been created with
    `CL_MEM_HOST_WRITE_ONLY` or `CL_MEM_HOST_NO_ACCESS` and
    `CL_MAP_READ` is set in `map_flags` or if `buffer` has been created
    with `CL_MEM_HOST_READ_ONL` or `CL_MEM_HOST_NO_ACCESS` and
    `CL_MAP_WRITE` or `CL_MAP_WRITE_INVALIDATE_REGION` is set in
    `map_flags`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if mapping would lead to overlapping regions
    being mapped for writing.

-   `CL_INVALID_OPERATION` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueMapImage`](clEnqueueMapImage.html),
[`clEnqueueUnmapMemObject`](clEnqueueUnmapMemObject.html),
[`clEnqueueSVMMap`](clEnqueueSVMMap.html)

## Specification

[OpenCL 2.1 API Specification, page
124](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=124)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
