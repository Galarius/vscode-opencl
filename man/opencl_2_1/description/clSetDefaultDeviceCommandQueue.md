
## Parameters

`context`  
`device`  
`command_queue`  
== Notes

[`clSetDefaultDeviceCommandQueue`](#) may be used to replace a default
device command queue created with
[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html)
and the `CL_QUEUE_ON_DEVICE_DEFAULT` flag.

## Errors

Returns `CL_SUCCESS` if the function executed successfully. Otherwise,
it returns one of the following errors:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_DEVICE` if `device` is not a valid device or is not
    associated with `context`.

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid
    command-queue for `device`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html)

## Specification

[OpenCL 2.1 API Specification, page
99](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=99)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
