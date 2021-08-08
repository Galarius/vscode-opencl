
## Parameters

`command_queue`  
Refers to the host command-queue in which the read / write command will
be queued. queued. If either `dst_ptr` or `src_ptr` is allocated using
clSVMAlloc then the OpenCL context allocated against must match that of
`command_queue`.

`blocking_copy`  
Indicates if the copy operation is blocking or non-blocking.

If `blocking_copy` is `CL_TRUE` i.e. the copy command is blocking,
`clEnqueueSVMMemcpy` does not return until the buffer data has been
copied into memory pointed to by `dst_ptr`.

If `blocking_copy` is `CL_FALSE` i.e. the copy command is non-blocking,
`clEnqueueSVMMemcpy` queues a non-blocking copy command and returns. The
contents of the buffer that `dst_ptr` point to cannot be used until the
copy command has completed. The `event` argument returns an event object
which can be used to query the execution status of the read command.
When the copy command has completed, the contents of the buffer that
`dst_ptr` points to can be used by the application.

`size`  
The size in bytes of data being copied.

`dst_ptr`  
The pointer to a host or SVM memory allocation where data is copied to.

`src_ptr`  
The pointer to a memory region where data is copied from.

If the memory allocation(s) containing `dst_ptr` and/or `src_ptr` are
allocated using `clSVMAlloc` and either is not allocated from the same
context from which `command_queue` was created the behavior is
undefined.

`event_wait_list` and `num_events_in_wait_list`  
Specify events that need to complete before `clEnqueueSVMMemcpy` can be
executed. If `event_wait_list` is NULL, then `clEnqueueSVMMemcpy` does
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
this command to complete. If the `event_wait_list` and the `event`
arguments are not NULL, the `event` argument should not refer to an
element of the `event_wait_list` array.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and events in `event_wait_list` are not the same.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST` if the copy operation
    is blocking and the execution status of any of the events in
    `event_wait_list` is a negative integer value.

-   `CL_INVALID_VALUE` if `dst_ptr` or `src_ptr` are NULL.

-   `CL_MEM_COPY_OVERLAP` if the values specified for `dst_ptr`,
    `src_ptr` and `size` result in an overlapping copy.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[Shared Virtual Memory Functions](sharedVirtualMemory.html)

## Specification

[OpenCL 2.1 API Specification, page
180](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=180)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
