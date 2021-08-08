
## Parameters

`context`  
Must be a valid OpenCL context.

`device`  
Must be a device or sub-device associated with `context`. It can either
be in the list of devices and sub-devices specified when `context` is
created using [`clCreateContext`](clCreateContext.html) or be a root
device with the same device type as specified when the `context` is
created using [`clCreateContextFromType`](clCreateContextFromType.html).

`properties`  
Specifies a list of properties for the command-queue and their
corresponding values. Each property name is immediately followed by the
corresponding desired value. The list is terminated with 0. The list of
supported properties is described in the table below. If a supported
property and its value is not specified in `properties`, its default
value will be used. `properties` can be NULL in which case the default
values for supported command-queue properties will be used.

| Queue Properties     | Property Value       | Description           |
| --- | --- | --- |
|  `                      CL_QUEUE_PROPERTIES` |  `cl_command            _queue_- properties` |  This is a bitfield      and can be set to a     combination of the      following values:       `CL_QUEUE_OUT_OF_ORDE   R_EXEC_MODE_ENABLE` -   Determines whether      the commands queued     in the command-queue    are executed in-order   or out-of-order. If     set, the commands in    the command-queue are   executed                out-of-order.           Otherwise, commands     are executed            in-order.               `CL_QUEU                E_PROFILING_ENABLE` -   Enable or disable       profiling of commands   in the command-queue.   If set, the profiling   of commands is          enabled. Otherwise      profiling of commands   is disabled.            `                       CL_QUEUE_ON_DEVICE` -   Indicates that this     is a device queue. If   `CL_QUEUE_ON_DEVICE`    is set,                 `CL_QUEUE_OUT_OF_OR     DER_EXEC_MODE_ENABLE`   must also be set.       Only out-of-order       device queues are       supported.              `CL_QUEUE               _ON_DEVICE_DEFAULT` -   indicates that this     is the default device   queue. This can only    be used with            `CL_QUEUE_ON_DEVICE`.   The application must    create the default      device queue if any     kernels containing      calls to                get\_default\_queue     are enqueued. There     can only be one         default device queue    for each device         within a context.       clCreateComma           ndQueueWithProperties   with                    `CL_QUEUE_PROPERTIES`   set to                  `CL_QUEUE_ON_DEVICE`    `CL_QUE                 UE_ON_DEVICE_DEFAULT`   will return the         default device queue    that has already been   created and increment   its retain count        by 1.                   If                      `CL_QUEUE_PROPERTIES`   is not specified an     in-order host command   queue is created for    the specified device. |
|  `CL_QUEUE_SIZE`      |  `cl_uint`            |  Specifies the size of   the device queue in     bytes.                  This can only be        specified if            `CL_QUEUE_ON_DEVICE`    is set in               `                       CL_QUEUE_PROPERTIES`.   This must be a value    ≤                       `CL_DEVICE_QUEUE        _ON_DEVICE_MAX_SIZE`.   For best performance,   this should be ≤        `                       CL_DEVICE_QUEUE_ON_DE   VICE_PREFERRED_SIZE`.   If `CL_QUEUE_SIZE` is   not specified, the      device queue is         created with            `CL_DEVICE_QUEUE_ON_D   EVICE_PREFERRED_SIZE`   as the size of the      queue.                |
|  `CL                    _QUEUE_PRIORITY_KHR` |  `cl                    _queue_priority_khr` |  Applies only if the     [`cl_khr_pr             iority_hints`](cl_khr   _priority_hints.html)   extension is enabled.   Can be one of           `CL_QUEU                E_PRIORITY_HIGH_KHR`,   `CL_QUE                 UE_PRIORITY_MED_KHR`,   or                      `CL_QUE                 UE_PRIORITY_LOW_KHR`.   If                      `C                      L_QUEUE_PRIORITY_KHR`   is not specified then   the default priority    is                      `CL_QUE                 UE_PRIORITY_MED_KHR`. |
|  `CL                    _QUEUE_THROTTLE_KHR` ||  Applies only if the     [`cl_khr_th             rottle_hints`](cl_khr   _throttle_hints.html)   extension is enabled.   Can be one of           `CL_QUEU                E_THROTTLE_HIGH_KHR`,   `CL_QUE                 UE_THROTTLE_MED_KHR`,   `CL_QU                  EUE_THROTTLE_LOW_KHR`   If                      `C                      L_QUEUE_THROTTLE_KHR`   is not specified then   the default priority    is                      `CL_QUE                 UE_THROTTLE_MED_KHR`. |

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is `NULL`, no error
code is returned.

## Notes

OpenCL objects such as memory, program and kernel objects are created
using a context. Operations on these objects are performed using a
command-queue. The command-queue can be used to queue a set of
operations (referred to as commands) in order. Having multiple
command-queues allows applications to queue multiple independent
commands without requiring synchronization. Note that this should work
as long as these objects are not being shared. Sharing of objects across
multiple command-queues will require the application to perform
appropriate synchronization. This is described in Appendix A of the
specification.

Out-of-order Execution of Kernels and Memory Object Commands

The OpenCL functions that are submitted to a command-queue are enqueued
in the order the calls are made but can be configured to execute
in-order or out-of-order. The `properties` argument in
`clCreateCommandQueueWithProperties` can be used to specify the
execution order.

If the `CL_QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE` property of a
command-queue is not set, the commands enqueued to a command-queue
execute in order. For example, if an application calls
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) to execute
kernel A followed by a
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) to execute
kernel B, the application can assume that kernel A finishes first and
then kernel B is executed. If the memory objects output by kernel A are
inputs to kernel B then kernel B will see the correct data in memory
objects produced by execution of kernel A. If the
`CL_QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE` property of a command-queue is
set, then there is no guarantee that kernel A will finish before kernel
B starts execution.

Applications can configure the commands enqueued to a command-queue to
execute out-of-order by setting the
`CL_QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE` property of the command-queue.
This can be specified when the command-queue is created. In out-of-order
execution mode there is no guarantee that the enqueued commands will
finish execution in the order they were queued. As there is no guarantee
that kernels will be executed in order, i.e. based on when the
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) calls are made
within a command-queue, it is therefore possible that an earlier
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) call to execute
kernel A identified by event A may execute and/or finish later than a
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) call to execute
kernel B which was called by the application at a later point in time.
To guarantee a specific order of execution of kernels, a wait on a
particular event (in this case event A) can be used. The wait for event
A can be specified in the `event_wait_list` argument to
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) for kernel B.

In addition, a wait for events
([`clEnqueueMarkerWithWaitList`](clEnqueueMarkerWithWaitList.html)) or a
barrier
([`clEnqueueBarrierWithWaitList`](clEnqueueBarrierWithWaitList.html))
command can be enqueued to the command-queue. The wait for events
command ensures that previously enqueued commands identified by the list
of events to wait for have finished before the next batch of commands is
executed. The barrier command ensures that all previously enqueued
commands in a command-queue have finished execution before the next
batch of commands is executed.

Similarly, commands to read, write, copy or map memory objects that are
enqueued after [`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html)
or [`clEnqueueNativeKernel`](clEnqueueNativeKernel.html) commands are
not guaranteed to wait for kernels scheduled for execution to have
completed (if the `CL_QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE` property is
set). To ensure correct ordering of commands, the event object returned
by [`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) or
[`clEnqueueNativeKernel`](clEnqueueNativeKernel.html) can be used to
enqueue a wait for event or a barrier command can be enqueued that must
complete before reads or writes to the memory object(s) occur.

## Errors

`clCreateCommandQueueWithProperties` returns a valid non-zero
command-queue and `errcode_ret` is set to `CL_SUCCESS` if the
command-queue is created successfully. Otherwise, it returns a NULL
value with one of the following error values returned in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_DEVICE` if `device` is not a valid device or is not
    associated with `context`.

-   `CL_INVALID_VALUE` if values specified in `properties` are not
    valid.

-   `CL_INVALID_QUEUE_PROPERTIES` if values specified in `properties`
    are valid but are not supported by the device.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

-   `CL_INVALID_QUEUE_PROPERTIES` if extension
    [`cl_khr_priority_hints`](cl_khr_priority_hints.html) is enabled and
    the `CL_QUEUE_PRIORITY_KHR` property is specified and the queue is a
    `CL_QUEUE_ON_DEVICE`.

-   `CL_INVALID_QUEUE_PROPERTIES` if extension
    [`cl_khr_throttle_hints`](cl_khr_throttle_hints.html) is enabled and
    the `CL_QUEUE_PRIORITY_KHR` property is specified and the queue is a
    `CL_QUEUE_ON_DEVICE`.

## Also see

[`clGetCommandQueueInfo`](clGetCommandQueueInfo.html),
[`clReleaseCommandQueue`](clReleaseCommandQueue.html),
[`clRetainCommandQueue`](clRetainCommandQueue.html),
[`clCreateContext`](clCreateContext.html),
[`clCreateContextFromType`](clCreateContextFromType.html),
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html)

## Specification

[OpenCL 2.1 API Specification, page
97](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=97)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
