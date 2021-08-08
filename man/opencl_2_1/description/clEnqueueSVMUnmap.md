
## Parameters

`command_queue`  
Must be a valid host command-queue.

`svm_ptr`  
A pointer that was specified in a previous call to
[`clEnqueueSVMMap`](clEnqueueSVMMap.html). If `svm_ptr` is allocated
using [`clSVMAlloc`](clSVMAlloc.html) then it must be allocated from the
same context from which `command_queue` was created. Otherwise the
behavior is undefined.

`event_wait_list ,` `num_events_in_wait_list`  
Specify events that need to complete before `clEnqueueSVMUnmap` can be
executed. If `event_wait_list` is NULL, then `clEnqueueSVMUnmap` does
not wait on any event to complete. If `event_wait_list` is NULL,
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

[`clEnqueueSVMMap`](clEnqueueSVMMap.html), and [`clEnqueueSVMUnmap`](#)
act as synchronization points for the region of the SVM buffer specified
in these calls.

If a coarse-grained SVM buffer is currently mapped for writing, the
application must ensure that the SVM buffer is unmapped before any
enqueued kernels or commands that read from or write to this SVM buffer
or any of its associated `cl_mem` buffer objects begin execution;
otherwise the behavior is undefined.

If a coarse-grained SVM buffer is currently mapped for reading, the
application must ensure that the SVM buffer is unmapped before any
enqueued kernels or commands that write to this memory object or any of
its associated `cl_mem` buffer objects begin execution; otherwise the
behavior is undefined.

A SVM buffer is considered as mapped if there are one or more active
mappings for the SVM buffer irrespective of whether the mapped regions
span the entire SVM buffer.

The above note does not apply to fine-grained SVM buffers (fine-grained
buffers allocated using [`clSVMAlloc`](clSVMAlloc.html) or fine-grained
system allocations).

## Errors

`clEnqueueSVMUnmap` returns `CL_SUCCESS` if the function is executed
successfully. Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if context associated with `command_queue` and
    events in `event_wait_list` are not the same.

-   `CL_INVALID_VALUE` if `svm_ptr` is NULL.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[Shared Virtual Memory Functions](sharedVirtualMemory.html)

## Specification

[OpenCL 2.1 API Specification, page
185](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=185)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
