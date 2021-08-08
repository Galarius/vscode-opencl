
## Notes

The kernel object is deleted once the number of instances that are
retained to `kernel` become zero and the kernel object is no longer
needed by any enqueued commands that use `kernel`. Using this function
to release a reference that was not obtained by creating the object or
by calling [`clRetainKernel`](clRetainKernel.html) causes undefined
behavior.

## Errors

Returns `CL_SUCCESS` if the kernel objects are successfully alloctaed.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateKernel`](clCreateKernel.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clRetainKernel`](clRetainKernel.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
223](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=223)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
