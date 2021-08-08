
## Parameters

`program`  
A program object with a successfully built executable.

`kernel_name`  
A function name in the program declared with the
[`__kernel`](functionQualifiers.html) qualifier.

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Notes

A kernel is a function declared in a program. A kernel is identified by
the [`kernel`](functionQualifiers.html) qualifier applied to any
function in a program. A kernel object encapsulates the specific
`kernel` function declared in a program and the argument values to be
used when executing this `__kernel` function.

## Errors

`clCreateKernel` returns a valid non-zero kernel object and
`errcode_ret` is set to `CL_SUCCESS` if the kernel object is created
successfully. Otherwise, it returns a NULL value with one of the
following error values returned in `errcode_ret`:

-   `CL_INVALID_PROGRAM` if `program` is not a valid program object.

-   `CL_INVALID_PROGRAM_EXECUTABLE` if there is no successfully built
    executable for `program`.

-   `CL_INVALID_KERNEL_NAME` if `kernel_name` is not found in `program`.

-   `CL_INVALID_KERNEL_DEFINITION` if the function definition for
    `__kernel` function given by `kernel_name` such as the number of
    arguments, the argument types are not the same for all devices for
    which the `program` executable has been built.

-   `CL_INVALID_VALUE` if `kernel_name` is NULL.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clRetainKernel`](clRetainKernel.html),
[`clReleaseKernel`](clReleaseKernel.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
221](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=221)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
