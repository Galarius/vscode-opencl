
## Parameters

`command_queue`  
A valid host command-queue.

`svm_pointers and num_svm_pointers`  
Specify shared virtual memory pointers to be freed. Each pointer in
`svm_pointers` that was allocated using [`clSVMAlloc`](clSVMAlloc.html)
must have been allocated from the same context from which
`command_queue` was created. The memory associated with `svm_pointers`
can be reused or freed after the function returns.

`pfn_free_func`  
Specifies the callback function to be called to free the SVM pointers.
`pfn_free_func` takes four arguments: `queue` which is the command queue
in which `clEnqueueSVMFree` was enqueued, the count and list of SVM
pointers to free and `user_data` which is a pointer to user specified
data. If `pfn_free_func` is NULL, all pointers specified in
`svm_pointers` must be allocated using [`clSVMAlloc`](clSVMAlloc.html)
and the OpenCL implementation will free these SVM pointers.
`pfn_free_func` must be a valid callback function if any SVM pointer to
be freed is a shared system memory pointer i.e. not allocated using
[`clSVMAlloc`](clSVMAlloc.html). If `pfn_free_func` is a valid callback
function, the OpenCL implementation will call `pfn_free_func` to free
all the SVM pointers specified in `svm_pointers`.

`user_data`  
Will be passed as the `user_data` argument when `pfn_free_func` is
called. `user_data` can be NULL.

`event_wait_list` and `num_events_in_wait_list`  
Specify events that need to complete before `clEnqueueSVMFree` can be
executed. If `event_wait_list` is NULL, then `clEnqueueSVMFree` does not
wait on any event to complete. If `event_wait_list` is NULL,
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
this command to complete. If the `event_wait_list` and the `event`
arguments are not NULL, the `event` argument should not refer to an
element of the `event_wait_list` array.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_VALUE` if `num_svm_pointers` is 0 and `svm_pointers` is
    non-NULL, or if `svm_pointers` is NULL and `num_svm_pointers` is
    not 0.

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
179](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=179)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
