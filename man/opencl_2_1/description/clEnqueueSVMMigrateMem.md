
## Parameters

`command_queue`  
A valid host command queue. The specified set of allocation ranges will
be migrated to the OpenCL device associated with `command_queue`.

`num_svm_pointers`  
The number of pointers in the specified `svm_pointers` array, and the
number of sizes in the `sizes` array, if `sizes` is not NULL.

`svm_pointers`  
A pointer to an array of pointers. Each pointer in this array must be
within an allocation produced by a call to
[`clSVMAlloc`](clSVMAlloc.html).

`sizes`  
An array of sizes. The pair `svm_pointers`\[i\] and `sizes`\[i\]
together define the starting address and number of bytes in a range to
be migrated. `sizes` may be NULL indicating that every allocation
containing any `svm_pointer`\[i\] is to be migrated. Also, if
`sizes`\[i\] is zero, then the entire allocation containing
`svm_pointer`\[i\] is migrated.

`flags`  
A bit-field that is used to specify migration options. Table 5.12
describes the possible values for `flags`.

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
the application to query the status of this command or queue another
command that waits for this command to complete. If the
`event_wait_list` and the `event` arguments are not NULL, the `event`
argument should not refer to an element of the `event_wait_list` array.

## Notes

Enqueues a command to indicate which device a set of ranges of SVM
allocations should be associated with. Once the event returned by
`clEnqueueSVMMigrateMem` has become `CL_COMPLETE`, the ranges specified
by `svm pointers` and `sizes` have been successfully migrated to the
device associated with `command queue`.

The user is responsible for managing the event dependencies associated
with this command in order to avoid overlapping access to SVM
allocations. Improperly specified event dependencies passed to
`clEnqueueSVMMigrateMem` could result in undefined results.

## Errors

`clEnqueueSVMMigrateMem` returns `CL_SUCCESS` if the function is
executed successfully. Otherwise, it returns one of the following
errors.

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and events in `event_wait_list` are not the same.

-   `CL_INVALID_VALUE` if `num_svm_pointers` is zero or `svm_pointers`
    is NULL.

-   `CL_INVALID_VALUE` if `sizes`\[i\] is non-zero range
    \[`svm_pointers`\[i\], `svm_pointers`\[i\]+`sizes`\[i\]) is not
    contained within an existing [`clSVMAlloc`](clSVMAlloc.html)
    allocation.

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
187](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=187)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
