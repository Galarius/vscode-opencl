
## Parameters

`kernel`  
A valid kernel object.

`arg_index`  
The argument index. Arguments to the kernel are referred by indices that
go from 0 for the leftmost argument to `n` - 1, where `n` is the total
number of arguments declared by a kernel.

`arg_value`  
A pointer to data that should be used as the argument value for argument
specified by `arg_index`. The argument data pointed to by `arg_value` is
copied and the `arg_value` pointer can therefore be reused by the
application after `clSetKernelArg` returns. The argument value specified
is the value used by all API calls that enqueue `kernel`
([`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html)) until the
argument value is changed by a call to `clSetKernelArg` for `kernel`.

If the argument is a memory object (buffer, pipe, image or image array),
the `arg_value` entry will be a pointer to the appropriate buffer, pipe,
image or image array object. The memory object must be created with the
context associated with the kernel object. If the argument is a buffer
object, the `arg_value` pointer can be NULL or point to a NULL value in
which case a NULL value will be used as the value for the argument
declared as a pointer to [`global`](global.html) or
[`constant`](constant.html) memory in the kernel. If the argument is
declared with the [`local`](local.html) qualifier, the `arg_value` entry
must be NULL. If the argument is of type `sampler_t`, the `arg_value`
entry must be a pointer to the sampler object. If the argument is of
type `queue_t`, the `arg_value` entry must be a pointer to the device
queue object.

If the argument is declared to be a pointer of a built-in scalar or
vector type, or a user defined structure type in the global or constant
address space, the memory object specified as argument value must be a
buffer object (or NULL). If the argument is declared with the
[`constant`](constant.html) qualifier, the size in bytes of the memory
object cannot exceed `CL_DEVICE_MAX_CONSTANT_BUFFER_SIZE` and the number
of arguments declared as pointers to [`constant`](constant.html) memory
cannot exceed `CL_DEVICE_MAX_CONSTANT_ARGS`.

The memory object specified as argument value must be a pipe object if
the argument is declared with the `pipe` qualifier.

The memory object specified as argument value must be a 2D image object
if the argument is declared to be of type
[`image2d_t`](abstractDataTypes.html). The memory object specified as
argument value must be a 2D image object with image channel order =
`CL_DEPTH` if the argument is declared to be of type
[`image2d_depth_t`](abstractDataTypes.html). The memory object specified
as argument value must be a 3D image object if argument is declared to
be of type [`image3d_t`](abstractDataTypes.html). The memory object
specified as argument value must be a 1D image object if the argument is
declared to be of type [`image1d_t`](abstractDataTypes.html). The memory
object specified as argument value must be a 1D image buffer object if
the argument is declared to be of type
[`image1d_buffer_t`](abstractDataTypes.html). The memory object
specified as argument value must be a 1D image array object if argument
is declared to be of type [`image1d_array_t`](abstractDataTypes.html).
The memory object specified as argument value must be a 2D image array
object if argument is declared to be of type
[`image2d_array_t`](abstractDataTypes.html). The memory object specified
as argument value must be a 2D image array object with image channel
order = `CL_DEPTH` if argument is declared to be of type
[`image2d_array_depth_t`](abstractDataTypes.html).

For all other kernel arguments, the `arg_value` entry must be a pointer
to the actual data to be used as argument value.

If the [`cl_khr_gl_msaa_sharing`](cl_khr_gl_msaa_sharing.html) extension
is supported, if the argument is a multi-sample 2D image, the
`arg_value` entry must be a pointer to a multisample image object. If
the argument is a multi-sample 2D depth image, the `arg_value` entry
must be a pointer to a multisample depth image object. If the argument
is a multi-sample 2D image array, the `arg_value` entry must be a
pointer to a multi-sample image array object. If the argument is a
multi-sample 2D depth image array, the `arg_value` entry must be a
pointer to a multi-sample depth image array object.

`arg_size`  
Specifies the size of the argument value. If the argument is a memory
object, the size is the size of the memory object. For arguments
declared with the [`local`](local.html) qualifier, the size specified
will be the size in bytes of the buffer that must be allocated for the
[`local`](local.html) argument. If the argument is of type `sampler_t`,
the `arg_size` value must be equal to `sizeof(cl_sampler)`. If the
argument is of type `queue_t`, the `arg_size` value must be equal to
`sizeof(cl_command_queue)`. For all other arguments, the size will be
the size of argument type.

## Notes

A kernel object does not update the reference count for objects such as
memory, sampler objects specified as argument values by
`clSetKernelArg`. Users may not rely on a kernel object to retain
objects specified as argument values to the kernel.

Implementations shall not allow `cl_kernel` objects to hold reference
counts to `cl_kernel` arguments, because no mechanism is provided for
the user to tell the kernel to release that ownership right. If the
kernel holds ownership rights on kernel args, that would make it
impossible for the user to tell with certainty when he may safely
release user allocated resources associated with OpenCL objects such as
the `cl_mem` backing store used with `CL_MEM_USE_HOST_PTR`.

Multiple Host Threads

An OpenCL API call is considered to be *thread-safe* if the internal
state as managed by OpenCL remains consistent when called simultaneously
by multiple *host* threads. OpenCL API calls that are *thread-safe*
allow an application to call these functions in multiple *host* threads
without having to implement mutual exclusion across these *host* threads
i.e. they are also re-entrant-safe.

All OpenCL API calls are thread-safe except those that modify the state
of cl\_kernel objects: [`clSetKernelArg`](#),
[`clSetKernelArgSVMPointer`](clSetKernelArgSVMPointer.html),
[`clSetKernelExecInfo`](clSetKernelExecInfo.html) and
[`clCloneKernel`](clCloneKernel.html).

[`clSetKernelArg`](#) ,
[`clSetKernelArgSVMPointer`](clSetKernelArgSVMPointer.html),
[`clSetKernelExecInfo`](clSetKernelExecInfo.html) and
[`clCloneKernel`](clCloneKernel.html) are safe to call from any host
thread, and safe to call re-entrantly so long as concurrent calls to any
combination of these API calls operate on different cl\_kernel objects.
The state of the cl\_kernel object is undefined if
[`clSetKernelArg`](#),
[`clSetKernelArgSVMPointer`](clSetKernelArgSVMPointer.html),
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

`clSetKernelArg` returns `CL_SUCCESS` if the function is executed
successfully. Otherwise, it returns one of the following errors:

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

-   `CL_INVALID_ARG_INDEX` if `arg_index` is not a valid argument index.

-   `CL_INVALID_ARG_VALUE` if `arg_value` specified is not a valid
    value.

-   `CL_INVALID_MEM_OBJECT` for an argument declared to be a memory
    object when the specified `arg_value` is not a valid memory object.

-   `CL_INVALID_MEM_OBJECT` for an argument declared to be a
    multi-sample image, multisample image array, multi-sample depth
    image or a multi-sample depth image array and the argument value
    specified in `arg_value` does not follow the rules described above
    for a depth memory object or memory array object argument. (Applies
    if the [`cl_khr_gl_msaa_sharing`](cl_khr_gl_msaa_sharing.html)
    extension is supported.)

-   `CL_INVALID_SAMPLER` for an argument declared to be of type
    `sampler_t` when the specified `arg_value` is not a valid sampler
    object.

-   `CL_INVALID_DEVICE_QUEUE` for an argument declared to be of type
    `queue_t` when the specified `arg_value` is not a valid device queue
    object.

-   `CL_INVALID_ARG_SIZE` if `arg_size` does not match the size of the
    data type for an argument that is not a memory object or if the
    argument is a memory object and `arg_size` != `sizeof(cl_mem)` or if
    `arg_size` is zero and the argument is declared with the
    [`local`](local.html) qualifier or if the argument is a sampler and
    `arg_size` != `sizeof(cl_sampler)`.

-   `CL_INVALID_ARG_VALUE` if the argument is an image declared with the
    `read_only` qualifier and `arg_value` refers to an image object
    created with `cl_mem_flags` of `CL_MEM_WRITE` or if the image
    argument is declared with the `write_only` qualifier and `arg_value`
    refers to an image object created with `cl_mem_flags` of
    `CL_MEM_READ`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Example

    kernel void
    image_filter (int n, int m,
              constant float *filter_weights,
              read_only image2d_t src_image,
              write_only image2d_t dst_image)
    {
         ...
    }

Argument index values for `image_filter` will be 0 for `n`, 1 for `m`, 2
for `filter_weights`, 3 for `src_image` and 4 for `dst_image`.

## Also see

[`clEnqueueNDRangeKernel`](clEnqueueNDRangeKernel.html),
[`clCreateKernel`](clCreateKernel.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clReleaseKernel`](clReleaseKernel.html),
[`clRetainKernel`](clRetainKernel.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html),
[`clSetKernelArgSVMPointer`](clSetKernelArgSVMPointer.html)

## Specification

[OpenCL 2.1 API Specification, page
224](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=224)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
