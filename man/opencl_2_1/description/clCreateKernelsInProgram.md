
## Parameters

`program`  
A program object with a successfully built executable.

`num_kernels`  
The size of memory pointed to by `kernels` specified as the number of
`cl_kernel` entries.

`kernels`  
The buffer where the kernel objects for kernels in `program` will be
returned. If `kernels` is NULL, it is ignored. If `kernels` is not NULL,
`num_kernels` must be greater than or equal to the number of kernels in
`program`.

`num_kernels_ret`  
The number of kernels in `program`. If `num_kernels_ret` is NULL, it is
ignored.

## Notes

Creates kernel objects for all kernel functions in `program`. Kernel
objects are not created for any [`__kernel`](functionQualifiers.html)
functions in `program` that do not have the same function definition
across all devices for which a program executable has been successfully
built.

Kernel objects can only be created once you have a program object with a
valid program source or binary loaded into the program object and the
program executable has been successfully built for one or more devices
associated with program. No changes to the program executable are
allowed while there are kernel objects associated with a program object.
This means that calls to [`clBuildProgram`](clBuildProgram.html) and
[`clCompileProgram`](clCompileProgram.html) return
`CL_INVALID_OPERATION` if there are kernel objects attached to a program
object. The OpenCL context associated with `program` will be the context
associated with `kernel`. The list of devices associated with `program`
are the devices associated with `kernel`. Devices associated with a
program object for which a valid program executable has been built can
be used to execute kernels declared in the program object.

## Errors

Returns `CL_SUCCESS` if the kernel objects are successfully allocated.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_PROGRAM` if `program` is not a valid program object.

-   `CL_INVALID_PROGRAM_EXECUTABLE` if there is no successfully built
    executable for any device in `program`.

-   `CL_INVALID_VALUE` if `kernels` is not NULL and `num_kernels` is
    less than the number of kernels in `program`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateKernel`](clCreateKernel.html),
[`clRetainKernel`](clRetainKernel.html),
[`clReleaseKernel`](clReleaseKernel.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
222](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=222)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
