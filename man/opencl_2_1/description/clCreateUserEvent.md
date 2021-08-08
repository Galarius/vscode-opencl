
## Parameters

`context`  
A valid OpenCL context.

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Notes

User events allow applications to enqueue commands that wait on a user
event to finish before the command is executed by the device.

The execution status of the user event object created is set to
`CL_SUBMITTED`.

## Errors

Returns a valid non-zero event object and `errcode_ret` is set to
`CL_SUCCESS` if the user event object is created successfully.
Otherwise, it returns a NULL value with one of the following error
values returned in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[Cardinality Diagram](classDiagram.html)

## Specification

[OpenCL 2.1 API Specification, page
250](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=250)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
