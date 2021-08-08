
## Parameters

`event`  
A user event object created using
[`clCreateUserEvent`](clCreateUserEvent.html).

`execution_status`  
Specifies the new execution status to be set and can be `CL_COMPLETE` or
a negative integer value to indicate an error. A negative integer value
causes all enqueued commands that wait on this user event to be
terminated. `clSetUserEventStatus` can only be called once to change the
execution status of `event`.

## Notes

If there are enqueued commands with user events in the `event_wait_list`
argument of `clEnqueue***` commands, the user must ensure that the
status of these user events being waited on are set using
`clSetUserEventStatus` before any OpenCL APIs that release OpenCL
objects except for event objects are called; otherwise the behavior is
undefined.

## Errors

Returns `CL_SUCCESS` if the function was executed successfully.
Otherwise, it returns one of the following errors

-   `CL_INVALID_EVENT` if `event` is not a valid user event.

-   `CL_INVALID_VALUE` if the `execution_status` is not `CL_COMPLETE` or
    a negative integer value.

-   `CL_INVALID_OPERATION` if the `execution_status` for `event` has
    already been changed by a previous call to `clSetUserEventStatus`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Example

For example, the following code sequence will result in undefined
behavior of [`clReleaseMemObject`](clReleaseMemObject.html).

    ev1 = clCreateUserEvent(ctx, NULL);
    clEnqueueWriteBuffer(cq, buf1, CL_FALSE, ..., 1, &ev1, NULL;
    clEnqueueWriteBuffer(cq, buf2, CL_FALSE,...);
    clReleaseMemObject(buf2);
    clSetUserEventStatus(ev1, CL_COMPLETE);

The following code sequence, however, works correctly.

    ev1 = clCreateUserEvent(ctx, NULL);
    clEnqueueWriteBuffer(cq, buf1, CL_FALSE, ..., 1, &ev1, NULL;
    clEnqueueWriteBuffer(cq, buf2, CL_FALSE,...);
    clSetUserEventStatus(ev1, CL_COMPLETE);
    clReleaseMemObject(buf2);

## Also see

[`clCreateUserEvent`](clCreateUserEvent.html)

## Specification

[OpenCL 2.1 API Specification, page
250](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=250)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
