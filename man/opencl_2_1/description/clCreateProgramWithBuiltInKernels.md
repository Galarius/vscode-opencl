
## Parameters

`context`  
Must be a valid OpenCL context.

`num_devices`  
The number of devices listed in `device_list`.

`device_list`  
A pointer to a list of devices that are in `context`. `device_list` must
be a non-NULL value. The built-in kernels are loaded for devices
specified in this list.

The devices associated with the program object will be the list of
devices specified by `device_list`. The list of devices specified by
`device_list` must be devices associated with `context`.

`kernel_names`  
A semi-colon separated list of built-in kernel names.

## Errors

Returns a valid non-zero program object and `errcode_ret` is set to
`CL_SUCCESS` if the program object is created successfully. Otherwise,
it returns a NULL value with one of the following error values returned
in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if `device_list` is NULL or `num_devices` is
    zero;

-   `CL_INVALID_VALUE` if `kernel_names` is NULL or `kernel_names`
    contains a kernel name that is not supported by any of the devices
    in `device_list`.

-   `CL_INVALID_DEVICE` if devices listed in `device_list` are not in
    the list of devices associated with `context`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateProgramWithSource`](clCreateProgramWithSource.html),
[`clCreateProgramWithBinary`](clCreateProgramWithBinary.html),
[`clReleaseProgram`](clReleaseProgram.html),
[`clRetainProgram`](clRetainProgram.html), [Cardinality
Diagram](classDiagram.html)

## Specification

[OpenCL 2.1 API Specification, page
198](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=198)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
