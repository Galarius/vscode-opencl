
## Parameters

`context`  
Must be a valid OpenCL context.

`sampler_properties`  
Specifies a list of sampler property names and their corresponding
values. Each sampler property name is immediately followed by the
corresponding desired value. The list is terminated with 0. The list of
supported properties is described in the table below. If a supported
property and its value is not specified in `sampler_properties`, its
default value will be used. `sampler_properties` can be NULL in which
case the default values for supported sampler properties will be used.

| cl\                  | Property Value       | Description           |
| --- | --- | --- |
|  _sampler\_properties   enum                   `CL_SAMPLE             R_NORMALIZED_COORDS` |  `cl_bool`            |  A boolean value that    specifies whether the   image coordinates       specified are           normalized or not.      The default value       (i.e. the value used    if this property is     not specified in      |
|  `CL_SAMP               LER_ADDRESSING_MODE` |  `cl_addressing_mode` |  `sampler_properties`)   is `CL_TRUE`.           Specifies how           out-of-range image      coordinates are         handled when reading    from an image.          Valid values are:       -   `CL_ADD             RESS_MIRRORED_REPEAT`   -                         `CL_ADDRESS_REPEAT`   -   `CL_A               DDRESS_CLAMP_TO_EDGE`   -                          `CL_ADDRESS_CLAMP`   -   `CL_ADDRESS_NONE` |
|  `CL_                   SAMPLER_FILTER_MODE` |  `cl_filter_mode`     |  The default is          `CL_ADDRESS_CLAMP`.     Specifies the type of   filter that must be     applied when reading    an image. Valid         values are:             -                         `CL_FILTER_NEAREST`   -                          `CL_FILTER_LINEAR` |

If the [`cl_khr_mipmap_image`](cl_khr_mipmap_image.html) extension is
supported, the following sampler properties can be specified when a
sampler object is created using `clCreateSamplerWithProperties`:

| cl\                  | Property Value       | Default Value         |
| --- | --- | --- |
|  _sampler\_properties   enum                 |||
|  `CL_SAMPLER_           MIP_FILTER_MODE_KHR` |  `cl_filter_mode`     |  `C                      L_FILTER_NEAREST_KHR` |
|  `CL_                   SAMPLER_LOD_MIN_KHR` |  `float`              |  `0.0f`                |

If the [`cl_khr_mipmap_image`](cl_khr_mipmap_image.html) extension is
supported, The sampler properties `CL_SAMPLER_MIP_FILTER_MODE_KHR`,
`CL_SAMPLER_LOD_MIN_KHR` and `CL_SAMPLER_LOD_MAX_KHR` cannot be
specified with any samplers initialized in the OpenCL program source.
Only the default values for these properties will be used. To create a
sampler with specific values for these properties, a sampler object must
be created with `clCreateSamplerWithProperties` and passed as an
argument to a kernel.

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Notes

A sampler object describes how to sample an image when the image is read
in the kernel. The built-in functions to read from an image in a kernel
take a sampler as an argument. The sampler arguments to the image read
function can be sampler objects created using OpenCL functions and
passed as argument values to the kernel or can be samplers declared
inside a kernel.

For more information about working with samplers, see
[`sampler_t`](sampler_t.html)

If the [`cl_khr_mipmap_image`](cl_khr_mipmap_image.html) extension is
supported, the sampler properties `CL_SAMPLER_MIP_FILTER_MODE`,
`CL_SAMPLER_LOD_MIN` and `CL_SAMPLER_LOD_MAX` cannot be specified with
any samplers initialized in the OpenCL program source. Only the default
values for these properties will be used. To create a sampler with
specific values for these properties, a sampler object must be created
with `clCreateSamplerWithProperties` and passed as an argument to a
kernel.

## Errors

Returns a valid non-zero sampler object and `errcode_ret` is set to
`CL_SUCCESS` if the sampler object is created successfully. Otherwise,
it returns a NULL value with one of the following error values returned
in `errcode_ret`:

-   `CL_INVALID_CONTEXT` if `context` is not a valid context.

-   `CL_INVALID_VALUE` if the property name in `sampler_properties` is
    not a supported property name, if the value specified for a
    supported property name is not valid, or if the same property name
    is specified more than once.

-   `CL_INVALID_OPERATION` if images are not supported by any device
    associated with `context` (i.e. `CL_DEVICE_IMAGE_SUPPORT` specified
    in the table of OpenCL Device Queries for
    [`clGetDeviceInfo`](clGetDeviceInfo.html) is `CL_FALSE`).

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

[`clRetainSampler`](clRetainSampler.html),
[`clReleaseSampler`](clReleaseSampler.html),
[`clGetSamplerInfo`](clGetSamplerInfo.html)
[`sampler_t`](sampler_t.html),
[`cl_khr_mipmap_image`](cl_khr_mipmap_image.html)

## Specification

[OpenCL 2.1 API Specification, page
190](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=190)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
