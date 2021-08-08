
## Parameters

`command_queue`  
Specifies the command-queue to release.

## Notes

After the `command_queue` reference count becomes zero and all commands
queued to `command_queue` have finished (e.g., kernel executions, memory
object updates, etc.), the command-queue is deleted.

`clReleaseCommandQueue` performs an implicit flush to issue any
previously queued OpenCL commands in `command_queue`. Using this
function to release a reference that was not obtained by creating the
object or by calling [`clRetainCommandQueue`](clRetainCommandQueue.html)
causes undefined behavior.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid command
    queue.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html),
[`clGetCommandQueueInfo`](clGetCommandQueueInfo.html),
[`clRetainCommandQueue`](clRetainCommandQueue.html)

## Specification

[OpenCL 2.1 API Specification, page
100](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=100)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
