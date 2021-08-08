
## Parameters

`command_queue`  
Must be a valid host command-queue.

`blocking_map`  
Indicates if the map operation is `blocking` or `non-blocking`.

If `blocking_map` is `CL_TRUE`, `clEnqueueSVMMap` does not return until
the application can access the contents of the SVM region specified by
`svm_ptr` and `size` on the host.

If `blocking_map` is `CL_FALSE` i.e. map operation is non-blocking, the
region specified by `svm_ptr` and `size` cannot be used until the map
command has completed. The `event` argument returns an event object
which can be used to query the execution status of the map command. When
the map command is completed, the application can access the contents of
the region specified by `svm_ptr` and `size`.

`map_flags`  
A bit-bield with the following supported values.

| cl\_map\_flags                    | Description                       |
| --- | --- |
|  `CL_MAP_READ`                     |  This flag specifies that the        region being mapped in the memory   object is being mapped for          reading.                            The pointer returned by             `clEnqueueMap{Buffer  guaranteed to contain the latest    bits in the region being mapped     when the                            `clEnqueueMap{Buffer  command has completed.            |
|  `CL_MAP_WRITE`                    |  This flag specifies that the        region being mapped in the memory   object is being mapped for          writing.                            The pointer returned by             `clEnqueueMap{Buffer  guaranteed to contain the latest    bits in the region being mapped     when the                            `clEnqueueMap{Buffer  command has completed.            |
|  `CL_MAP_WRITE_INVALIDATE_REGION`  |  This flag specifies that the        region being mapped in the memory   object is being mapped for          writing.                            The contents of the region being    mapped are to be discarded. This    is typically the case when the      region being mapped is              overwritten by the host. This       flag allows the implementation to   no longer guarantee that the        pointer returned by                 `clEnqueueMap{Buffer  contains the latest bits in the     region being mapped which can be    a significant performance           enhancement.                        `CL_MAP_READ` or `CL_MAP_WRITE`     and                                 `CL_MAP_WRITE_INVALIDATE_REGION`    are mutually exclusive.           |

`svm_ptr` and `size`  
A pointer to a memory region and size in bytes that will be updated by
the host. If `svm_ptr` is allocated using
[`clSVMAlloc`](clSVMAlloc.html) then it must be allocated from the same
context from which `command_queue` was created. Otherwise the behavior
is undefined.

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
Returns an event object that identifies this particular command and can
be used to query or queue a wait for this particular command to
complete. `event` can be NULL in which case it will not be possible for
the application to query the status of this command or queue a wait for
this command to complete.
[`clEnqueueBarrierWithWaitList`](clEnqueueBarrierWithWaitList.html) can
be used instead. If the `event_wait_list` and the `event` arguments are
not NULL, the `event` argument should not refer to an element of the
`event_wait_list` array.

## Notes

Note that since we are enqueuing a command with a SVM buffer, the region
is already mapped in the host address space.

[`clEnqueueSVMMap`](#), and
[`clEnqueueSVMUnmap`](clEnqueueSVMUnmap.html) act as synchronization
points for the region of the SVM buffer specified in these calls.

## Errors

`clEnqueueSVMMap` returns `CL_SUCCESS` if the function is executed
successfully. Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and events in `event_wait_list` are not the same.

-   `CL_INVALID_VALUE` if `svm_ptr` is NULL.

-   `CL_INVALID_VALUE` if `size` is 0 or if values specified in
    `map_flags` are not valid.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST` if the map operation
    is blocking and the execution status of any of the events in
    `event_wait_list` is a negative integer value.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[Shared Virtual Memory Functions](sharedVirtualMemory.html)

## Specification

[OpenCL 2.1 API Specification, page
184](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=184)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
