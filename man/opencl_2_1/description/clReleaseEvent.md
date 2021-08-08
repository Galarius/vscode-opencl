
## Parameters

`event`  
Event object being released.

## Notes

Decrements the `event` reference count.

The event object is deleted once the reference count becomes zero, the
specific command identified by this event has completed (or terminated)
and there are no commands in the command-queues of a context that
require a wait for this event to complete. Using this function to
release a reference that was not obtained by creating the object or by
calling [`clRetainEvent`](clRetainEvent.html) causes undefined behavior.

Developers should be careful when releasing their last reference count
on events created by [`clCreateUserEvent`](clCreateUserEvent.html) that
have not yet been set to status of `CL_COMPLETE` or an error. If the
user event was used in the `event_wait_list` argument passed to a
`clEnqueue***` API or another application host thread is waiting for it
in [`clWaitForEvents`](clWaitForEvents.html), those commands and host
threads will continue to wait for the event status to reach
`CL_COMPLETE` or error, even after the user has released the object.
Since in this scenario the developer has released his last reference
count to the user event, it would be in principle no longer valid for
him to change the status of the event to unblock all the other
machinery. As a result the waiting tasks will wait forever, and
associated events, `cl_mem` objects, command queues and contexts are
likely to leak. In-order command queues caught up in this deadlock may
cease to do any work.

## Errors

Returns `CL_SUCCESS` if the function executed successfully. Otherwise,
it returns one of the following errors:

-   `CL_INVALID_EVENT` if `event` is not a valid event object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetEventInfo`](clGetEventInfo.html),
[`clRetainEvent`](clRetainEvent.html),
[`clWaitForEvents`](clWaitForEvents.html)

## Specification

[OpenCL 2.1 API Specification, page
257](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=257)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
