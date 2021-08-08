
## Notes

Increments the `device` reference count if `device` is a valid
sub-device created by a call to
[`clCreateSubDevices`](clCreateSubDevices.html). If `device` is a root
level device i.e. a `cl_device_id` returned by
[`clGetDeviceIDs`](clGetDeviceIDs.html), the `device` reference count
remains unchanged.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully or the
device is a root-level device. Otherwise, it returns one of the
following errors:

-   `CL_INVALID_DEVICE` if `device` is not a valid sub-device created by
    a call to [`clCreateSubDevices`](clCreateSubDevices.html).

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateSubDevices`](clCreateSubDevices.html),
[`clGetDeviceIDs`](clGetDeviceIDs.html),
[`clReleaseDevice`](clReleaseDevice.html)

## Specification

[OpenCL 2.1 API Specification, page
88](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=88)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
