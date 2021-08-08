
## Parameters

`image`  
Specifies the image object being queried.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by `clGetImageInfo`
is described in the table below (Table 5.9).

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Used to specify the size in bytes of memory pointed to by `param_value`.
This size must be ≥ size of return type as described in the table below
(Table 5.9).

| cl\_image\_info      | Return Type          | Info. returned in     |
| --- | --- | --- |
|  `CL_IMAGE_FORMAT`    |  cl\_image\_format    |  `param_value`           Return image format     descriptor specified    when `image` is         created with            [`clCreateImage`]     |
|  `CL                    _IMAGE_ELEMENT_SIZE` |  size\_t              |  (clCreateImage.html).   Return size of each     element of the image    memory object given     by `image` in bytes.    An element is made up   of `n` channels. The    value of `n` is given   in                      [`cl_image_format`](    cl_image_format.html) |
|  `CL_IMAGE_ROW_PITCH` |  size\_t              |  descriptor.             Return calculated row   pitch in bytes of a     row of elements of      the image object      |
|  `C                     L_IMAGE_SLICE_PITCH` |  size\_t              |  given by `image`.       Return calculated       slice pitch in bytes    of a 2D slice for the   3D image object or      size of each image in   a 1D or 2D image        array given by          `image`. For a 1D       image, 1D image         buffer and 2D image   |
|  `CL_IMAGE_WIDTH`     |  size\_t              |  object return 0.        Return width of image |
|  `CL_IMAGE_HEIGHT`    |  size\_t              |  in pixels.              Return height of        image in pixels. For    a 1D image, 1D image    buffer and 1D image     array object, height  |
|  `CL_IMAGE_DEPTH`     |  size\_t              |  = 0.                    Return depth of the     image in pixels. For    a 1D image, 1D image    buffer, 2D image or     1D and 2D image array |
|  `                      CL_IMAGE_ARRAY_SIZE` |  size\_t              |  object, depth = 0.      Return number of        images in the image     array. If `image` is    not an image array, 0 |
|  `CL_I                  MAGE_NUM_MIP_LEVELS` |  cl\_uint             |  is returned.            Return                  num\_mip\_levels        associated with       |
|  `C                     L_IMAGE_NUM_SAMPLES` |  cl\_uint             |  `image`.                Return num\_samples     associated with       |
|  `CL_IMAGE_D3           D10_SUBRESOURCE_KHR` |  ID3D10Resource \*    |  `image`.                (if the                 [`cl_khr_               d3d10_sharing`](cl_kh   r_d3d10_sharing.html)   extension is enabled)   If `image` was          created using           [`clCr                  eateFromD3D10Texture2   DKHR`](clCreateFromD3   D10Texture2DKHR.html)   or                      [`clCre                 ateFromD3D10Texture3D   KHR`](clCreateFromD3D   10Texture3DKHR.html),   returns the             `subresource`           argument specified      when `image` was      |
|  `CL_IMAGE_             DX9_MEDIA_PLANE_KHR` |  cl\_uint             |  created.                Returns the `plane`     argument value          specified when          `memobj` is created     using                   [`clCreat               eFromDX9MediaSurfaceK   HR`](clCreateFromDX9M   ediaSurfaceKHR.html).   (If the                 [`cl_khr_dx9_medi       a_sharing`](cl_khr_dx   9_media_sharing.html)   extension is          |
|  `CL_IMAGE_D3D1         1_- SUBRESOURCE_KHR` |  ID3D11Resource \*    |  supported)              If the                  [`cl_khr_               d3d11_sharing`](cl_kh   r_d3d11_sharing.html)   extension is            suported, If `image`    was created using       [`clCre                 ateFromD3D11Texture2D   KHR`](clCreateFromD3D   11Texture2DKHR.html),   or                      [`clCre                 ateFromD3D11Texture3D   KHR`](clCreateFromD3D   11Texture3DKHR.html),   returns the             `subresource`           argument specified      when `image` was      |
|  `CL_IMAGE_D3D1         1_- SUBRESOURCE_KHR` |  UINT                 |  created.                If the                  [`cl_khr_               d3d11_sharing`](cl_kh   r_d3d11_sharing.html)   extension is            suported, If `image`    was created using       [`clCre                 ateFromD3D11Texture2D   KHR`](clCreateFromD3D   11Texture2DKHR.html),   or                      [`clCre                 ateFromD3D11Texture3D   KHR`](clCreateFromD3D   11Texture3DKHR.html),   returns the             `subresource`           argument specified      when `image` was      |
|  `CL_IMAGE_D3D1         1_- SUBRESOURCE_KHR` |  UINT                 |  created.                If the                  [`cl_khr_               d3d11_sharing`](cl_kh   r_d3d11_sharing.html)   extension is            suported, If `image`    was created using       [`clCre                 ateFromD3D11Texture2D   KHR`](clCreateFromD3D   11Texture2DKHR.html),   or                      [`clCre                 ateFromD3D11Texture3D   KHR`](clCreateFromD3D   11Texture3DKHR.html),   returns the             `subresource`           argument specified      when `image` was      |

`param_value_size_ret`  
Returns the actual size in bytes of data being queried by `param_value`.
If `param_value_size_ret` is NULL, it is ignored.

## Notes

To get information that is common to all memory objects, use the
[`clGetMemObjectInfo`](clGetMemObjectInfo.html) function.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the table above and `param_value` is not NULL.

-   `CL_INVALID_MEM_OBJECT` if `image` is a not a valid image object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

-   `CL_INVALID_DX9_MEDIA_SURFACE_KHR` if `param_name` is
    `CL_IMAGE_DX9_MEDIA_PLANE_KHR` and `image` was not created by the
    function
    [`clCreateFromDX9MediaSurfaceKHR`](clCreateFromDX9MediaSurfaceKHR.html).
    (If the [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
    extension is supported)

-   `CL_INVALID_D3D10_RESOURCE_KHR` if `param_name` is
    `CL_MEM_D3D10_SUBRESOURCE_KHR` and `image` was not created by the
    function
    [`clCreateFromD3D10Texture2DKHR`](clCreateFromD3D10Texture2DKHR.html)
    or
    [`clCreateFromD3D10Texture3DKHR`](clCreateFromD3D10Texture3DKHR.html).
    (If the [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html)
    extension is supported)

-   `CL_INVALID_D3D11_RESOURCE_KHR` if `param_name` is
    `CL_MEM_D3D11_SUBRESOURCE_KHR` and `image` was not created by the
    function
    [`clCreateFromD3D11Texture2DKHR`](clCreateFromD3D11Texture2DKHR.html)
    or
    [`clCreateFromD3D11Texture3DKHR`](clCreateFromD3D11Texture3DKHR.html).
    (If the [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html)
    extension is supported)

## Also see

[`clGetMemObjectInfo`](clGetMemObjectInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
157](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=157)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
