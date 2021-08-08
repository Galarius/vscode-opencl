
## Parameters

`event`  
Specifies the event object.

`param_name`  
Specifies the profiling data to query. The list of supported
`param_name` types and the information returned in `param_value` by
`clGetEventProfilingInfo` is described in the table of parameter queries
below.

`param_value_size`  
Specifies the size in bytes of memory pointed to by `param_value`. This
size must be ≥ size of return type as described in the table below.

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. if `param_value` is NULL, it is ignored.

`param_value_size_ret`  
Returns the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

  
The following is a table of `clGetEventProfilingInfo` parameter queries

| cl\_profiling\_info  | Return Type          | Info. returned in     |
| --- | --- | --- |
|  `CL_PROFI              LING_COMMAND_QUEUED` |  cl\_ulong            |  `param_value`           A 64-bit value that     describes the current   device time counter     in nanoseconds when     the command             identified by `event`   is enqueued in a        command-queue by the  |
|  `CL_PROFI              LING_COMMAND_SUBMIT` |  cl\_ulong            |  host.                   A 64-bit value that     describes the current   device time counter     in nanoseconds when     the command             identified by `event`   that has been           enqueued is submitted   by the host to the      device associated       with the              |
|  `CL_PROF               ILING_COMMAND_START` |  cl\_ulong            |  command-queue.          A 64-bit value that     describes the current   device time counter     in nanoseconds when     the command             identified by `event`   starts execution on   |
|  `CL_PR                 OFILING_COMMAND_END` |  cl\_ulong            |  the device.             A 64-bit value that     describes the current   device time counter     in nanoseconds when     the command             identified by `event`   has finished            execution on the      |
|  `CL_PROFILI            NG_COMMAND_COMPLETE` |  cl\_ulong            |  device.                 A 64-bit value that     describes the current   device time counter     in nanoseconds when     the command             identified by `event`   and any child           commands enqueued by    this command on the     device have finished  |

## Notes

The unsigned 64-bit values returned can be used to measure the time in
nano-seconds consumed by OpenCL commands.

OpenCL devices are required to correctly track time across changes in
device frequency and power states. The
`CL_DEVICE_PROFILING_TIMER_RESOLUTION` specifies the resolution of the
timer i.e. the number of nanoseconds elapsed before the timer is
incremented.

Event objects can be used to capture profiling information that measure
execution time of a command. Profiling of OpenCL commands can be enabled
either by using a command-queue created with `CL_QUEUE_PROFILING_ENABLE`
flag set in `properties` argument to
[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html).

## Errors

Returns `CL_SUCCESS` if the function is executed successfully and the
profiling information has been recorded. Otherwise, it returns one of
the following errors:

-   `CL_PROFILING_INFO_NOT_AVAILABLE` if the `CL_QUEUE_PROFILING_ENABLE`
    flag is not set for the command-queue, if the execution status of
    the command identified by `event` is not `CL_COMPLETE` or if `event`
    refers to the [`clEnqueueSVMFree`](clEnqueueSVMFree.html) command or
    is a user event object.

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the above table and `param_value` is not NULL.

-   `CL_INVALID_EVENT` if `event` is a not a valid event object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html)

## Specification

[OpenCL 2.1 API Specification, page
263](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=263)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
