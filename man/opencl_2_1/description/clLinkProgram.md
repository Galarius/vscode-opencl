
## Parameters

`context`  
Must be a valid OpenCL context.

`device_list`  
A pointer to a list of devices that are in `context`. If `device_list`
is a NULL value, the link is performed for all devices associated with
`context` for which a compiled object is available. If `device_list` is
a non-NULL value, the compile is performed for devices specified in this
list for which a compiled object is available.

`num_devices`  
The number of devices listed in `device_list`.

`options`  
A pointer to a null-terminated string of characters that describes the
link options to be used for building the program executable. See
[`clBuildProgram`](clBuildProgram.html) for a list of supported compiler
and linker options.

`num_input_programs`  
Specifies the number of programs in array referenced by
`input_programs`.

`input_programs`  
An array of program objects that are compiled binaries or libraries that
are to be linked to create the program executable. For each device in
`device_list` or if `device_list` is NULL the list of devices associated
with `context`, the following cases occur:

-   All programs specified by `input_programs` contain a compiled binary
    or library for the device. In this case, a link is performed to
    generate a program executable for this device.

-   None of the programs contain a compiled binary or library for that
    device. In this case, no link is performed and there will be no
    program executable generated for this device.

-   All other cases will return a `CL_INVALID_OPERATION` error.

`pfn_notify`  
A function pointer to a notification routine. The notification routine
is a callback function that an application can register and which will
be called when the program executable has been built (successfully or
unsuccessfully).

If `pfn_notify` is not NULL, `clLinkProgram` does not need to wait for
the linker to complete and can return immediately once the linking
operation can begin. Once the linker has completed, the `pfn_notify`
callback function is called which returns the program object returned by
`clLinkProgram`. The application can query the link status and log for
this program object. This callback function may be called asynchronously
by the OpenCL implementation. It is the application’s responsibility to
ensure that the callback function is thread-safe.

If `pfn_notify` is NULL, `clLinkProgram` does not return until the
linker has completed.

`user_data`  
Will be passed as an argument when `pfn_notify` is called. `user_data`
can be NULL.

## Notes

`clLinkProgram` creates a new program object which contains the library
or executable. [`clLinkProgram`](#) creates a new program object which
contains the library or executable. The library or executable binary can
be queried using [`clGetProgramInfo`](clGetProgramInfo.html)(`program`,
`CL_PROGRAM_BINARIES`, …​) and can be specified to
[`clCreateProgramWithBinary`](clCreateProgramWithBinary.html) to create
a new program object.

The devices associated with the returned program object will be the list
of devices specified by `device_list` or if `device_list` is NULL it
will be the list of devices associated with `context`.

The linking operation can begin if the context, list of devices, input
programs and linker options specified are all valid and appropriate host
and device resources needed to perform the link are available. If the
linking operation can begin, `clLinkProgram` returns a valid non-zero
program object.

## Errors

If `pfn_notify` is NULL, the `errcode_ret` will be set to `CL_SUCCESS`
if the link operation was successful and `CL_LINK_FAILURE` if there is a
failure to link the compiled binaries and/or libraries.

If `pfn_notify` is not NULL, `clLinkProgram` does not have to wait until
the linker to complete and can return `CL_SUCCESS` in `errcode_ret` if
the linking operation can begin. The `pfn_notify` callback function will
return a `CL_SUCCESS` or `CL_LINK_FAILURE` if the linking operation was
successful or not.

Otherwise `clLinkProgram` returns a NULL program object with an
appropriate error in `errcode_ret`. The application should query the
linker status of this program object to check if the link was successful
or not. The list of errors that can be returned are:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if `device_list` is NULL and `num_devices` is
    greater than zero, or if `device_list` is not NULL and `num_devices`
    is zero.

-   `CL_INVALID_VALUE` if `num_input_programs` is zero and
    `input_programs` is NULL or if `num_input_programs` is zero and
    `input_programs` is not NULL or if `num_input_programs` is not zero
    and `input_programs` is NULL.

-   `CL_INVALID_PROGRAM` if programs specified in `input_programs` are
    not valid program objects.

-   `CL_INVALID_VALUE` if `pfn_notify` is NULL but `user_data` is not
    NULL.

-   `CL_INVALID_DEVICE` if OpenCL devices listed in `device_list` are
    not in the list of devices associated with `context`.

-   `CL_INVALID_LINKER_OPTIONS` if the linker options specified by
    `options` are invalid

-   `CL_INVALID_OPERATION` if the compilation or build of a program
    executable for any of the devices listed in `device_list` by a
    previous call to [`clCompileProgram`](clCompileProgram.html) or
    [`clBuildProgram`](clBuildProgram.html) for `program` has not
    completed.

-   `CL_INVALID_OPERATION` if the rules for devices containing compiled
    binaries or libraries as described in `input_programs` argument
    above are not followed.

-   `CL_INVALID_OPERATION` if the one or more of the programs specified
    in `input_programs` requires independent forward progress of
    sub-groups but one or more of the devices listed in `device_list`
    does not return `CL_TRUE` for the
    `CL_DEVICE_SUBGROUP_INDEPENDENT_FORWARD_PROGRESS` query.

-   `CL_LINKER_NOT_AVAILABLE` if a linker is not available i.e.
    `CL_DEVICE_LINKER_AVAILABLE` specified in the table of allowed
    values for `param_name` for
    [`clGetDeviceInfo`](clGetDeviceInfo.html) is set to `CL_FALSE`.

-   `CL_LINK_PROGRAM_FAILURE` if there is a failure to link the compiled
    binaries and/or libraries.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetDeviceInfo`](clGetDeviceInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
205](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=205)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
