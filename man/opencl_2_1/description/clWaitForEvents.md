
## Parameters

`event_list`  
== Notes

Waits on the host thread for commands identified by event objects in
`event_list` to complete. A command is considered complete if its
execution status is `CL_COMPLETE` or a negative value. The events
specified in `event_list` act as synchronization points.

If the [`cl_khr_gl_event`](cl_khr_gl_event.html) extension is enabled,
event objects can also be used to reflect the status of an OpenGL sync
object. The sync object in turn refers to a fence command executing in
an OpenGL command stream. This provides another method of coordinating
sharing of buffers and images between OpenGL and OpenCL.

If the [`cl_khr_egl_event`](cl_khr_egl_event.html) extension is enabled,
Event objects can also be used to reflect the status of an EGL fence
sync object. The sync object in turn refers to a fence command executing
in an EGL client API command stream. This provides another method of
coordinating sharing of EGL / EGL client API objects with OpenCL.
Completion of EGL / EGL client API commands may be determined by placing
an EGL fence command after commands using `eglCreateSyncKHR`, creating
an event from the resulting EGL sync object using
[`clCreateEventFromEGLSyncKHR`](clCreateEventFromEGLSyncKHR.html) and
then specifying it in the `event_wait_list` of a `clEnqueueAcquire***`
command. This method may be considerably more efficient than calling
operations like `glFinish`, and is referred to as *explicit
synchronization*. The application is responsible for ensuring the
command stream associated with the EGL fence is flushed to ensure the CL
queue is submitted to the device. Explicit synchronization is most
useful when an EGL client API context bound to another thread is
accessing the memory objects."

## Errors

Returns `CL_SUCCESS` if the execution status of all events in
`event_list` is `CL_COMPLETE`. Otherwise, it returns one of the
following errors:

-   `CL_INVALID_VALUE` if `num_events` is zero or `event_list` is NULL..

-   `CL_INVALID_CONTEXT` if events specified in `event_list` do not
    belong to the same context.

-   `CL_INVALID_EVENT` if event objects specified in `event_list` are
    not valid event objects.

-   `CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST` if the execution
    status of any of the events in `event_list` is a negative integer
    value.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetEventInfo`](clGetEventInfo.html),
[`clReleaseEvent`](clReleaseEvent.html),
[`clRetainEvent`](clRetainEvent.html),
[`cl_khr_gl_event`](cl_khr_gl_event.html),
[`cl_khr_egl_event`](cl_khr_egl_event.html)

## Specification

[OpenCL 2.1 API Specification, page
251](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=251)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
