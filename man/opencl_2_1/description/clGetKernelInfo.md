
## Parameters

`kernel`  
Specifies the kernel object being queried.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by `clGetKernelInfo`
is described in the table below.

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Used to specify the size in bytes of memory pointed to by `param_value`.
This size must be ≥ size of return type as described in the table below.

| cl\_kernel\_info     | Return Type          | Info. returned in     |
| --- | --- | --- |
|  `CL_K                |  char\[\]             |  `param_value`           Return the kernel     |
|  ERNEL_FUNCTION_NAME`   `CL_KERNEL_NUM_ARGS` |  cl\_uint             |  function name.          Return the number of    arguments to          |
|  `CL_KER                NEL_REFERENCE_COUNT` |  cl\_uint             |  `kernel`.               Return the `kernel`     reference count.        The reference count     returned should be      considered              immediately stale. It   is unsuitable for       general use in          applications. This      feature is provided     for identifying       |
|  `CL_KERNEL_CONTEXT`  |  cl\_context          |  memory leaks.           Return the context      associated with       |
|  `CL_KERNEL_PROGRAM`  |  cl\_program          |  `kernel`.               Return the program      object associated     |
|  `C                     L_KERNEL_ATTRIBUTES` |  char\[\]             |  with `kernel`.          Returns any             attributes specified    using the               *[`attribu              te`](attribute.html)*   qualifier with the      kernel function         declaration in the      program source. These   attributes include      those on the            *[`attribu              te`](attribute.html)*   page and other          attributes supported    by an implementation.   Attributes are          returned as they were   declared inside         *[`attribute`           ](attribute.html)*…​,   with any surrounding    whitespace and          embedded newlines       removed. When           multiple attributes     are present, they are   returned as a single,   space delimited         string.                 For kernels not         created from OpenCL C   source and the          [`clCreateProgramWi     thSource`](clCreatePr   ogramWithSource.html)   API call the string     returned from this    |

`param_value_size_ret`  
the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the table above and `param_value` is not NULL.

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateKernel`](clCreateKernel.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clGetKernelArgInfo`](clGetKernelArgInfo.html),
[`clRetainKernel`](clRetainKernel.html),
[`clReleaseKernel`](clReleaseKernel.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
231](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=231)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
