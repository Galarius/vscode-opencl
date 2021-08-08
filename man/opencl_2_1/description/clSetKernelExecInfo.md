
## Parameters

`kernel`  
Specifies the kernel object being queried.

`param_name`  
Specifies the information to be passed to `kernel`. The list of
supported `param_name` types and the corresponding values passed in
`param_value` is described in the table below.

`param_value_size`  
Specifies the size in bytes of the memory pointed to by `param_value`.

`param_value`  
A pointer to memory where the appropriate values determined by
`param_name` are specified.

| cl\_kernel\_exec\_info            | Type and Description              |
| --- | --- |
|  `CL_KERNEL_EXEC_INFO_SVM_PTRS`    |  Type: void \*\[\]                   SVM pointers used by a kernel       which are not passed as arguments   to `kernel`. These addresses may    be defined in SVM buffer(s) that    are passed as arguments to          `kernel`.                           These non-argument SVM pointers     must be specified using             `clSetKernelExecInfo` for           coarse-grain and fine-grain         buffer SVM allocations but not      for fine-grain system SVM           allocations.                      |
|  `CL_KERNEL_E                        XEC_INFO_SVM_- FINE_GRAIN_SYSTEM` |  Type: cl\_bool                      This flag indicates whether the     kernel uses pointers that are       fine grain system SVM               allocations. These fine grain       system SVM pointers may be passed   as arguments or defined in SVM      buffers that are passed as          argumentsto `kernel`.             |

## Notes

1\. Coarse-grain or fine-grain buffer SVM pointers used by a kernel
which are not passed as a kernel arguments must be specified using
`clSetKernelExecInfo` with `CL_KERNEL_EXEC_INFO_SVM_PTRS`. For example,
if SVM buffer A contains a pointer to another SVM buffer B, and the
kernel dereferences that pointer, then a pointer to B must either be
passed as an argument in the call to that kernel or it must be made
available to the kernel using `clSetKernelExecInfo`. For example, we
might pass extra SVM pointers as follows:

    clSetKernelExecInfo(kernel,
         CL_KERNEL_EXEC_INFO_SVM_PTRS,
         num_ptrs * sizeof(void *),
         extra_svm_ptr_list);

Here `num_ptrs` specifies the number of additional SVM pointers while
`extra_svm_ptr_list` specifies a pointer to memory containing those SVM
pointers.

When calling `clSetKernelExecInfo` with `CL_KERNEL_EXEC_INFO_SVM_PTRS`
to specify pointers to non-argument SVM buffers as extra arguments to a
kernel, each of these pointers can be the SVM pointer returned by
[`clSVMAlloc`](clSVMAlloc.html) or can be a pointer + offset into the
SVM region. It is sufficient to provide one pointer for each SVM buffer
used.

2\. `CL_KERNEL_EXEC_INFO_SVM_FINE_GRAIN_SYSTEM` is used to indicate
whether SVM pointers used by a kernel will refer to system allocations
or not.

`CL_KERNEL_EXEC_INFO_SVM_FINE_GRAIN_SYSTEM` = `CL_FALSE` indicates that
the OpenCL implementation may assume that system pointers are not passed
as kernel arguments and are not stored inside SVM allocations passed as
kernel arguments.

`CL_KERNEL_EXEC_INFO_SVM_FINE_GRAIN_SYSTEM` = `CL_TRUE` indicates that
the OpenCL implementation must assume that system pointers might be
passed as kernel arguments and/or stored inside SVM allocations passed
as kernel arguments. In this case, if the device to which the kernel is
enqueued does not support system SVM pointers,
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html) will return a
`CL_INVALID_OPERATION` error. If none of the devices in the context
associated with kernel support fine-grain system SVM allocations,
`clSetKernelExecInfo` will return a `CL_INVALID_OPERATION` error.

If `clSetKernelExecInfo` has not been called with a value for
`CL_KERNEL_EXEC_INFO_SVM_FINE_GRAIN_SYSTEM` the default value is used
for this kernel attribute. The defaule value depends on whether the
device on which the kernel is enqueued supports fine-grain system SVM
allocations. If so, the default value used is `CL_TRUE` (system pointers
might be passed); otherwise, the default is `CL_FALSE`.

3\. A call to `clSetKernelExecInfo` for a given value of `param_name`
replaces any prior value passed for that value of `param_name`. Only one
`param_value` will be stored for each value of `param_name`.

Multiple Host Threads

An OpenCL API call is considered to be *thread-safe* if the internal
state as managed by OpenCL remains consistent when called simultaneously
by multiple *host* threads. OpenCL API calls that are *thread-safe*
allow an application to call these functions in multiple *host* threads
without having to implement mutual exclusion across these *host* threads
i.e. they are also re-entrant-safe.

All OpenCL API calls are thread-safe except those that modify the state
of cl\_kernel objects: [`clSetKernelArg`](clSetKernelArg.html),
[`clSetKernelArgSVMPointer`](clSetKernelArgSVMPointer.html),
[`clSetKernelExecInfo`](#) and [`clCloneKernel`](clCloneKernel.html).

[`clSetKernelArg`](clSetKernelArg.html) ,
[`clSetKernelArgSVMPointer`](clSetKernelArgSVMPointer.html),
[`clSetKernelExecInfo`](#) and [`clCloneKernel`](clCloneKernel.html) are
safe to call from any host thread, and safe to call re-entrantly so long
as concurrent calls to any combination of these API calls operate on
different cl\_kernel objects. The state of the cl\_kernel object is
undefined if [`clSetKernelArg`](clSetKernelArg.html),
[`clSetKernelArgSVMPointer`](clSetKernelArgSVMPointer.html),
[`clSetKernelExecInfo`](#) or [`clCloneKernel`](clCloneKernel.html) are
called from multiple host threads on the same cl\_kernel object at the
same time. Please note that there are additional limitations as to which
OpenCL APIs may be called from OpenCL callback functions — please see
section 5.11.

The behavior of OpenCL APIs called from an interrupt or signal handler
is implementation-defined.

There is an inherent race condition in the design of OpenCL that occurs
between setting a kernel argument and using the kernel with
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html). Another host
thread might change the kernel arguments between when a host thread sets
the kernel arguments and then enqueues the kernel, causing the wrong
kernel arguments to be enqueued. Rather than attempt to share
`cl_kernel` objects among multiple host threads, applications are
strongly encouraged to make additional `cl_kernel` objects for kernel
functions for each host thread.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

-   `CL_INVALID_VALUE` if `param_name` is not valid, if `param_value` is
    NULL or if the size specified by `param_value_size` is not valid.

-   `CL_INVALID_OPERATION` if `param_name` =
    `CL_KERNEL_EXEC_INFO_SVM_FINE_GRAIN_SYSTEM` and `param_value` =
    `CL_TRUE` but no devices in context associated with `kernel` support
    fine-grain system SVM allocations.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateKernel`](clCreateKernel.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clGetKernelArgInfo`](clGetKernelArgInfo.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html),
[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html)

## Specification

[OpenCL 2.1 API Specification, page
227](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=227)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
