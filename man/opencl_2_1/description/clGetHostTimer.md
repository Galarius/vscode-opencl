
## Parameters

`device`  
A device returned by [`clGetDeviceIDs`](clGetDeviceIDs.html).

`host_timestamp`  
Will be updated with the value of the current timer in nanoseconds. The
resolution of the timer may be queried via
[`clGetPlatformInfo`](clGetPlatformInfo.html) and the flag
`CL_PLATFORM_HOST_TIMER_RESOLUTION`.

## Notes

Return the current value of the host clock as seen by `device`. This
value is in the same timebase as the host\_timestamp returned from
[`clGetDeviceAndHostTimer`](clGetDeviceAndHostTimer.html). The
implementation will return with as low a latency as possible to allow a
correlation with a subsequent application sampled time. The host
timestamp and device timestamp returned by this function and
[`clGetDeviceAndHostTimer`](clGetDeviceAndHostTimer.html) each have an
implementation defined timebase. The timestamps will always be in their
respective timebases regardless of which query function is used. The
timestamp returned from
[`clGetEventProfilingInfo`](clGetEventProfilingInfo.html) for an event
on a device and a device timestamp queried from the same device will
always be in the same timebase.

## Errors

`clGetHostTimer` will return `CL_SUCCESS` with a time value in
`host_timestamp` if provided. Otherwise, it returns one of the following
errors:

-   `CL_INVALID_DEVICE` if `device` is not a valid OpenCL device.

-   `CL_INVALID_VALUE` if `host_timestamp` is NULL.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetDeviceAndHostTimer`](clGetDeviceAndHostTimer.html),
[`clGetPlatformInfo`](clGetPlatformInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
83](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=83)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
