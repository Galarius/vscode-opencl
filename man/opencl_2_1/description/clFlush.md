
## Notes

Issues all previously queued OpenCL commands in `command_queue` to the
device associated with `command_queue`.

`clFlush` only guarantees that all queued commands to `command_queue`
will eventually be submitted to the appropriate device There is no
guarantee that they will be complete after `clFlush` returns.

Any blocking commands queued in a command-queue and
[`clReleaseCommandQueue`](clReleaseCommandQueue.html) perform an
implicit flush of the command-queue. These blocking commands are
[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
[`clEnqueueReadBufferRect`](clEnqueueReadBufferRect.html),
[`clEnqueueReadImage`](clEnqueueReadImage.html), with `blocking_read`
set to `CL_TRUE`; [`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html),
[`clEnqueueWriteBufferRect`](clEnqueueWriteBufferRect.html),
[`clEnqueueWriteImage`](clEnqueueWriteImage.html) with `blocking_write`
set to `CL_TRUE`; [`clEnqueueMapBuffer`](clEnqueueMapBuffer.html),
[`clEnqueueMapImage`](clEnqueueMapImage.html) with `blocking_map` set to
`CL_TRUE`; [`clEnqueueSVMMemcpy`](clEnqueueSVMMemcpy.html) with
`blocking_copy` set to `CL_TRUE`;
[`clEnqueueSVMMap`](clEnqueueSVMMap.html) with `blocking_map` set to
`CL_TRUE` or [`clWaitForEvents`](clWaitForEvents.html).

To use event objects that refer to commands enqueued in a command-queue
as event objects to wait on by commands enqueued in a different
command-queue, the application must call a `clFlush` or any blocking
commands that perform an implicit flush of the command-queue where the
commands that refer to these event objects are enqueued.

## Errors

Returns `CL_SUCCESS` if the function call was executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clFinish`](clFinish.html)

## Specification

[OpenCL 2.1 API Specification, page
266](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=266)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
