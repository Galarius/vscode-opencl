
## Parameters

`context`  
The context to release.

## Notes

After the `context` reference count becomes zero and all the objects
attached to `context` (such as memory objects, command-queues) are
released, the `context` is deleted. Using this function to release a
reference that was not obtained by creating the object or by calling
[`clRetainContext`](clRetainContext.html) causes undefined behavior.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_CONTEXT` if `context` is not a valid OpenCL context.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateContext`](clCreateContext.html),
[`clCreateContextFromType`](clCreateContextFromType.html),
[`clGetContextInfo`](clGetContextInfo.html),
[`clRetainContext`](clRetainContext.html),
[`clGetContextInfo`](clGetContextInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
93](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=93)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
