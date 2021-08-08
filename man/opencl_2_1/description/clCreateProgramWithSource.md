
## Parameters

`context`  
Must be a valid OpenCL context.

`strings`  
An array of `count` pointers to optionally null-terminated character
strings that make up the source code.

`lengths`  
An array with the number of chars in each string (the string length). If
an element in `lengths` is zero, its accompanying string is
null-terminated. If `lengths` is NULL, all strings in the `strings`
argument are considered null-terminated. Any length value passed in that
is greater than zero excludes the null terminator in its count.

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Description

This function creates a program object for a context, and loads the
source code specified by the text strings in the `strings` array into
the program object. The devices associated with the program object are
the devices associated with `context`. The source code specified by
`strings` is either an OpenCL C program source, header or
implementation-defined source for custom devices that support an online
compiler. OpenCL C++ is not supported as an online-compiled kernel
language through this interface.

## Errors

`clCreateProgramWithSource` returns a valid non-zero program object and
`errcode_ret` is set to `CL_SUCCESS` if the program object is created
successfully. Otherwise, it returns a NULL value with one of the
following error values returned in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if `count` is zero or if `strings` or any entry
    in `strings` is NULL.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateProgramWithBinary`](clCreateProgramWithBinary.html),
[`clReleaseProgram`](clReleaseProgram.html),
[`clRetainProgram`](clRetainProgram.html), [Cardinality
Diagram](classDiagram.html)

## Specification

[OpenCL 2.1 API Specification, page
194](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=194)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
