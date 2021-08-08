
## Parameters

`device`  
A device returned by [`clGetDeviceIDs`](clGetDeviceIDs.html).

`device_timestamp`  
Will be updated with the value of the current timer in nanoseconds. The
resolution of the timer is the same as the device profiling timer
returned by [`clGetDeviceInfo`](clGetDeviceInfo.html) and the
`CL_DEVICE_PROFILING_TIMER_RESOLUTION` query.

`host_timestamp`  
Will be updated with the value of the current timer in nanoseconds at
the closest possible point in time to that at which `device_timer` was
returned. The resolution of the timer may be queried via
[`clGetPlatformInfo`](clGetPlatformInfo.html) and the flag
`CL_PLATFORM_HOST_TIMER_RESOLUTION`.

## Notes

Returns a reasonably synchronized pair of timestamps from the device
timer and the host timer as seen by `device`. Implementations may need
to execute this query with a high latency in order to provide reasonable
synchronization of the timestamps. The host timestamp and device
timestamp returned by this function and
[`clGetHostTimer`](clGetHostTimer.html) each have an implementation
defined timebase. The timestamps will always be in their respective
timebases regardless of which query function is used. The timestamp
returned from [`clGetEventProfilingInfo`](clGetEventProfilingInfo.html)
for an event on a device and a device timestamp queried from the same
device will always be in the same timebase.

## Errors

`clGetDeviceAndHostTimer` will return `CL_SUCCESS` with a time value in
`host_timestamp` if provided. Otherwise, it returns one of the following
errors:

-   `CL_INVALID_DEVICE` if `device` is not a valid OpenCL device.

-   `CL_INVALID_VALUE` if `host_timestamp` or `device_timestamp` is
    NULL.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clGetHostTimer`](clGetHostTimer.html),
[`clGetDeviceInfo`](clGetDeviceInfo.html),
[`clGetPlatformInfo`](clGetPlatformInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
82](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=82)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
