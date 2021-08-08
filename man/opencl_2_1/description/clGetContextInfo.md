
## Parameters

`context`  
Specifies the OpenCL context being queried.

`param_name`  
An enumeration constant that specifies the information to query. The
valid values for `param_name` are:

| cl\_context\_info    | Return Type          | Information returned  |
| --- | --- | --- |
|  `CL_CONT               EXT_REFERENCE_COUNT` |  cl\_uint             |  in param\_value         Return the `context`    reference count. The    reference count         returned should be      considered              immediately stale. It   is unsuitable for       general use in          applications. This      feature is provided     for identifying       |
|  `CL_                 |  cl\_uint             |  memory leaks.           Return the number of  |
|  CONTEXT_NUM_DEVICES`   `CL_CONTEXT_DEVICES` |  cl\_device\_id\[\]   |  devices in `context`.   Return the list of    |
|  `CL                    _CONTEXT_PROPERTIES` |  cl\_context\_-         properties\[\]       |  devices in `context`.   Return the              `properties` argument   specified in            [`clCreateContext`](    clCreateContext.html)   or                      [`clCreateContex        tFromType`](clCreateC   ontextFromType.html).   If the `properties`     argument specified in   [`clCreateContext`](    clCreateContext.html)   or                      [`clCreateConte         xtFromType`](clCreate   ContextFromType.html)   used to create          `context` is not        NULL, the               implementation must     return the values       specified in the        `properties`            argument.               If the `properties`     argument specified in   [`clCreateContext`](    clCreateContext.html)   or                      [`clCreateConte         xtFromType`](clCreate   ContextFromType.html)   used to create          `context` is NULL,      the implementation      may return either a     `                       param_value_size_ret`   of 0, i.e. there is     no context property     value to be returned    or can return a         context property        value of 0 (where 0     is used to terminate    the context             properties list) in     the memory that         `param_value` points  |
|  `CL_CONT               EXT_D3D10_PREFER_- S   HARED_RESOURCES_KHR` |  cl\_bool             |  to.                     If the                  [`cl_khr_               d3d10_sharing`](cl_kh   r_d3d10_sharing.html)   extension is enabled,   returns `CL_TRUE` if    Direct3D 10 resources   created as shared by    setting `MiscFlags`     to include              `D3D10_                 RESOURCE_MISC_SHARED`   will perform faster     when shared with        OpenCL, compared with   resources which have    not set this flag.      Otherwise returns     |
|  `CL_CONT               EXT_D3D11_PREFER_- S   HARED_RESOURCES_KHR` |  cl\_bool             |  `CL_FALSE`.             If the                  [`cl_khr_               d3d11_sharing`](cl_kh   r_d3d11_sharing.html)   extension is enabled,   returns `CL_TRUE` if    Direct3D 11 resources   created as shared by    setting `MiscFlags`     to include              `D3D11_                 RESOURCE_MISC_SHARED`   will perform faster     when shared with        OpenCL, compared with   resources which have    not set this flag.      Otherwise returns     |

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Specifies the size in bytes of memory pointed to by `param_value`. This
size must be greater than or equal to the size of return type as
described in the table above.

`param_value_size_ret`  
Returns the actual size in bytes of data being queried by `param_value`.
If `param_value_size_ret` is NULL, it is ignored.

## Errors

Returns `CL_SUCCESS` if the function executed successfully, or one of
the errors below:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if `param_name` is not one of the supported
    values or if size in bytes specified by `param_value_size` is &lt;
    size of return type as specified in the table above and
    `param_value` is not a `NULL` value.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetDeviceInfo`](clGetDeviceInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
94](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=94)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
