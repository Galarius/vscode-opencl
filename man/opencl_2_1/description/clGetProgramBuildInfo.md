
## Parameters

`program`  
Specifies the program object being queried.

`device`  
Specifies the device for which build information is being queried.
`device` must be a valid device associated with `program`.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by
`clGetProgramBuildInfo` is described in the table below.

| cl\_program\_build\_info          | Return Type and Info. returned in |
| --- | --- |
|  `CL_PROGRAM_BUILD_STATUS`         |  `param_value`                       Return type: cl\_build\_status      Returns the build, compile or       link status, whichever was          performed last on `program` for     `device`.                           This can be one of the following:   `CL_BUILD_NONE`. The build status   returned if no                      [`clBui                             ldProgram`](clBuildProgram.html),   [`clCompil                          eProgram`](clCompileProgram.html)   or                                  [`cl                                LinkProgram`](clLinkProgram.html)   has been performed on the           specified program object for        `device`.                           `CL_BUILD_ERROR`. The build         status returned if                  [`clBui                             ldProgram`](clBuildProgram.html),   [`clCompil                          eProgram`](clCompileProgram.html)   or                                  [`cl                                LinkProgram`](clLinkProgram.html)   whichever was performed last on     the specified program object for    `device` generated an error.        `CL_BUILD_SUCCESS`. The build       status returned if                  [`clBui                             ldProgram`](clBuildProgram.html),   [`clCompil                          eProgram`](clCompileProgram.html)   or                                  [`cl                                LinkProgram`](clLinkProgram.html)   whichever was performed last on     the specified program object for    `device` was successful.            `CL_BUILD_IN_PROGRESS`. The build   status returned if                  [`clBui                             ldProgram`](clBuildProgram.html),   [`clCompil                          eProgram`](clCompileProgram.html)   or                                  [`cl                                LinkProgram`](clLinkProgram.html)   whichever was performed last on     the specified program object for  |
|  `CL_PROGRAM_BUILD_OPTIONS`        |  `device` has not finished.          Return type: char\[\]               Return the build, compile or link   options specified by the            `options` argument in               [`clBui                             ldProgram`](clBuildProgram.html),   [`clCompil                          eProgram`](clCompileProgram.html)   or                                  [`clL                               inkProgram`](clLinkProgram.html),   whichever was performed last on     `program` for `device`.             If build status of `program` for    `device` is `CL_BUILD_NONE`, an   |
|  `CL_PROGRAM_BUILD_LOG`            |  empty string is returned.           Return type: char\[\]               Return the build, compile or link   log for                             [`clBu                              ildProgram`](clBuildProgram.html)   or                                  [`clCompil                          eProgram`](clCompileProgram.html)   whichever was performed last on     `program` for `device`.             If build status of `program` for    `device` is `CL_BUILD_NONE`, an   |
|  `CL_PROGRAM_BINARY_TYPE`          |  empty string is returned.           Return type:                        cl\_program\_binary\_type           Return the program binary type      for `device`. This can be one of    the following values:               `CL_PROGRAM_BINARY_TYPE_NONE`.      There is no binary associated       with `device`.                      `CL_PROG                            RAM_BINARY_TYPE_COMPILED_OBJECT`.   A compiled binary is associated     with `device`. This is the case     if `program` was created using      [`clCreateProgramWithSource`        ](clCreateProgramWithSource.html)   and compiled using                  [`clCompil                          eProgram`](clCompileProgram.html)   or a compiled binary is loaded      using                               [`clCreateProgramWithBinary`]       (clCreateProgramWithBinary.html).   `CL_PROGRAM_BINARY_TYPE_LIBRARY`.   A library binary is associated      with `device`. This is the case     if `program` was created by         [`cl                                LinkProgram`](clLinkProgram.html)   which is called with the            `–create-library` link option or    if a library binary is loaded       using                               [`clCreateProgramWithBinary`]       (clCreateProgramWithBinary.html).   `CL                                 _PROGRAM_BINARY_TYPE_EXECUTABLE`.   An executable binary is             associated with `device`. This is   the case if `program` was created   by                                  [`cl                                LinkProgram`](clLinkProgram.html)   without the `–create-library`       link option or program was          created by                          [`clBu                              ildProgram`](clBuildProgram.html)   or an executable binary is loaded   using                               [`clCreateProgramWithBinary`]       (clCreateProgramWithBinary.html).   `CL_P                               ROGRAM_BINARY_TYPE_INTERMEDIATE`.   (Applies if extension               [`cl_khr_spir`](cl_khr_spir.html)   is enabled.) An intermediate        (non-source) representation for     the program is loaded as a          binary. The program must be         further processed with              [`clCompil                          eProgram`](clCompileProgram.html)   or                                  [`clBui                             ldProgram`](clBuildProgram.html).   If processed with                   [`clCompile                         Program`](clCompileProgram.html),   the result will be a binary of      type                                `CL_PRO                             GRAM_BINARY_TYPE_COMPILED_OBJECT`   or                                  `CL_PROGRAM_BINARY_TYPE_LIBRARY`.   If processed with                   [`clBui                             ldProgram`](clBuildProgram.html),   the result will be a binary of      type                                `CL                               |
|  `CL_PROGRAM_BU                      ILD_GLOBAL_- VARIABLE_TOTAL_SIZE` |  _PROGRAM_BINARY_TYPE_EXECUTABLE`.   Return type: size\_t                The total amount of storage, in     bytes, used by program variables  |

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Specifies the size in bytes of memory pointed to by `param_value`. This
size must be ≥ size of return type as described in the table above.

`param_value_size_ret`  
Returns the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

## Notes

A program binary (compiled binary, library binary or executable binary)
built for a parent device can be used by all its sub-devices. If a
program binary has not been built for a sub-device, the program binary
associated with the parent device will be used.

A program binary for a device specified with
[`clCreateProgramWithBinary`](clCreateProgramWithBinary.html) or queried
using [`clGetProgramInfo`](clGetProgramInfo.html) can be used as the
binary for the associated root device, and all sub-devices created from
the root-level device or sub-devices thereof.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully. Otherwise
it returns the following:

-   Returns `CL_INVALID_DEVICE` if `device` is not in the list of
    devices associated with `program`.

-   Returns `CL_INVALID_VALUE` if `param_name` is not valid, or if size
    in bytes specified by `param_value_size` is &lt; size of return type
    as described in the table above and `param_value` is not NULL.

-   Returns `CL_INVALID_PROGRAM` if `program` is a not a valid program
    object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetProgramInfo`](clGetProgramInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
217](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=217)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
