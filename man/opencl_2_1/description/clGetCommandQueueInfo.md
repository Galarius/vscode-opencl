
## Parameters

`command_queue`  
Specifies the command-queue being queried.

`param_name`  
Specifies the information to query.

`param_value_size`  
Specifies the size in bytes of memory pointed to by `param_value`. This
size must be ≥ size of return type as described in the table below. If
`param_value` is NULL, it is ignored.

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size_ret`  
Returns the actual size in bytes of data being queried by `param_value`.
If `param_value_size_ret` is NULL, it is ignored.

  
The list of supported `param_name` values and the information returned
in `param_value` by `clGetCommandQueueInfo` is described in the table
below.

| cl\_command\_queue\_info          | Return Type and Information       |
| --- | --- |
|  `CL_QUEUE_CONTEXT`                |  returned in param\_value            Return type: `cl_context`           Return the context specified when |
|  `CL_QUEUE_DEVICE`                 |  the command-queue is created.       Return type: `cl_device_id`         Return the device specified when  |
|  `CL_QUEUE_REFERENCE_COUNT`        |  the command-queue is created.       Return type: `cl_uint`              Return the command-queue            reference count.                    The reference count returned with   `CL_QUEUE_REFERENCE_COUNT` should   be considered immediately stale.    It is unsuitable for general use    in applications. This feature is    provided for identifying memory   |
|  `CL_QUEUE_PROPERTIES`             |  leaks.                              Return type:                        `cl_command_queue_properties`       Return the currently specified      properties for the command-queue.   These properties are specified by   the value associated with the       `CL_COMMAND_QUEUE_PROPERTIES`       passed in `properties` argument     in                                  [`clCreateComm                      andQueueWithProperties`](clCreate |
|  `CL_QUEUE_SIZE`                   |  CommandQueueWithProperties.html).   Return type: `cl_uint`              Return the currently specified      size for the device                 command-queue. This query is only   supported for device command      |
|  `CL_QUEUE_DEVICE_DEFAULT`         |  queues.                             Return type: `cl_command_queue`     Return the current default          command queue for the underlying  |

## Notes

It is possible that a device(s) becomes unavailable after a context and
command-queues that use this device(s) have been created and commands
have been queued to command-queues. In this case the behavior of OpenCL
API calls that use this context (and command-queues) are considered to
be implementation-defined. The user callback function, if specified,
when the context is created can be used to record appropriate
information in the `errinfo`, `private_info` arguments passed to the
callback function when the device becomes unavailable.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   Returns `CL_INVALID_COMMAND_QUEUE` if `command_queue` is not a valid
    command-queue.

-   Returns `CL_INVALID_VALUE` if `param_name` is not one of the
    supported values or if size in bytes specified by `param_value_size`
    is less than size of return type and `param_value` is not a NULL
    value.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateCommandQueueWithProperties`](clCreateCommandQueueWithProperties.html),
[`clReleaseCommandQueue`](clReleaseCommandQueue.html),
[`clRetainCommandQueue`](clRetainCommandQueue.html)

## Specification

[OpenCL 2.1 API Specification, page
101](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=101)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
