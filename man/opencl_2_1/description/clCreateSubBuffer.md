
## Parameters

`buffer`  
A valid buffer object and cannot be a sub-buffer object.

`flags`  
A bit-field that is used to specify allocation and usage information
about the sub-buffer memory object being created and is described in the
table below. If the `CL_MEM_READ_WRITE`, `CL_MEM_READ_ONLY` or
`CL_MEM_WRITE_ONLY` values are not specified in `flags`, they are
inherited from the corresponding memory access qualifers associated with
`buffer`. The `CL_MEM_USE_HOST_PTR`, `CL_MEM_ALLOC_HOST_PTR` and
`CL_MEM_COPY_HOST_PTR` values cannot be specified in `flags` but are
inherited from the corresponding memory access qualifiers associated
with `buffer`. If `CL_MEM_COPY_HOST_PTR` is specified in the memory
access qualifier values associated with `buffer` it does not imply any
additional copies when the sub-buffer is created from `buffer`. If the
`CL_MEM_HOST_WRITE_ONLY`, `CL_MEM_HOST_READ_ONLY` or
`CL_MEM_HOST_NO_ACCESS` values are not specified in `flags`, they are
inherited from the corresponding memory access qualifiers associated
with `buffer`.

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

`buffer_create_type` and `buffer_create_info`  
Describes the type of buffer object to be created. The list of supported
values for `buffer_create_type` and corresponding descriptor that
`buffer_create_info` points to is described below.

| cl\_buffer\_create\_type          | Description                       |
| --- | --- |
|  `CL_BUFFER_CREATE_TYPE_REGION`    |  Create a buffer object that         represents a specific region in     `buffer`.                           `buffer_create_info` is a pointer   to the following structure:             t                               ypedef struct _cl_buffer_region {           size_t origin;                      size_t size;                    } cl_buffer_region;             (`origin, size`) defines the        offset and size in bytes in         `buffer`.                           If `buffer` is created with         `CL_MEM_USE_HOST_PTR`, the          `host_ptr` associated with the      buffer object returned is           `host_ptr` + `origin`.              The buffer object returned          references the data store           allocated for `buffer` and points   to a specific region given by       (`origin, size`) in this data       store.                              `CL_INVALID_VALUE` is returned in   `errcode_ret` if the region         specified by (`origin, size`) is    out of bounds in `buffer`.          `CL_INVALID_BUFFER_SIZE` if         `size` is 0.                        `CL_MISALIGNED_SUB_BUFFER_OFFSET`   is returned in `errcode_ret` if     there are no devices in context     associated with `buffer` for        which the `origin` value is         aligned to the                      `CL_DEVICE_MEM_BASE_ADDR_ALIGN`     value.                            |

## Notes

Concurrent reading from, writing to and copying between both a buffer
object and its sub-buffer object(s) is undefined. Concurrent reading
from, writing to and copying between overlapping sub-buffer objects
created with the same buffer object is undefined. Only reading from both
a buffer object and its sub-buffer objects or reading from multiple
overlapping sub-buffer objects is defined.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors in `errcode_ret`

-   `CL_INVALID_MEM_OBJECT` if `buffer` is not a valid buffer object or
    is a sub-buffer object.

-   `CL_INVALID_VALUE` if `buffer` was created with `CL_MEM_WRITE_ONLY`
    and `flags` specifies `CL_MEM_READ_WRITE` or `CL_MEM_READ_ONLY`, or
    if `buffer` was created with `CL_MEM_READ_ONLY` and `flags`
    specifies `CL_MEM_READ_WRITE` or `CL_MEM_WRITE_ONLY`, or if `flags`
    specifies `CL_MEM_USE_HOST_PTR` or `CL_MEM_ALLOC_HOST_PTR` or
    `CL_MEM_COPY_HOST_PTR`.

-   `CL_INVALID_VALUE` if `buffer` was created with
    `CL_MEM_HOST_WRITE_ONLY` and `flags` specifies
    `CL_MEM_HOST_READ_ONLY` or if `buffer` was created with
    `CL_MEM_HOST_READ_ONLY` and `flags` specifies
    `CL_MEM_HOST_WRITE_ONLY`, or if `buffer` was created with
    `CL_MEM_HOST_NO_ACCESS` and `flags` specifies
    `CL_MEM_HOST_READ_ONLY` or `CL_MEM_HOST_WRITE_ONLY`.

-   `CL_INVALID_VALUE` if value specified in `buffer_create_type` is not
    valid.

-   `CL_INVALID_VALUE` if value(s) specified in `buffer_create_info`
    (for a given `buffer_create_type`) is not valid or if
    `buffer_create_info` is NULL.

-   `CL_INVALID_BUFFER_SIZE` if size is 0.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for sub-buffer object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateBuffer`](clCreateBuffer.html),
[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html)

## Specification

[OpenCL 2.1 API Specification, page
107](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=107)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
