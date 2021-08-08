
## Parameters

`context`  
The context to retain.

## Notes

[`clCreateContext`](clCreateContext.html) and
[`clCreateContextFromType`](clCreateContextFromType.html) perform an
implicit retain. This is very helpful for 3rd party libraries, which
typically get a context passed to them by the application. However, it
is possible that the application may delete the context without
informing the library. Allowing functions to attach to (i.e. retain) and
release a context solves the problem of a context being used by a
library no longer being valid.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following values:

-   `CL_INVALID_CONTEXT` if `context` is not a valid OpenCL context.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateContext`](clCreateContext.html),
[`clCreateContextFromType`](clCreateContextFromType.html),
[`clGetContextInfo`](clGetContextInfo.html),
[`clReleaseContext`](clReleaseContext.html),
[`clGetContextInfo`](clGetContextInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
93](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=93)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
