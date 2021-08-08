
## Parameters

`num_entries`  
The number of [`cl_platform_id`](abstractDataTypes.html) entries that
can be added to `platforms`. If `platforms` is not NULL, the
`num_entries` must be greater than zero.

`platforms`  
Returns a list of OpenCL platforms found. The
[`cl_platform_id`](abstractDataTypes.html) values returned in
`platforms` can be used to identify a specific OpenCL platform. If
`platforms` argument is NULL, this argument is ignored. The number of
OpenCL platforms returned is the mininum of the value specified by
`num_entries` or the number of OpenCL platforms available.

`num_platforms`  
Returns the number of OpenCL platforms available. If `num_platforms` is
NULL, this argument is ignored.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully. If the
[`cl_khr_icd`](cl_khr_icd.html) extension is enabled, `clGetPlatformIDs`
returns `CL_SUCCESS` if the function is executed successfully and there
are a non zero number of platforms available.

Otherwise it returns one of the following errors:

-   `CL_INVALID_VALUE` if `num_entries` is equal to zero and `platforms`
    is not NULL or if both `num_platforms` and `platforms` are NULL.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

-   `CL_PLATFORM_NOT_FOUND_KHR` if the [`cl_khr_icd`](cl_khr_icd.html)
    extension is enabled and no platforms are found.

## Also see

[`clGetPlatformInfo`](clGetPlatformInfo.html),
[`clGetDeviceInfo`](clGetDeviceInfo.html), [Cardinality
Diagram](classDiagram.html)

## Specification

[OpenCL 2.1 API Specification, page
62](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=62)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
