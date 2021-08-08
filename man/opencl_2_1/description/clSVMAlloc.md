
## Parameters

`context`  
A valid OpenCL context used to create the SVM buffer.

`flags`  
A bit-field that is used to specify allocation and usage information.
The following table describes the possible values for `flags`.

| cl\_svm\_mem\_flags               | Description                       |
| --- | --- |
|  `CL_MEM_READ_WRITE`               |  This flag specifies that the SVM    buffer will be read and written     by a kernel. This is the default. |
|  `CL_MEM_WRITE_ONLY`               |  This flag specifies that the SVM    buffer will be written but not      read by a kernel.                   Reading from a SVM buffer created   with `CL_MEM_WRITE_ONLY` inside a   kernel is undefined.                `CL_MEM_READ_WRITE` and             `CL_MEM_WRITE_ONLY` are mutually    exclusive.                        |
|  `CL_MEM_READ_ONLY`                |  This flag specifies that the SVM    buffer object is a read-only        memory object when used inside a    kernel.                             Writing to a SVM buffer created     with `CL_MEM_READ_ONLY` inside a    kernel is undefined.                `CL_MEM_READ_WRITE` or              `CL_MEM_WRITE_ONLY` and             `CL_MEM_READ_ONLY` are mutually     exclusive.                        |
|  `CL_MEM_SVM_FINE_GRAIN_BUFFER`    |  This specifies that the             application wants the OpenCL        implementation to do a              fine-grained allocation.          |
|  `CL_MEM_SVM_ATOMICS`              |  This flag is valid only if          `CL_MEM_SVM_FINE_GRAIN_BUFFER` is   specified in `flags`. It is used    to indicate that SVM atomic         operations can control visibility   of memory accesses in this SVM      buffer.                           |

`size`  
The size in bytes of the SVM buffer to be allocated.

`alignment`  
The minimum alignment in bytes that is required for the newly created
buffer’s memory region. It must be a power of two up to the largest data
type supported by the OpenCL device. For the full profile, the largest
data type is `long16`. For the embedded profile, it is `long16` if the
device supports 64-bit integers; otherwise it is `int16`. If alignment
is 0, a default alignment will be used that is equal to the size of
largest data type supported by the OpenCL implementation.

## Notes

If `CL_MEM_SVM_FINE_GRAIN_BUFFER` is not specified, the buffer can be
created as a coarse grained SVM allocation. Similarly, if
`CL_MEM_SVM_ATOMICS` is not specified, the buffer can be created without
support for SVM atomic operations (refer to the OpenCL C++ kernel
language and IL specifications).

Calling `clSVMAlloc` does not itself provide consistency for the shared
memory region. When the host can’t use the SVM atomic operations, it
must rely on OpenCL’s guaranteed memory consistency at synchronization
points.

For SVM to be used efficiently, the host and any devices sharing a
buffer containing virtual memory pointers should have the same
endianness. If the context passed to `clSVMAlloc` has devices with mixed
endianness and the OpenCL implementation is unable to implement SVM
because of that mixed endianness, `clSVMAlloc` will fail and return
NULL.

Although SVM is generally not supported for image objects,
[`clCreateImage`](clCreateImage.html) may create an image from a buffer
(a 1D image from a buffer or a 2D image from buffer) if the buffer
specified in its image description parameter is a SVM buffer. Such
images have a linear memory representation so their memory can be shared
using SVM. However, fine grained sharing and atomics are not supported
for image reads and writes in a kernel.

If [`clCreateBuffer`](clCreateBuffer.html) is called with a pointer
returned by `clSVMAlloc` as its `host_ptr` argument, and
`CL_MEM_USE_HOST_PTR` is set in its `flags` argument,
[`clCreateBuffer`](clCreateBuffer.html) will succeed and return a valid
non-zero buffer object as long as the `size` argument to
[`clCreateBuffer`](clCreateBuffer.html) is no larger than the `size`
argument passed in the original `clSVMAlloc` call. The new buffer object
returned has the shared memory as the underlying storage. Locations in
the buffer’s underlying shared memory can be operated on using atomic
operations to the device’s level of support as defined in the memory
model.

## Errors

Returns a valid non-NULL shared virtual memory address if the SVM buffer
is successfully allocated. Otherwise, like malloc, it returns a NULL
pointer value. `clSVMAlloc` will fail if:

-   `context` is not a valid context.

-   `flags` does not contain `CL_MEM_SVM_FINE_GRAIN_BUFFER` but does
    contain `CL_MEM_SVM_ATOMICS`.

-   Values specified in `flags` do not follow rules described for
    supported values in the table above.

-   `CL_MEM_SVM_FINE_GRAIN_BUFFER` or `CL_MEM_SVM_ATOMICS` is specified
    in `flags` and these are not supported by at least one device in
    `context`.

-   The values specified in `flags` are not valid i.e. don’t match those
    defined in the table above.

-   `size` is 0 or > `CL_DEVICE_MAX_MEM_ALLOC_SIZE` value for any device
    in `context`.

-   `alignment` is not a power of two or the OpenCL implementation
    cannot support the specified alignment for at least one device in
    `context`.

-   There was a failure to allocate resources.

## Also see

[`clSVMFree`](clSVMFree.html), [Shared Virtual Memory
Functions](sharedVirtualMemory.html)

## Specification

[OpenCL 2.1 API Specification, page
175](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=175)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
