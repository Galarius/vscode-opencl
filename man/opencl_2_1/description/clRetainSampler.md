
## Parameters

`sampler`  
Specifies the `sampler` being retained.

## Notes

[`clCreateSamplerWithProperties`](clCreateSamplerWithProperties.html)
performs an implicit retain.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_SAMPLER` if `sampler` is not a valid sampler object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateSamplerWithProperties`](clCreateSamplerWithProperties.html),
[`clGetSamplerInfo`](clGetSamplerInfo.html),
[`clReleaseSampler`](clReleaseSampler.html)

## Specification

[OpenCL 2.1 API Specification, page
191](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=191)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
