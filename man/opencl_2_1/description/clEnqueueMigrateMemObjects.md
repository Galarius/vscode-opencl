
## Parameters

`command_queue`  
A valid host command-queue. The specified set of memory objects in
`mem_objects` will be migrated to the OpenCL device associated with
`command_queue` or to the host if the `CL_MIGRATE_MEM_OBJECT_HOST` has
been specified.

`num_mem_objects`  
The number of memory objects specified in `mem_objects`.

`mem_objects`  
A pointer to a list of memory objects.

`flags`  
A bit-field that is used to specify migration options. The table below
describes the possible values for flags.

| cl\_mem\_migration flags          | Description                       |
| --- | --- |
|  `CL_MIGRATE_MEM_OBJECT_HOST`      |  This flag indicates that the        specified set of memory objects     are to be migrated to the host,     regardless of the target            command-queue.                    |
|  `CL_MIGRAT                          E_MEM_OBJECT_- CONTENT_UNDEFINED` |  This flag indicates that the        contents of the set of memory       objects are undefined after         migration. The specified set of     memory objects are migrated to      the device associated with          `command_queue` without incurring   the overhead of migrating their     contents.                         |

`event_wait_list, num_events_in_wait_list`  
Specify events that need to complete before this particular command can
be executed. If `event_wait_list` is NULL, then this particular command
does not wait on any event to complete. If `event_wait_list` is NULL,
`num_events_in_wait_list` must be 0. If `event_wait_list` is not NULL,
the list of events pointed to by `event_wait_list` must be valid and
`num_events_in_wait_list` must be greater than 0. The events specified
in `event_wait_list` act as synchronization points. The context
associated with events in `event_wait_list` and `command_queue` must be
the same. The memory associated with `event_wait_list` can be reused or
freed after the function returns.

`event`  
Returns an event object that identifies this particular command and can
be used to query or queue a wait for this particular command to
complete. `event` can be NULL in which case it will not be possible for
the application to query the status of this command or queue a wait for
this command to complete. If the `event_wait_list` and the `event`
arguments are not NULL, the `event` argument should not refer to an
element of the `event_wait_list` array.

## Notes

This section describes a mechanism for assigning which device an OpenCL
memory object resides. A user may wish to have more explicit control
over the location of their memory objects on creation. This could be
used to:

-   Ensure that an object is allocated on a specific device prior to
    usage.

-   Preemptively migrate an object from one device to another.

Typically, memory objects are implicitly migrated to a device for which
enqueued commands, using the memory object, are targeted.
`clEnqueueMigrateMemObjects` allows this migration to be explicitly
performed ahead of the dependent commands. This allows a user to
preemptively change the association of a memory object, through regular
command queue scheduling, in order to prepare for another upcoming
command. This also permits an application to overlap the placement of
memory objects with other unrelated operations before these memory
objects are needed potentially hiding transfer latencies. Once the
event, returned from `clEnqueueMigrateMemObjects`, has been marked
`CL_COMPLETE` the memory objects specified in `mem_objects` have been
successfully migrated to the device associated with `command_queue`. The
migrated memory object shall remain resident on the device until another
command is enqueued that either implicitly or explicitly migrates it
away.

`clEnqueueMigrateMemObjects` can also be used to direct the initial
placement of a memory object, after creation, possibly avoiding the
initial overhead of instantiating the object on the first enqueued
command to use it.

The user is responsible for managing the event dependencies, associated
with this command, in order to avoid overlapping access to memory
objects. Improperly specified event dependencies passed to
`clEnqueueMigrateMemObjects` could result in undefined results.

## Errors

`clEnqueueMigrateMemObjects` returns `CL_SUCCESS` if the function is
executed successfully. Otherwise, it returns one of the following
errors:

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command\_queue.

-   `CL_INVALID_CONTEXT` if the context associated with `command_queue`
    and memory objects in `memobj` are not the same or if the context
    associated with `command_queue` and events in `event_wait_list` are
    not the same.

-   `CL_INVALID_MEM_OBJECT` if any of the memory objects in `mem_objs`
    is not a valid memory object.

-   `CL_INVALID_VALUE` if `num_mem_objects` is zero or if `mem_objects`
    is NULL.

-   `CL_INVALID_VALUE` if `flags` is not 0 or is not any of the values
    described in the table above.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for the specified set of memory objects in `mem_objects`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clEnqueueMapBuffer`](clEnqueueMapBuffer.html),
[`clEnqueueMapImage`](clEnqueueMapImage.html)

## Specification

[OpenCL 2.1 API Specification, page
168](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=168)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
