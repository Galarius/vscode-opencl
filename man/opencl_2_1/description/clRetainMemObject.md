
## Parameters

`memobj`  
A valid memory object.

## Notes

[`clCreateBuffer`](clCreateBuffer.html),
[`clCreateSubBuffer`](clCreateSubBuffer.html),
[`clCreateImage`](clCreateImage.html), and
[`clCreatePipe`](clCreatePipe.html) perform an implicit retain.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_MEM_OBJECT` if `memobj` is a not a valid memory object
    (buffer or image object).

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateBuffer`](clCreateBuffer.html),
[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html),
[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clReleaseMemObject`](clReleaseMemObject.html)

## Specification

[OpenCL 2.1 API Specification, page
163](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=163)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
