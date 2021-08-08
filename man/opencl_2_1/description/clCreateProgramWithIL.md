
## Parameters

`context`  
Must be a valid OpenCL context.

`il`  
A pointer to a `length`-byte block of memory containing SPIR-V or an
implementation-defined intermediate language.

`length`  
`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Notes

## Errors

Returns a valid non-zero program object and `errcode_ret` is set to
`CL_SUCCESS` if the program object is created successfully. Otherwise,
it returns a NULL value with one of the following error values returned
in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if `il` is NULL or `length` is zero.

-   `CL_INVALID_VALUE` if the `length`-byte memory pointed to by `il`
    does not contain well-formed intermediate language input that can be
    consumed by the OpenCL runtime.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateProgramWithSource`](clCreateProgramWithSource.html),
[`clCreateProgramWithBuiltInKernels`](clCreateProgramWithBuiltInKernels.html),
[`clCreateProgramWithBinary`](clCreateProgramWithBinary.html)

## Specification

[OpenCL 2.1 API Specification, page
195](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=195)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
