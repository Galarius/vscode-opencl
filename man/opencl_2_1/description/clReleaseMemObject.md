
## Notes

After the `memobj` reference count becomes zero and commands queued for
execution on a command-queue(s) that use `memobj` have finished, the
memory object is deleted. If `memobj` is a buffer object, `memobj`
cannot be deleted until all sub-buffer objects associated with `memobj`
are deleted. Using this function to release a reference that was not
obtained by creating the object or by calling
[`clRetainMemObject`](clRetainMemObject.html) causes undefined behavior.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_MEM_OBJECT` if `memobj` is a not a valid memory object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateBuffer`](clCreateBuffer.html),
[`clEnqueueCopyBuffer`](clEnqueueCopyBuffer.html),
[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clRetainMemObject`](clRetainMemObject.html)

## Specification

[OpenCL 2.1 API Specification, page
163](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=163)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
