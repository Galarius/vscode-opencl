
## Parameters

`command_queue`  
Specifies the command-queue to retain.

## Notes

[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html)
performs an implicit retain. This is very helpful for 3rd party
libraries, which typically get a command-queue passed to them by the
application. However, it is possible that the application may delete the
command-queue without informing the library. Allowing functions to
attach to (i.e. retain) and release a command-queue solves the problem
of a command-queue being used by a library no longer being valid.

## Errors

Returns `CL_SUCCESS` if the function executed successfully, or one of
the errors below:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid
    command-queue.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html),
[`clGetCommandQueueInfo`](clGetCommandQueueInfo.html),
[`clReleaseCommandQueue`](clReleaseCommandQueue.html)

## Specification

[OpenCL 2.1 API Specification, page
100](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=100)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
