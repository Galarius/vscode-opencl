
## Parameters

`command_queue`  
A valid host command-queue. A native user function can only be executed
on a command-queue created on a device that has `CL_EXEC_NATIVE_KERNEL`
capability set in `CL_DEVICE_EXECUTION_CAPABILITIES` as specified in the
table of OpenCL Device Queries for
[`clGetDeviceInfo`](clGetDeviceInfo.html).

`user_func`  
A pointer to a host-callable user function.

`args`  
A pointer to the args list that `user_func` should be called with.

`cb_args`  
The size in bytes of the args list that `args` points to.

The data pointed to by `args` and `cb_args` bytes in size will be copied
and a pointer to this copied region will be passed to `user_func`. The
copy needs to be done because the memory objects (`cl_mem` values) that
`args` may contain need to be modified and replaced by appropriate
pointers to global memory. When `clEnqueueNativeKernel` returns, the
memory region pointed to by `args` can be reused by the application.

`num_mem_objects`  
The number of buffer objects that are passed in `args`.

`mem_list`  
A list of valid buffer objects, if `num_mem_objects` > 0. The buffer
object values specified in `mem_list` are memory object handles
(`cl_mem` values) returned by [`clCreateBuffer`](clCreateBuffer.html) or
NULL.

`args_mem_loc`  
A pointer to appropriate locations that `args` points to where memory
object handles (`cl_mem` values) are stored. Before the user function is
executed, the memory object handles are replaced by pointers to global
memory.

`event_wait_list` and `num_events_in_wait_list`  
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

## Notes

The total number of read-only images specified as arguments to a kernel
cannot exceed `CL_DEVICE_MAX_READ_IMAGE_ARGS`. Each image array argument
to a kernel declared with the `read_only` qualifier counts as one image.

The total number of write-only images specified as arguments to a kernel
cannot exceed `CL_DEVICE_MAX_WRITE_IMAGE_ARGS`. Each image array
argument to a kernel declared with the `write_only` qualifier counts as
one image.

The total number of read-write images specified as arguments to a kernel
cannot exceed `CL_DEVICE_MAX_READ_WRITE_IMAGE_ARGS`. Each image array
argument to a kernel declared with the `read_write` qualifier counts as
one image.

## Errors

Returns `CL_SUCCESS` if the user function execution instance was
successfully queued. Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_CONTEXT` if context associated with `command_queue` and
    events in `event_wait_list` are not the same.

-   `CL_INVALID_VALUE` if `user_func` is NULL.

-   `CL_INVALID_VALUE` if `args` is a NULL value and `cb_args` > 0, or
    if `args` is a NULL value and `num_mem_objects` > 0.

-   `CL_INVALID_VALUE` if `args` is not NULL and `cb_args` is 0.

-   `CL_INVALID_VALUE` if `num_mem_objects` > 0 and `mem_list` or
    `args_mem_loc` are NULL.

-   `CL_INVALID_VALUE` if `num_mem_objects` = 0 and `mem_list` or
    `args_mem_loc` are not NULL.

-   `CL_INVALID_OPERATION` if the device associated with `command_queue`
    cannot execute the native kernel.

-   `CL_INVALID_MEM_OBJECT` if one or more memory objects specified in
    `mem_list` are not valid or are not buffer objects.

-   `CL_OUT_OF_RESOURCES` if there is a failure to queue the execution
    instance of `kernel` on the command-queue because of insufficient
    resources needed to execute the kernel.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with buffer objects specified as
    arguments to `kernel`.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_INVALID_OPERATION` if SVM pointers are passed as arguments to a
    kernel and the device does not support SVM or if system pointers are
    passed as arguments to a kernel and/or stored inside SVM allocations
    passed as kernel arguments and the device does not support fine
    grain system SVM allocations.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html),
[`clEnqueueNativeKernel`](#),
[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html),
[`clCreateBuffer`](clCreateBuffer.html),
[`clGetDeviceInfo`](clGetDeviceInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
246](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=246)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
