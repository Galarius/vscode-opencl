
## Parameters

`platform`  
The platform ID returned by [`clGetPlatformIDs`](clGetPlatformIDs.html)
or can be NULL. If `platform` is NULL, the behavior is
implementation-defined.

`param_name`  
An enumeration constant that identifies the platform information being
queried. It can be one of the values specified in the table below.

`param_value`  
A pointer to memory location where appropriate values for a given
`param_name` will be returned. Possible `param_value` values returned
are listed in the table below. If `param_value` is NULL, it is ignored.

`param_value_size`  
Specifies the size in bytes of memory pointed to by `param_value`. This
size in bytes must be ≥ size of return type specified in the table
below.

`param_value_size_ret`  
Returns the actual size in bytes of data being queried by `param_value`.
If `param_value_size_ret` is NULL, it is ignored

| cl\_platform\_info   | Return Type          | Description           |
| --- | --- | --- |
|  `                      CL_PLATFORM_PROFILE` |  char\[\]             |  OpenCL profile          string. Returns the     profile name            supported by the        implementation. The     profile name returned   can be one of the       following strings:      FULL\_PROFILE - if      the implementation      supports the OpenCL     specification           (functionality          defined as part of      the core                specification and       does not require any    extensions to be        supported).             EMBEDDED\_PROFILE -     if the implementation   supports the OpenCL     embedded profile. The   embedded profile is     defined to be a         subset for each         version of OpenCL.      The embedded profile    for OpenCL 2.1 is       described in section    7.                    |
|  `                      CL_PLATFORM_VERSION` |  char\[\]             |  OpenCL version          string. Returns the     OpenCL version          supported by the        implementation. This    version string has      the following format:   `OpenCL<space><majo     r_version.minor_versi   on><space><platform-s   pecific information>`   The                     `major_v                ersion.minor_version`   value returned will     be 2.1.               |
|  `CL_PLATFORM_NAME`   |  char\[\]             |  Platform name string. |
|  `CL_PLATFORM_VENDOR` |  char\[\]             |  Platform vendor         string.               |
|  `CL_                   PLATFORM_EXTENSIONS` |  char\[\]             |  Returns a               space-separated list    of extension names      (the extension names    themselves do not       contain any spaces)     supported by the        platform. Extensions    defined here must be    supported by all        devices associated      with this platform.   |
|  `CL_PLATFORM_HO        ST_TIMER_RESOLUTION` |  cl\_ulong            |  Returns the             resolution of the       host timer in           nanoseconds as used     by                      [`clGetDeviceAnd        HostTimer`](clGetDevi   ceAndHostTimer.html). |
|  `CL_PLAT               FORM_ICD_SUFFIX_KHR` |  char\[\]             |  If the                  [`cl_khr_i              cd`](cl_khr_icd.html)   extension is enabled,   the function name       suffix used to          identify extension      functions to be         directed to this        platform by the ICD     Loader.               |

Table 1. OpenCL Platform Queries

## Notes

A null terminated string is returned by OpenCL query function calls if
the return type of the information being queried is a char\[\].

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns the following: (The OpenCL specification does not
describe the order of precedence for error codes returned by API calls)

-   `CL_INVALID_PLATFORM` if `platform` is not a valid platform.

-   `CL_INVALID_VALUE` if `param_name` is not one of the supported
    values or if size in bytes specified by `param_value_size` is less
    than size of return type and `param_value` is not a NULL value.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetPlatformIDs`](clGetPlatformIDs.html)

## Specification

[OpenCL 2.1 API Specification, page
62](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=62)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
