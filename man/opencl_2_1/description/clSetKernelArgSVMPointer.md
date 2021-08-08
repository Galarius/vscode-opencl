
## Parameters

`kernel`  
A valid kernel object.

`arg_index`  
The argument index. Arguments to the kernel are referred by indices that
go from 0 for the leftmost argument to `n` - 1, where `n` is the total
number of arguments declared by a kernel.

`arg_value`  
The SVM pointer that should be used as the argument value for argument
specified by `arg_index`. The SVM pointer specified is the value used by
all API calls that enqueue `kernel`
([`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html)) until the
argument value is changed by a call to `clSetKernelArgSVMPointer` for
`kernel`. The SVM pointer can only be used for arguments that are
declared to be a pointer to `global` or `constant` memory. The SVM
pointer value must be aligned according to the argument type. For
example, if the argument is declared to be `global float4 *p`, the SVM
pointer value passed for `p` must be at a minimum aligned to a `float4`.
The SVM pointer value specified as the argument value can be the pointer
returned by [`clSVMAlloc`](clSVMAlloc.html) or can be a pointer + offset
into the SVM region.

## Notes

Multiple Host Threads

An OpenCL API call is considered to be *thread-safe* if the internal
state as managed by OpenCL remains consistent when called simultaneously
by multiple *host* threads. OpenCL API calls that are *thread-safe*
allow an application to call these functions in multiple *host* threads
without having to implement mutual exclusion across these *host* threads
i.e. they are also re-entrant-safe.

All OpenCL API calls are thread-safe except those that modify the state
of cl\_kernel objects: [`clSetKernelArg`](clSetKernelArg.html),
[`clSetKernelArgSVMPointer`](#),
[`clSetKernelExecInfo`](clSetKernelExecInfo.html) and
[`clCloneKernel`](clCloneKernel.html).

[`clSetKernelArg`](clSetKernelArg.html) ,
[`clSetKernelArgSVMPointer`](#),
[`clSetKernelExecInfo`](clSetKernelExecInfo.html) and
[`clCloneKernel`](clCloneKernel.html) are safe to call from any host
thread, and safe to call re-entrantly so long as concurrent calls to any
combination of these API calls operate on different cl\_kernel objects.
The state of the cl\_kernel object is undefined if
[`clSetKernelArg`](clSetKernelArg.html),
[`clSetKernelArgSVMPointer`](#),
[`clSetKernelExecInfo`](clSetKernelExecInfo.html) or
[`clCloneKernel`](clCloneKernel.html) are called from multiple host
threads on the same cl\_kernel object at the same time. Please note that
there are additional limitations as to which OpenCL APIs may be called
from OpenCL callback functions — please see section 5.11.

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

`clSetKernelArgSVMPointer` returns `CL_SUCCESS` if the function is
executed successfully. Otherwise, it returns one of the following
errors:

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

-   `CL_INVALID_ARG_INDEX` if `arg_index` is not a valid argument index.

-   `CL_INVALID_ARG_VALUE` if `arg_value` specified is not a valid
    value.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clSetKernelArg`](clSetKernelArg.html),
[`clCreateKernel`](clCreateKernel.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clReleaseKernel`](clReleaseKernel.html),
[`clRetainKernel`](clRetainKernel.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
226](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=226)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
