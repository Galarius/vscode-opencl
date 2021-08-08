
## Parameters

`event`  
Event object being retained.

## Notes

The OpenCL commands that return an event perform an implicit retain.

## Errors

Returns `CL_SUCCESS` if the function executed successfully. Otherwise,
it returns one of the following errors:

-   `CL_INVALID_EVENT` if `event` is not a valid event object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetEventInfo`](clGetEventInfo.html),
[`clReleaseEvent`](clReleaseEvent.html),
[`clWaitForEvents`](clWaitForEvents.html)

## Specification

[OpenCL 2.1 API Specification, page
257](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=257)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
