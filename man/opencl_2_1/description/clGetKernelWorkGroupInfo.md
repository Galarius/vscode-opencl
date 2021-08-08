
## Parameters

`kernel`  
Specifies the kernel object being queried.

`device`  
Identifies a specific device in the list of devices associated with
`kernel`. The list of devices is the list of devices in the OpenCL
context that is associated with `kernel`. If the list of devices
associated with `kernel` is a single device, `device` can be a NULL
value.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by
`clGetKernelWorkGroupInfo` is described in the table below.

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Used to specify the size in bytes of memory pointed to by `param_value`.
This size must be ≥ size of return type as described in the table below.

| cl\_kerne            | Return Type          | Info. returned in     |
| --- | --- | --- |
|  l\_work\_group\_info   `CL_KERN               EL_GLOBAL_WORK_SIZE` |  size\_t\[3\]         |  `param_value`           This provides a         mechanism for the       application to query    the maximum global      size that can be used   to execute a kernel     (i.e.                   `global_work_size`      argument to             [`clEnqueueNDR          angeKernel`](clEnqueu   eNDRangeKernel.html))   on a custom device      given by `device` or    a built-in kernel on    an OpenCL device        given by `device`.      If `device` is not a    custom device or        `kernel` is not a       built-in kernel,        `clGe                   tKernelWorkGroupInfo`   returns the error     |
|  `CL_KER                NEL_WORK_GROUP_SIZE` |  size\_t              |  `CL_INVALID_VALUE`.     This provides a         mechanism for the       application to query    the maximum             work-group size that    can be used to          execute the kernel on   a specific device       given by `device`.      The OpenCL              implementation uses     the resource            requirements of the     kernel (register        usage etc.) to          determine what this     work-group size         should be.              As a result and         unlike                  `CL_DEVICE              _MAX_WORK_GROUP_SIZE`   this value may vary     from one kernel to      another as well as      one device to           another.                `CL_KE                  RNEL_WORK_GROUP_SIZE`   will be less than or    equal to                `CL_DEVICE              _MAX_WORK_GROUP_SIZE`   for a given kernel    |
|  `CL_KERNEL_COMPIL      E_- WORK_GROUP_SIZE` |  size\_t\[3\]         |  object.                 Returns the             work-group size         specified in the        kernel source or IL.    If the work-group       size is not specified   in the kernel source    or IL, (0, 0, 0) is   |
|  `CL_KE                 RNEL_LOCAL_MEM_SIZE` |  cl\_ulong            |  returned.               Returns the amount of   local memory in bytes   being used by a         kernel. This includes   local memory that may   be needed by an         implementation to       execute the kernel,     variables declared      inside the kernel       with the                [`local`](local.html)   address qualifier and   local memory to be      allocated for           arguments to the        kernel declared as      pointers with the       [`local`](local.html)   address qualifier and   whose size is           specified with          [`clSetKernelArg`](     clSetKernelArg.html).   If the local memory     size, for any pointer   argument to the         kernel declared with    the                     [`                      __local`](local.html)   address qualifier, is   not specified, its      size is assumed to    |
|  `CL_KERN               EL_PREFERRED_WORK_-    GROUP_SIZE_MULTIPLE` |  size\_t              |  be 0.                   Returns the preferred   multiple of workgroup   size for launch. This   is a performance        hint. Specifying a      workgroup size that     is not a multiple of    the value returned by   this query as the       value of the local      work size argument to   [`clEnqueueND           RangeKernel`](clEnque   ueNDRangeKernel.html)   will not fail to        enqueue the kernel      for execution unless    the work-group size     specified is larger     than the device       |
|  `CL_KERN               EL_PRIVATE_MEM_SIZE` |  cl\_ulong            |  maximum.                Returns the minimum     amount of private       memory, in bytes,       used by each            work-item in the        kernel. This value      may include any         private memory needed   by an implementation    to execute the          kernel, including       that used by the        language built-ins      and variable declared   inside the kernel       with the                [`__pr                  ivate`](private.html) |

`param_value_size_ret`  
Returns the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_DEVICE` if `device` is not in the list of devices
    associated with `kernel` or if `device` is NULL but there is more
    than one device associated with `kernel`.

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the table above and `param_value` is not NULL.

-   `CL_INVALID_VALUE` if `param_name` is `CL_KERNEL_GLOBAL_WORK_SIZE`
    and `device` is not a custom device and `kernel` is not a built-in
    kernel.

-   `CL_INVALID_KERNEL` if `kernel` is a not a valid kernel object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateKernel`](clCreateKernel.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clReleaseKernel`](clReleaseKernel.html),
[`clRetainKernel`](clRetainKernel.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelInfo`](clGetKernelInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
233](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=233)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
