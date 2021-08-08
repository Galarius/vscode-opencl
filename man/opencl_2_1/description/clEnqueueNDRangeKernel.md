
## Parameters

`command_queue`  
A valid host command-queue. The kernel will be queued for execution on
the device associated with `command_queue`.

`kernel`  
A valid kernel object. The OpenCL context associated with `kernel` and
`command_queue` must be the same.

`work_dim`  
The number of dimensions used to specify the global work-items and
work-items in the work-group. `work_dim` must be greater than zero and
less than or equal to `CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS`. If
`global_work_size` is NULL, or the value in any passed dimension is 0
then the kernel command will trivially succeed after its event
dependencies are satisfied and subsequently update its completion event.
The behavior in this situation is similar to that of an enqueued marker,
except that unlike a marker, an enqueued kernel with no events passed to
`event_wait_list` may run at any time.

`global_work_offset`  
`global_work_offset` can be used to specify an array of `work_dim`
unsigned values that describe the offset used to calculate the global ID
of a work-item. If `global_work_offset` is NULL, the global IDs start at
offset (0, 0, …​ 0).

`global_work_size`  
Points to an array of `work_dim` unsigned values that describe the
number of global work-items in `work_dim` dimensions that will execute
the kernel function. The total number of global work-items is computed
as `global_work_size`\[0\] **…​** `global_work_size`\[`work_dim` - 1\].

`local_work_size`  
Points to an array of `work_dim` unsigned values that describe the
number of work-items that make up a work-group (also referred to as the
size of the work-group) that will execute the kernel specified by
`kernel`. The total number of work-items in a work-group is computed as
`local_work_size`\[0\] \*…​ \* `local_work_size`\[`work_dim` - 1\]. The
total number of work-items in the work-group must be less than or equal
to the `CL_KERNEL_WORK_GROUP_SIZE` value specified in table of OpenCL
Device Queries for [`clGetDeviceInfo`](clGetDeviceInfo.html) and the
number of work-items specified in `local_work_size`\[0\],…​
`local_work_size`\[`work_dim` - 1\] must be less than or equal to the
corresponding values specified by
`CL_DEVICE_MAX_WORK_ITEM_SIZES`\[0\],…​.
`CL_DEVICE_MAX_WORK_ITEM_SIZES`\[`work_dim` - 1\]. The explicitly
specified `local_work_size` will be used to determine how to break the
global work-items specified by `global_work_size` into appropriate
work-group instances.

Enabling non-uniform work-groups requires a kernel to be compiled with
the -cl-std=CL2.0 flag and without the -cl-uniform-work-group-size flag.
If the program was created using clLinkProgram and any of the linked
programs were compiled in a way that only supports uniform work-group
sizes, the linked program only supports uniform work group sizes. If
local\_work\_size is specified and the OpenCL kernel is compiled without
non-uniform work- groups enabled, the values specified in
global\_work\_size\[0\], …​ global\_work\_size\[work\_dim - 1\] must be
evenly divisible by the corresponding values specified in local\_work\_
size\[0\], …​ local\_work\_size\[work\_dim – 1\].

If non-uniform work-groups are enabled for the kernel, any single
dimension for which the global size is not divisible by the local size
will be partitioned into two regions. One region will have work-groups
that have the same number of work items as was specified by the local
size parameter in that dimension. The other region will have work-groups
with less than the number of work items specified by the local size
parameter in that dimension. The global IDs and group IDs of the work
items in the first region will be numerically lower than those in the
second, and the second region will be at most one work-group wide in
that dimension. Work-group sizes could be non-uniform in multiple
dimensions, potentially producing work-groups of up to 4 different sizes
in a 2D range and 8 different sizes in a 3D range.

If `local_work_size` is NULL and the kernel is compiled without support
for non-uniform work- groups, the OpenCL runtime will implement the
ND-range with uniform work-group sizes. If `local_work_size` is NULL and
non-uniform-work-groups are enabled, the OpenCL runtime is free to
implement the ND-range using uniform or non-uniform work-group sizes,
regardless of the divisibility of the global work size. If the ND-range
is implemented using non-uniform work-group sizes, the work-group sizes,
global IDs and group IDs will follow the same pattern as described in
above paragraph.

The work-group size to be used for `kernel` can also be specified in the
program source or intermediate language. In this case the size of work
group specified by `local_work_size` must match the value specified in
the program source.

These work-group instances are executed in parallel across multiple
compute units or concurrently on the same compute unit.

Each work-item is uniquely identified by a global identifier. The global
ID, which can be read inside the kernel, is computed using the value
given by `global_work_size` and `global_work_offset`. In addition, a
work-item is also identified within a work-group by a unique local ID.
The local ID, which can also be read by the kernel, is computed using
the value given by `local_work_size`. The starting local ID is always
(0, 0, …​ 0).

`event_wait_list` and `num_events_in_wait_list`  
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
Returns an event object that identifies this particular kernel-instance.
Event objects are unique and can be used to identify a particular kernel
execution instance later on. If `event` is NULL, no event will be
created for this kernel execution instance and therefore it will not be
possible for the application to query or queue a wait for this
particular kernel execution instance. If the `event_wait_list` and the
`event` arguments are not NULL, the `event` argument should not refer to
an element of the `event_wait_list` array.

## Errors

Returns `CL_SUCCESS` if the kernel execution was successfully queued.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_PROGRAM_EXECUTABLE` if there is no successfully built
    program executable available for device associated with
    `command_queue`.

-   `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid host
    command-queue.

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

-   `CL_INVALID_CONTEXT` if context associated with `command_queue` and
    `kernel` are not the same or if the context associated with
    `command_queue` and events in `event_wait_list` are not the same.

-   `CL_INVALID_KERNEL_ARGS` if the kernel argument values have not been
    specified or if a kernel argument declared to be a pointer to a type
    does not point to a named address space.

-   `CL_INVALID_WORK_DIMENSION` if `work_dim` is not a valid value (i.e.
    a value between 1 and 3).

-   `CL_INVALID_GLOBAL_WORK_SIZE` if any of the values specified in
    `global_work_size`\[0\], …​`global_work_size` \[`work_dim` - 1\]
    exceed the range given by the `sizeof(size_t)` for the device on
    which the kernel execution will be enqueued.

-   `CL_INVALID_GLOBAL_OFFSET` if the value specified in
    `global_work_size` + the corresponding values in
    `global_work_offset` for any dimensions is greater than the
    `sizeof(size_t)` for the device on which the kernel execution will
    be enqueued.

-   `CL_INVALID_WORK_GROUP_SIZE` if `local_work_size` is specified and
    does not match the required work-group size for `kernel` in the
    program source.

-   `CL_INVALID_WORK_GROUP_SIZE` if `local_work_size` is specified and
    is not consistent with the required number of sub-groups for
    `kernel` in the program source.

-   `CL_INVALID_WORK_GROUP_SIZE` if `local_work_size` is specified and
    the total number of work-items in the work-group computed as
    `local_work_size`\[0\] \* …​ `local_work_size`\[`work_dim` – 1\] is
    greater than the value specified by `CL_KERNEL_WORK_GROUP_SIZE` in
    table 5.21.

-   `CL_INVALID_WORK_GROUP_SIZE` if the program was compiled with
    `–cl-uniform-work-group-size` and the number of work-items specified
    by `global_work_size` is not evenly divisible by size of work-group
    given by `local_work_size` or by the required work- group size
    specified in the kernel source.

-   `CL_INVALID_WORK_ITEM_SIZE` if the number of work-items specified in
    any of `local_work_size`\[0\], …​ `local_work_size`\[`work_dim` -
    1\] is greater than the corresponding values specified by
    `CL_DEVICE_MAX_WORK_ITEM_SIZES`\[0\], …​.
    `CL_DEVICE_MAX_WORK_ITEM_SIZES`\[`work_dim` - 1\].

-   `CL_MISALIGNED_SUB_BUFFER_OFFSET` if a sub-buffer object is
    specified as the value for an argument that is a buffer object and
    the `offset` specified when the sub-buffer object is created is not
    aligned to `CL_DEVICE_MEM_BASE_ADDR_ALIGN` value for device
    associated with `queue`.

-   `CL_INVALID_IMAGE_SIZE` if an image object is specified as an
    argument value and the image dimensions (image width, height,
    specified or compute row and/or slice pitch) are not supported by
    device associated with `queue`.

-   `CL_IMAGE_FORMAT_NOT_SUPPORTED` if an image object is specified as
    an argument value and the image format (image channel order and data
    type) is not supported by device associated with `queue`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to queue the execution
    instance of `kernel` on the command-queue because of insufficient
    resources needed to execute the kernel. For example, the explicitly
    specified `local_work_size` causes a failure to execute the kernel
    because of insufficient resources such as registers or local memory.
    Another example would be the number of read-only image args used in
    `kernel` exceed the `CL_DEVICE_MAX_READ_IMAGE_ARGS` value for device
    or the number of write-only image args used in `kernel` exceed the
    `CL_DEVICE_MAX_READ_WRITE_IMAGE_ARGS` value for device or the number
    of samplers used in `kernel` exceed `CL_DEVICE_MAX_SAMPLERS` for
    device.

-   `CL_MEM_OBJECT_ALLOCATION_FAILURE` if there is a failure to allocate
    memory for data store associated with image or buffer objects
    specified as arguments to `kernel`.

-   `CL_INVALID_EVENT_WAIT_LIST` if `event_wait_list` is NULL and
    `num_events_in_wait_list` > 0, or `event_wait_list` is not NULL and
    `num_events_in_wait_list` is 0, or if event objects in
    `event_wait_list` are not valid events.

-   `CL_INVALID_OPERATION` if SVM pointers are passed as arguments to a
    kernel and the device does not support SVM or if system pointers are
    passed as arguments to a kernel and/or stored inside SVM allocations
    passed as kernel arguments and the device does not support fine
    grain system SVM allocations.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html),
[`clGetDeviceInfo`](clGetDeviceInfo.html),
[`clEnqueueNativeKernel`](clEnqueueNativeKernel.html), [Work-Item
Functions](workItemFunctions.html)

## Specification

[OpenCL 2.1 API Specification, page
242](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=242)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
