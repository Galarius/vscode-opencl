
## Parameters

`pipe`  
Specifies the pipe object being queried.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by `clGetPipeInfo`
is described in the table below.

| cl\_pipe\_info       | Return Type          | Info. returned in     |
| --- | --- | --- |
|  `                      CL_PIPE_PACKET_SIZE` |  cl\_uint             |  `param_value`           Return pipe packet      size specified when     `pipe` is created       with                    [`clCreatePipe`       |
|  `                      CL_PIPE_MAX_PACKETS` |  cl\_uint             |  ](clCreatePipe.html).   Return max. number of   packets specified       when `pipe` is          created with            [`clCreatePipe`       |

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Used to specify the size in bytes of memory pointed to by `param_value`.
This size must be ≥ size of return type as described in the table above.

`param_value_size_ret`  
Returns the actual size in bytes of data being queried by `param_value`.
If `param_value_size_ret` is NULL, it is ignored.

## Notes

To get information that is common to all memory objects, use the
[`clGetMemObjectInfo`](clGetMemObjectInfo.html) function.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; the size of return type as
    described in the table above and `param_value` is not NULL.

-   `CL_INVALID_MEM_OBJECT` if `pipe` is a not a valid memory object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetImageInfo`](clGetImageInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
161](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=161)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
