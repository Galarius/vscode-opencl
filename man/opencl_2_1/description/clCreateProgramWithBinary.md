
## Parameters

`context`  
Must be a valid OpenCL context.

`device_list`  
A pointer to a list of devices that are in `context`. `device_list` must
be a non-NULL value. The binaries are loaded for devices specified in
this list.

`num_devices`  
The number of devices listed in `device_list`.

The devices associated with the program object will be the list of
devices specified by `device_list`. The list of devices specified by
`device_list` must be devices associated with `context`.

`lengths`  
An array of the size in bytes of the program binaries to be loaded for
devices specified by `device_list`.

`binaries`  
An array of pointers to program binaries to be loaded for devices
specified by `device_list`. For each device given by `device_list`\[i\],
the pointer to the program binary for that device is given by
`binaries`\[i\] and the length of this corresponding binary is given by
`lengths`\[i\]. `lengths`\[i\] cannot be zero and `binaries`\[i\] cannot
be a NULL pointer.

The program binaries specified by `binaries` contain the bits that
describe one of the following:

-   a program executable to be run on the device(s) associated with
    `context`,

-   a compiled program for device(s) associated with `context`, or

-   a library of compiled programs for device(s) associated with
    `context`.

The program binary can consist of either or both of device-specific code
and/or implementation-specific intermediate representation (IR) which
will be converted to the device-specific code.

`binary_status`  
Returns whether the program binary for each device specified in
`device_list` was loaded successfully or not. It is an array of
`num_devices` entries and returns `CL_SUCCESS` in `binary_status`\[i\]
if binary was successfully loaded for device specified by
`device_list`\[i\]; otherwise returns `CL_INVALID_VALUE` if
`lengths`\[i\] is zero or if `binaries`\[i\] is a NULL value or
`CL_INVALID_BINARY` in `binary_status`\[i\] if program binary is not a
valid binary for the specified device. If `binary_status` is NULL, it is
ignored.

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Notes

OpenCL allows applications to create a program object using the program
source or binary and build appropriate program executables. This can be
very useful as it allows applications to load program source and then
compile and link to generate a program executable online on its first
instance for appropriate OpenCL devices in the system. These executables
can now be queried and cached by the application. Future instances of
the application launching will no longer need to compile and link the
program executables. The cached executables can be read and loaded by
the application, which can help significantly reduce the application
initialization time.

## Errors

Returns a valid non-zero program object and `errcode_ret` is set to
`CL_SUCCESS` if the program object is created successfully. Otherwise,
it returns a NULL value with one of the following error values returned
in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if `device_list` is NULL or `num_devices` is
    zero.

-   `CL_INVALID_DEVICE` if OpenCL devices listed in `device_list` are
    not in the list of devices associated with `context`.

-   `CL_INVALID_VALUE` if or if `lengths` or `binaries` are NULL or if
    any entry in `lengths`\[i\] or `binaries`\[i\] is NULL.

-   `CL_INVALID_BINARY` if an invalid program binary was encountered for
    any device. `binary_status` will return specific status for each
    device.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateProgramWithSource`](clCreateProgramWithSource.html),
[`clCreateProgramWithBuiltInKernels`](clCreateProgramWithBuiltInKernels.html),
[`clReleaseProgram`](clReleaseProgram.html),
[`clRetainProgram`](clRetainProgram.html), [Cardinality
Diagram](classDiagram.html)

## Specification

[OpenCL 2.1 API Specification, page
196](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=196)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
