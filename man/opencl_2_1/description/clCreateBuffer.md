
## Parameters

`context`  
A valid OpenCL context used to create the buffer object.

`flags`  
A bit-field that is used to specify allocation and usage information
such as the memory arena that should be used to allocate the buffer
object and how it will be used. The following table describes the
possible values for `flags`. If value specified for `flags` is 0, the
default is used which is `CL_MEM_READ_WRITE`.

| cl\_mem\_flags                    | Description                       |
| --- | --- |
|  `CL_MEM_READ_WRITE`               |  This flag specifies that the        memory object will be read and      written by a kernel. This is the    default.                          |
|  `CL_MEM_WRITE_ONLY`               |  This flag specifies that the        memory object will be written but   not read by a kernel.               Reading from a buffer or image      object created with                 `CL_MEM_WRITE_ONLY` inside a        kernel is undefined.                `CL_MEM_READ_WRITE` and             `CL_MEM_WRITE_ONLY` are mutually    exclusive.                        |
|  `CL_MEM_READ_ONLY`                |  This flag specifies that the        memory object is a read-only        memory object when used inside a    kernel.                             Writing to a buffer or image        object created with                 `CL_MEM_READ_ONLY` inside a         kernel is undefined.                `CL_MEM_READ_WRITE` or              `CL_MEM_WRITE_ONLY` and             `CL_MEM_READ_ONLY` are mutually     exclusive.                        |
|  `CL_MEM_USE_HOST_PTR`             |  This flag is valid only if          `host_ptr` is not NULL. If          specified, it indicates that the    application wants the OpenCL        implementation to use memory        referenced by `host_ptr` as the     storage bits for the memory         object.                             OpenCL implementations are          allowed to cache the buffer         contents pointed to by `host_ptr`   in device memory. This cached       copy can be used when kernels are   executed on a device.               The result of OpenCL commands       that operate on multiple buffer     objects created with the same       `host_ptr` or overlapping host      regions is considered to be         undefined.                        |
|  `CL_MEM_ALLOC_HOST_PTR`           |  This flag specifies that the        application wants the OpenCL        implementation to allocate memory   from host accessible memory.        `CL_MEM_ALLOC_HOST_PTR` and         `CL_MEM_USE_HOST_PTR` are           mutually exclusive.               |
|  `CL_MEM_COPY_HOST_PTR`            |  This flag is valid only if          `host_ptr` is not NULL. If          specified, it indicates that the    application wants the OpenCL        implementation to allocate memory   for the memory object and copy      the data from memory referenced     by `host_ptr`.                      `CL_MEM_COPY_HOST_PTR` and          `CL_MEM_USE_HOST_PTR` are           mutually exclusive.                 `CL_MEM_COPY_HOST_PTR` can be       used with `CL_MEM_ALLOC_HOST_PTR`   to initialize the contents of the   `cl_mem` object allocated using     host-accessible (e.g. PCIe)         memory.                           |
|  `CL_MEM_HOST_WRITE_ONLY`          |  This flag specifies that the host   will only write to the memory       object (using OpenCL APIs that      enqueue a write or a map for        write). This can be used to         optimize write access from the      host (e.g. enable write-combined    allocations for memory objects      for devices that communicate with   the host over a system bus such     as PCIe).                         |
|  `CL_MEM_HOST_READ_ONLY`           |  This flag specifies that the host   will only read the memory object    (using OpenCL APIs that enqueue a   read or a map for read).            `CL_MEM_HOST_WRITE_ONLY` and        `CL_MEM_HOST_READ_ONLY` are         mutually exclusive.               |
|  `CL_MEM_HOST_NO_ACCESS`           |  This flag specifies that the host   will not read or write the memory   object.                             `CL_MEM_HOST_WRITE_ONLY` or         `CL_MEM_HOST_READ_ONLY` and         `CL_MEM_HOST_NO_ACCESS` are         mutually exclusive.               |

`size`  
The size in bytes of the buffer memory object to be allocated.

`host_ptr`  
A pointer to the buffer data that may already be allocated by the
application. The size of the buffer that `host_ptr` points to must be ≥
`size` bytes.

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Notes

The user is responsible for ensuring that data passed into and out of
OpenCL images are natively aligned relative to the start of the buffer
as per kernel language or IL requirements. OpenCL buffers created with
`CL_MEM_USE_HOST_PTR` need to provide an appropriately aligned host
memory pointer that is aligned to the data types used to access these
buffers in a kernel(s).

If `clCreateBuffer` is called with a pointer returned by `clSVMAlloc` as
its `host_ptr` argument, and `CL_MEM_USE_HOST_PTR` is set in its `flags`
argument, `clCreateBuffer` will succeed and return a valid non-zero
buffer object as long as the `size` argument to `clCreateBuffer` is no
larger than the `size` argument passed in the original `clSVMAlloc`
call. The new buffer object returned has the shared memory as the
underlying storage. Locations in the buffer’s underlying shared memory
can be operated on using atomic operations to the device’s level of
support as defined in the memory model.

## Errors

Returns a valid non-zero buffer object and `errcode_ret` is set to
`CL_SUCCESS` if the buffer object is created successfully. Otherwise, it
returns a NULL value with one of the following error values returned in
`errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if values specified in `flags` are not valid as
    defined in the table above.

-   `CL_INVALID_BUFFER_SIZE` if `size` is 0.

    Implementations may return `CL_INVALID_BUFFER_SIZE` if `size` is
    greater than the `CL_DEVICE_MAX_MEM_ALLOC_SIZE` value specified in
    the table of allowed values for `param_name` for
    [`clGetDeviceInfo`](clGetDeviceInfo.html) for all `devices` in
    context.

-   `CL_INVALID_HOST_PTR` if `host_ptr` is NULL and
    `CL_MEM_USE_HOST_PTR` or `CL_MEM_COPY_HOST_PTR` are set in `flags`
    or if `host_ptr` is not NULL but `CL_MEM_COPY_HOST_PTR` or
    `CL_MEM_USE_HOST_PTR` are not set in `flags`.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for buffer object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html),
[`clCreateSubBuffer`](clCreateSubBuffer.html), [Cardinality
Diagram](classDiagram.html)

## Specification

[OpenCL 2.1 API Specification, page
104](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=104)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
