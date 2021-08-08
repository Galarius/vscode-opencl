
## Description

Returns true if `event` is a valid event. Otherwise returns false.

## Notes

General information about event functions

Events can be used to identify commands enqueued to a command-queue from
the host. These events created by the OpenCL runtime can only be used on
the host i.e. as events passed in `event_wait_list` argument to various
clEnqueue APIs or runtime APIs that take events as arguments such as
[`clRetainEvent`](clRetainEvent.html),
[`clReleaseEvent`](clReleaseEvent.html),
[`clGetEventProfilingInfo`](clGetEventProfilingInfo.html).

Similarly, events can be used to identify commands enqueued to a device
queue (from a kernel). These event objects cannot be passed to the host
or used by OpenCL runtime APIs such as the clEnqueueAPIs or runtime APIs
that take event arguments.

[`clRetainEvent`](clRetainEvent.html) and
[`clReleaseEvent`](clReleaseEvent.html) will return
`CL_INVALID_OPERATION` if `event` specified is an event that refers to
any kernel enqueued to a device queue using
[`enqueue_kernel`](enqueue_kernel.html) or
[`enqueue_marker`](enqueue_marker.html) or is a user event created by
[`create_user_event`](create_user_event.html).

Similarly, [`clSetUserEventStatus`](clSetUserEventStatus.html) can only
be used to set the execution status of events created using
[`clCreateUserEvent`](clCreateUserEvent.html). User events created on
the device can be set using
[`set_user_event_status`](set_user_event_status.html) built-in function.

## Example

The example below shows how events can be used with kernels enqueued to
multiple device queues.

    extern void barA_kernel(...);
    extern void barB_kernel(...);

    kernel void
    foo(queue_t q0, queue q1, ...)
    {
        ...
        clk_event_t evt0;

        // enqueue kernel to queue q0
        enqueue_kernel(q0,
                       CLK_ENQUEUE_FLAGS_NO_WAIT,
                       ndrange_A,
                       0, NULL, &evt0,
                       ^{barA_kernel(...);} );

        // enqueue kernel to queue q1
        enqueue_kernel(q1,
                       CLK_ENQUEUE_FLAGS_NO_WAIT,
                       ndrange_B,
                       1, &evt0, NULL,
                       ^{barB_kernel(...);} );

        // release event evt0. This will get released
        // after barA_kernel enqueued in queue q0 has finished
        // execution and barB_kernel enqueued in queue q1 and
        // waits for evt0 is submitted for execution i.e. wait
        // for evt0 is satisfied.
        release_event(evt0);
    }

The example below shows how the marker command can be used with kernels
enqueued to a device queue.

    kernel void
    foo(queue_t q, ...)
    {
        ...
        clk_event_t marker_event;
        clk_event_t events[2];

        enqueue_kernel(q,
                      CLK_ENQUEUE_FLAGS_NO_WAIT,
                      ndrange,
                      0, NULL, &events[0],
                      ^{barA_kernel(...);} );

        enqueue_kernel(q,
                      CLK_ENQUEUE_FLAGS_NO_WAIT,
                      ndrange,
                      0, NULL, &events[1],
                      ^{barB_kernel(...);} );

        // barA_kernel and barB_kernel can be executed
        // out of order. we need to wait for both these
        // kernels to finish execution before barC_kernel
        // starts execution so we enqueue a marker command and
        // then enqueue barC_kernel that waits on the event
        // associated with the marker.

        enqueue_marker(q, 2, events, &marker_event);

        enqueue_kernel(q,
                       CLK_ENQUEUE_FLAGS_NO_WAIT,
                       1, &marker_event, NULL,
                       ^{barC_kernel(...);} );

        release_event(events[0];
        release_event(events[1]);
        release_event(marker_event);
    }

## Also see

[Event Functions](eventFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
171](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=171)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
