
## Parameters

`context`  
A valid OpenCL context used to create the pipe object.

`flags`  
A bit-field that is used to specify allocation and usage information
such as the memory arena that should be used to allocate the pipe object
and how it will be used. The table below describes the possible values
for `flags`. Only `CL_MEM_READ_ONLY`, `CL_MEM_WRITE_ONLY`,
`CL_MEM_READ_WRITE`, and `CL_MEM_HOST_NO_ACCESS` can be specified when
creating a pipe object. If value specified for `flags` is 0, the default
is used which is `CL_MEM_READ_WRITE` | `CL_MEM_HOST_NO_ACCESS`.

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

`pipe_packet_size`  
Size in bytes of a pipe packet.

`pipe_max_packets`  
Specifies the pipe capacity by specifying the maximum number of packets
the pipe can hold.

`properties`  
A list of properties for the pipe and their corresponding values. Each
property name is immediately followed by the corresponding desired
value. The list is terminated with 0. In OpenCL 2.0, `properties` must
be NULL.

`errcode_ret`  
Will return an appropriate error code. If `errcode_ret` is NULL, no
error code is returned.

## Notes

Pipes follow the same memory consistency model as defined for buffer and
image objects. The pipe state i.e. contents of the pipe across kernel
executions (on the same or different devices) is enforced at a
synchronization point.

## Errors

`clCreatePipe` returns a valid non-zero pipe object and `errcode_ret` is
set to `CL_SUCCESS` if the pipe object is created successfully.
Otherwise, it returns a NULL value with one of the following error
values returned in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if values specified in `flags` are not as defined
    above.

-   `CL_INVALID_VALUE` if `properties` is not NULL.

-   `CL_INVALID_PIPE_SIZE` if `pipe_packet_size` is 0 or the
    `pipe_packet_size` exceeds `CL_DEVICE_PIPE_MAX_PACKET_SIZE` value
    specified in table 4.3 (see
    [`clGetDeviceInfo`](clGetDeviceInfo.html)) for all devices in
    `context` or if `pipe_max_packets` is 0.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for the pipe object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateBuffer`](clCreateBuffer.html),
[`clCreateImage`](clCreateImage.html)

## Specification

[OpenCL 2.1 API Specification, page
160](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=160)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
