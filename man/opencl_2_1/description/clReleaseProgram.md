
## Notes

The program object is deleted after all kernel objects associated with
`program` have been deleted and the `program` reference count becomes
zero.

Using this function to release a reference that was not obtained by
creating the object or by calling
[`clRetainProgram`](clRetainProgram.html) causes undefined behavior.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_PROGRAM` if `program` is not a valid program object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateProgramWithSource`](clCreateProgramWithSource.html),
[`clCreateProgramWithBinary`](clCreateProgramWithBinary.html),
[`clRetainProgram`](clRetainProgram.html)

## Specification

[OpenCL 2.1 API Specification, page
199](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=199)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
