
## Parameters

`memobj`  
A valid memory object.

`pfn_notify`  
The callback function that can be registered by the application. This
callback function may be called asynchronously by the OpenCL
implementation. It is the application’s responsibility to ensure that
the callback function is thread-safe. The parameters to this callback
function are:

-   `memobj`: the memory object being deleted. When the user callback is
    called by the implementation, this memory object is no longer valid.
    `memobj` is only provided for reference purposes.

-   `user_data`: a pointer to user supplied data.

`user_data`  
Will be passed as the `user_data` argument when `pfn_notify` is called.
`user_data` can be NULL.

## Notes

Each call to `clSetMemObjectDestructorCallback` registers the specified
user callback function on a callback stack associated with `memobj`. The
registered user callback functions are called in the reverse order in
which they were registered. The user callback functions are called and
then the memory object’s resources are freed and the memory object is
deleted. This provides a mechanism for the application (and libraries)
using `memobj` to be notified when the memory referenced by `host_ptr`,
specified when the memory object is created and used as the storage bits
for the memory object, can be reused or freed.

When the user callback function is called by the implementation, the
contents of the memory region pointed to by `host_ptr` (if the memory
object is created with `CL_MEM_USE_HOST_PTR`) are undefined. The
callback function is typically used by the application to either free or
reuse the memory region pointed to by `host_ptr`.

The behavior of calling expensive system routines, OpenCL API calls to
create contexts or command-queues, or blocking OpenCL operations from
the following list below, in a callback is undefined.

-   [`clFinish`](clFinish.html)

-   [`clWaitForEvents`](clWaitForEvents.html)

-   blocking calls to [`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
    [`clEnqueueReadBufferRect`](clEnqueueReadBufferRect.html),
    [`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
    [`clEnqueueWriteBufferRect`](clEnqueueWriteBufferRect.html)

-   blocking calls to [`clEnqueueReadImage`](clEnqueueReadImage.html)
    and [`clEnqueueWriteImage`](clEnqueueWriteImage.html)

-   blocking calls to [`clEnqueueMapBuffer`](clEnqueueMapBuffer.html)
    and [`clEnqueueMapImage`](clEnqueueMapImage.html)

-   blocking calls to [`clBuildProgram`](clBuildProgram.html),
    [`clCompileProgram`](clCompileProgram.html), or
    [`clLinkProgram`](clLinkProgram.html)

If an application needs to wait for completion of a routine from the
above list in a callback, please use the non-blocking form of the
function, and assign a completion callback to it to do the remainder of
your work. Note that when a callback (or other code) enqueues commands
to a command-queue, the commands are not required to begin execution
until the queue is flushed. In standard usage, blocking enqueue calls
serve this role by implicitly flushing the queue. Since blocking calls
are not permitted in callbacks, those callbacks that enqueue commands on
a command queue should either call [`clFlush`](clFlush.html) on the
queue before returning or arrange for [`clFlush`](clFlush.html) to be
called later on another thread.

The user callback function may not call OpenCL APIs with the memory
object for which the callback function is invoked and for such cases the
behavior of OpenCL APIs is considered to be undefined.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_MEM_OBJECT` if `memobj` is not a valid memory object.

-   `CL_INVALID_VALUE` if `pfn_notify` is NULL.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html),
[`clGetCommandQueueInfo`](clGetCommandQueueInfo.html),
[`clReleaseCommandQueue`](clReleaseCommandQueue.html),
[`clRetainCommandQueue`](clRetainCommandQueue.html)

## Specification

[OpenCL 2.1 API Specification, page
164](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=164)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
