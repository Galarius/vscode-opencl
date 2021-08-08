
## Parameters

`event`  
A valid event object.

`command_exec_callback_type`  
Specifies the command execution status for which the callback is
registered. The command execution callback values for which a callback
can be registered are `CL_SUBMITTED`, `CL_RUNNING`, or `CL_COMPLETE`.
There is no guarantee that the callback functions registered for various
execution status values for an event will be called in the exact order
that the execution status of a command changes. Furthermore, it should
be noted that receiving a call back for an event with a status other
than `CL_COMPLETE`, in no way implies that the memory model or execution
model as defined by the OpenCL specification has changed. For example,
it is not valid to assume that a corresponding memory transfer has
completed unless the event is in a state `CL_COMPLETE`.

The callback function registered for a `command_exec_callback_type`
value of `CL_COMPLETE` will be called when the command has completed
successfully or is abnormally terminated.

`pfn_event_notify`  
The event callback function that can be registered by the application.
This callback function may be called asynchronously by the OpenCL
implementation. It is the application’s responsibility to ensure that
the callback function is thread-safe. The parameters to this callback
function are:

-   `event` is the event object for which the callback function is
    invoked.

-   `event_command_exec_status` represents the execution status of
    command for which this callback function is invoked. See the table
    of values for `param_value` for
    [`clGetEventInfo`](clGetEventInfo.html) for the command execution
    status values. If the callback is called as the result of the
    command associated with event being abnormally terminated, an
    appropriate error code for the error that caused the termination
    will be passed to `event_command_exec_status` instead.

-   `user_data` is a pointer to user supplied data.

`user_data`  
Will be passed as the `user_data` argument when `pfn_notify` is called.
`user_data` can be NULL.

## Notes

The registered callback function will be called when the execution
status of command associated with `event` changes to an execution status
equal to or past the status specified by `command_exec_status`.

Each call to `clSetEventCallback` registers the specified user callback
function on a callback stack associated with `event`. The order in which
the registered user callback functions are called is undefined.

All callbacks registered for an event object must be called. All
enqueued callbacks shall be called before the event object is destroyed.
Callbacks must return promptly. The behavior of calling expensive system
routines, OpenCL API calls to create contexts or command-queues, or
blocking OpenCL operations from the following list below, in a callback
is undefined.

-   [`clFinish`](clFinish.html)

-   [`clWaitForEvents`](clWaitForEvents.html)

-   blocking calls to [`clEnqueueReadBuffer`](clEnqueueReadBuffer.html),
    [`clEnqueueReadBufferRect`](clEnqueueReadBufferRect.html),
    [`clEnqueueWriteBuffer`](clEnqueueWriteBuffer.html), and
    [`clEnqueueWriteBufferRect`](clEnqueueWriteBufferRect.html)

-   blocking calls to [`clEnqueueReadImage`](clEnqueueReadImage.html)
    and [`clEnqueueWriteImage`](clEnqueueWriteImage.html)

-   blocking calls to [`clEnqueueMapBuffer`](clEnqueueMapBuffer.html)
    and [`clEnqueueMapImage`](clEnqueueMapImage.html)

-   blocking calls to [`clBuildProgram`](clBuildProgram.html),
    [`clCompileProgram`](clCompileProgram.html), or
    [`clLinkProgram`](clLinkProgram.html).

-   blocking calls to [`clEnqueueSVMMemcpy`](clEnqueueSVMMemcpy.html),
    or [`clEnqueueSVMMap`](clEnqueueSVMMap.html).

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

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_EVENT` if `event` is not a valid event object.

-   `CL_INVALID_VALUE` if `pfn_event_notify` is NULL or if
    `command_exec_callback_type` is not `CL_SUBMITTED`, `CL_RUNNING` or
    `CL_COMPLETE`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Specification

[OpenCL 2.1 API Specification, page
255](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=255)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
