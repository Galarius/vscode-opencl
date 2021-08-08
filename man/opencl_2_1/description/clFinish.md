
## Notes

Blocks until all previously queued OpenCL commands in `command_queue`
are issued to the associated device and have completed.

`clFinish` does not return until all previously queued commands in
`command_queue` have been processed and completed. `clFinish` is also a
synchronization point.

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

[`clFlush`](clFlush.html)

## Specification

[OpenCL 2.1 API Specification, page
266](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=266)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
