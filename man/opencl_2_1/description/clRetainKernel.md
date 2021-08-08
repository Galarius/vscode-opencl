
## Notes

[`clCreateKernel`](clCreateKernel.html) or
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html) do an
implicit retain.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateKernel`](clCreateKernel.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clReleaseKernel`](clReleaseKernel.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
223](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=223)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
