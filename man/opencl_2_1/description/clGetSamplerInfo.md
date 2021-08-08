
## Parameters

`sampler`  
Specifies the sampler being queried.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by
`clGetSamplerInfo` is described in the table below.

| cl\_sampler\_info                 | Return Type and Info. returned in |
| --- | --- |
|  `CL_SAMPLER_REFERENCE_COUNT`      |  `param_value`                       Return type: cl\_uint               Return the `sampler` reference      count. The reference count          returned should be considered       immediately stale. It is            unsuitable for general use in       applications. This feature is       provided for identifying memory   |
|  `CL_SAMPLER_CONTEXT`              |  leaks.                              Return type: cl\_context            Return the context specified when |
|  `CL_SAMPLER_NORMALIZED_COORDS`    |  the sampler is created.             Return type: cl\_bool               Return the normalized coords      |
|  `CL_SAMPLER_ADDRESSING_MODE`      |  value associated with `sampler`.    Return type: cl\_addressing\_mode   Return the addressing mode value  |
|  `CL_SAMPLER_FILTER_MODE`          |  associated with `sampler`.          Return type: cl\_filter\_mode       Return the filter mode value      |

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Specifies the size in bytes of memory pointed to by `param_value`. This
size must be ≥ size of return type as described in the table above.

`param_value_size_ret`  
Returns the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the table above and `param_value` is not NULL

-   `CL_INVALID_SAMPLER` if `sampler` is a not a valid sampler object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clCreateSamplerWithProperties`](clCreateSamplerWithProperties.html),
[`clRetainSampler`](clRetainSampler.html),
[`clReleaseSampler`](clReleaseSampler.html)

## Specification

[OpenCL 2.1 API Specification, page
192](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=192)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
