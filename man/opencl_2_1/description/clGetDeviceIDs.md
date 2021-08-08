
## Parameters

`platform`  
Refers to the platform ID returned by
[`clGetPlatformIDs`](clGetPlatformIDs.html) or can be NULL. If
`platform` is NULL, the behavior is implementation-defined.

`device_type`  
A bitfield that identifies the type of OpenCL device. The `device_type`
can be used to query specific OpenCL devices or all OpenCL devices
available. The valid values for `device_type` are specified in the
following table.

| cl\_device\_type                  | Description                       |
| --- | --- |
|  `CL_DEVICE_TYPE_CPU`              |  An OpenCL device that is the host   processor. The host processor       runs the OpenCL implementations     and is a single or multi-core       CPU.                              |
|  `CL_DEVICE_TYPE_GPU`              |  An OpenCL device that is a GPU.     By this we mean that the device     can also be used to accelerate a    3D API such as OpenGL or DirectX. |
|  `CL_DEVICE_TYPE_ACCELERATOR`      |  Dedicated OpenCL accelerators       (for example the IBM CELL Blade).   These devices communicate with      the host processor using a          peripheral interconnect such as     PCIe.                             |
|  `CL_DEVICE_TYPE_CUSTOM`           |  Dedicated accelerators that do      not support programs written in     OpenCL C.                         |
|  `CL_DEVICE_TYPE_DEFAULT`          |  The default OpenCL device in the    system. The default device cannot   be a `CL_DEVICE_TYPE_CUSTOM`        device.                           |
|  `CL_DEVICE_TYPE_ALL`              |  All OpenCL devices available in     the system except                   `CL_DEVICE_TYPE_CUSTOM` devices.  |

`num_entries`  
The number of `cl_device_id` entries that can be added to `devices`. If
`devices` is not NULL, the `num_entries` must be greater than zero.

`devices`  
A list of OpenCL devices found. The `cl_device_id` values returned in
`devices` can be used to identify a specific OpenCL device. If `devices`
argument is NULL, this argument is ignored. The number of OpenCL devices
returned is the mininum of the value specified by `num_entries` or the
number of OpenCL devices whose type matches `device_type`.

`num_devices`  
The number of OpenCL devices available that match `device_type`. If
`num_devices` is NULL, this argument is ignored.

## Notes

`clGetDeviceIDs` may return all or a subset of the actual physical
devices present in the platform and that match `device_type`.

## Errors

`clGetDeviceIDs` returns `CL_SUCCESS` if the function is executed
successfully. Otherwise it returns one of the following errors:

-   `CL_INVALID_PLATFORM` if `platform` is not a valid platform.

-   `CL_INVALID_DEVICE_TYPE` if `device_type` is not a valid value.

-   `CL_INVALID_VALUE` if `num_entries` is equal to zero and `devices`
    is not NULL or if both `num_devices` and `devices` are NULL.

-   `CL_DEVICE_NOT_FOUND` if no OpenCL devices that matched
    `device_type` were found.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetDeviceInfo`](clGetDeviceInfo.html),
[`clGetPlatformIDs`](clGetPlatformIDs.html),
[`clCreateContext`](clCreateContext.html), [Cardinality
Diagram](classDiagram.html)

## Specification

[OpenCL 2.1 API Specification, page
64](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=64)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
