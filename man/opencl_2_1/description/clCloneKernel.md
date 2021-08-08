
## Parameters

`source_kernel`  
A valid `cl_kernel` object that will be copied. `source_kernel` will not
be modified in any way by this function.

`errcode_ret`  
Assigned an appropriate error code. If `errcode_ret` is `NULL`, no error
code is returned.

## Description

Makes a shallow copy of the kernel object, its arguments and any
information passed to the kernel object using
[`clSetKernelExecInfo`](clSetKernelExecInfo.html). If the kernel object
was ready to be enqueued before copying it, the clone of the kernel
object is ready to enqueue.

## Notes

The returned kernel object is an exact copy of `source_kernel`, with one
caveat: the reference count on the returned kernel object is set as if
it had been returned by [`clCreateKernel`](clCreateKernel.html) . The
reference count of `source_kernel` will not be changed.

The resulting kernel will be in the same state as if
[`clCreateKernel`](clCreateKernel.html) is called to create the
resultant kernel with the same arguments as those used to create
`source_kernel`, the latest call to
[`clSetKernelArg`](clSetKernelArg.html) or
[`clSetKernelArgSVMPointer`](clSetKernelArgSVMPointer.html) for each
argument index applied to kernel and the last call to
[`clSetKernelExecInfo`](clSetKernelExecInfo.html) for each value of the
param name parameter are applied to the new kernel object.

All arguments of the new kernel object must be intact and it may be
correctly used in the same situations as kernel except those that assume
a pre-existing reference count. Setting arguments on the new kernel
object will not affect `source_kernel` except insofar as the argument
points to a shared underlying entity and in that situation behavior is
as if two kernel objects had been created and the same argument applied
to each. Only the data stored in the kernel object is copied; data
referenced by the kernel’s arguments are not copied. For example, if a
buffer or pointer argument is set on a kernel object, the pointer is
copied but the underlying memory allocation is not.

## Errors

Returns a valid non-zero kernel object and `errcode_ret` is set to
`CL_SUCCESS` if the kernel is successfully copied. Otherwise it returns
a NULL value with one of the following error values returned in
`errcode_ret`:

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host

## Also see

[`clSetKernelExecInfo`](clSetKernelExecInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
230](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=230)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
