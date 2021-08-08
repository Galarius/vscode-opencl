
## Parameters

`memobj`  
Specifies the memory object being queried.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by
`clGetMemObjectInfo` is described in the table below.

| cl\_mem\_info        | Return Type          | Info. returned in     |
| --- | --- | --- |
|  `CL_MEM_TYPE`        |  c                      l\_mem\_object\_type |  `param_value`           Returns one of the      following values:       `                       CL_MEM_OBJECT_BUFFER`   if `memobj` is          created with            [`clCreateBuffer`]      (clCreateBuffer.html)   or                      [`cl                    CreateSubBuffer`](clC   reateSubBuffer.html).   cl\_im                  age\_desc.image\_type   argument value if       `memobj` is created     with                    [`clCreateImage`]       (clCreateImage.html).   `CL_MEM_OBJECT_PIPE`    if `memobj` is          created with            [`clCreatePipe`       |
|  `CL_MEM_FLAGS`       |  cl\_mem\_flags       |  ](clCreatePipe.html).   Returns the `flags`     argument value          specified when          `memobj` is created     with                    [`clCreateBuffer`](     clCreateBuffer.html),   [`cl                    CreateSubBuffer`](clC   reateSubBuffer.html),   [`clCreateImage`]       (clCreateImage.html).   or                      [`clCreatePipe`         ](clCreatePipe.html).   If `memobj` is a        sub-buffer the memory   access qualifiers       inherited from parent   buffer is also        |
|  `CL_MEM_SIZE`        |  size\_t              |  returned.               Return actual size of   the data store          associated with       |
|  `CL_MEM_HOST_PTR`    |  void \*              |  `memobj` in bytes.      If `memobj` is          created with            [`clCreateBuffer`]      (clCreateBuffer.html)   or                      [`clCreateImage`        ](clCreateImage.html)   and                     `CL_MEM_USE_HOST_PTR`   is specified in         `mem_flags`, return     the `host_ptr`          argument value          specified when          `memobj` is created.    Otherwise a NULL        value is returned.      If `memobj` is          created with            [`cl                    CreateSubBuffer`](clC   reateSubBuffer.html),   return the              `host_ptr` + `origin`   value specified when    `memobj` is created.    `host_ptr` is the       argument value          specified to            [`clCreateBuffer`]      (clCreateBuffer.html)   and                     `CL_MEM_USE_HOST_PTR`   is specified in         `mem_flags` for         memory object from      which `memobj` is       created. Otherwise a    NULL value is         |
|  `CL_MEM_MAP_COUNT`   |  cl\_uint             |  returned.               Map count. The map      count returned should   be considered           immediately stale. It   is unsuitable for       general use in          applications. This      feature is provided   |
|  `CL_                   MEM_REFERENCE_COUNT` |  cl\_uint             |  for debugging.          Return `memobj`         reference count. The    reference count         returned should be      considered              immediately stale. It   is unsuitable for       general use in          applications. This      feature is provided     for identifying       |
|  `CL_MEM_CONTEXT`     |  cl\_context          |  memory leaks.           Return context          specified when memory   object is created. If   `memobj` is created     using                   [`cl                    CreateSubBuffer`](clC   reateSubBuffer.html),   the context             associated with the     memory object           specified as the        `buffer` argument to    [`c                     lCreateSubBuffer`](cl   CreateSubBuffer.html) |
|  `CL_MEM_ASS            OCIATED_- MEMOBJECT` |  cl\_mem              |  is returned.            Return memory object    from which `memobj`     is created.             This returns the        memory object           specified as `buffer`   argument to             [`c                     lCreateSubBuffer`](cl   CreateSubBuffer.html)   if `memobj` is a        subbuffer object        created using           [`cl                    CreateSubBuffer`](clC   reateSubBuffer.html).   This returns the        `memobj` specified in   `cl_image_desc` if      `memobj` is an image    object.                 Otherwise a NULL      |
|  `CL_MEM_OFFSET`      |  size\_t              |  value is returned.      Return offset if        `memobj` is a           sub-buffer object       created using           [`cl                    CreateSubBuffer`](clC   reateSubBuffer.html).   This returns 0 if       `memobj` is not a     |
|  `CL_M                  EM_USES_SVM_POINTER` |  cl\_bool             |  subbuffer object.       Return `CL_TRUE` if     `memobj` is a buffer    object that was         created with            `CL_MEM_USE_HOST_PTR`   or is a subbuffer       object of a buffer      object that was         created with            `CL_MEM_USE_HOST_PTR`   and the `host_ptr`      specified when the      buffer object was       created is a SVM        pointer; otherwise    |
|  `CL_MEM                _D3D10_RESOURCE_KHR` |  ID3D10Resource \*    |  returns `CL_FALSE`.     If the                  [`cl_khr_               d3d10_sharing`](cl_kh   r_d3d10_sharing.html)   extension is enabled,   and if `memobj` was     created using           [                       `clCreateFromD3D10Buf   ferKHR`](clCreateFrom   D3D10BufferKHR.html),   [`clCre                 ateFromD3D10Texture2D   KHR`](clCreateFromD3D   10Texture2DKHR.html),   or                      [`clCre                 ateFromD3D10Texture3D   KHR`](clCreateFromD3D   10Texture3DKHR.html),   returns the             `resource` argument     specified when        |
|  `CL_MEM_DX9_MEDIA      _- ADAPTER_TYPE_KHR` |  cl\_dx9\_media\_-      adapter\_type\_khr   |  `memobj` was created.   Returns the             `cl_dx9_me              dia_adapter_type_khr`   argument value          specified when          `memobj` is created     using                   [`clCrea                teFromDX9MediaSurface   KHR`](clCreateFromDX9   MediaSurfaceKHR.html)   (If the                 [`cl_khr_dx9_medi       a_sharing`](cl_khr_dx   9_media_sharing.html)   extension is          |
|  `CL_MEM_DX9_MEDIA      _- SURFACE_INFO_KHR` |  cl\_dx9\_-             surface\_info\_khr   |  supported)              Returns the             `cl_                    dx9_surface_info_khr`   argument value          specified when          `memobj` is created     using                   [`clCrea                teFromDX9MediaSurface   KHR`](clCreateFromDX9   MediaSurfaceKHR.html)   (If the                 [`cl_khr_dx9_medi       a_sharing`](cl_khr_dx   9_media_sharing.html)   extension is          |
|  `CL_MEM                _D3D11_RESOURCE_KHR` |  ID3D11Resource \*    |  supported)              If the                  [`cl_khr_               d3d11_sharing`](cl_kh   r_d3d11_sharing.html)   extension is            supported, if           `memobj` was created    using                   [                       `clCreateFromD3D11Buf   ferKHR`](clCreateFrom   D3D11BufferKHR.html),   [`clCre                 ateFromD3D11Texture2D   KHR`](clCreateFromD3D   11Texture2DKHR.html),   or                      [`clCre                 ateFromD3D11Texture3D   KHR`](clCreateFromD3D   11Texture3DKHR.html),   returns the             `resource` argument     specified when        |

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Used to specify the size in bytes of memory pointed to by `param_value`.
This size must be ≥ size of return type as described in the table above.

`param_value_size_ret`  
Returns the actual size in bytes of data being queried by `param_value`.
If `param_value_size_ret` is NULL, it is ignored.

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; the size of return type as
    described in the table above and `param_value` is not NULL.

-   `CL_INVALID_MEM_OBJECT` if `memobj` is a not a valid memory object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

-   `CL_INVALID_D3D10_RESOURCE_KHR` If the
    [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html) extension is
    enabled and if `param_name` is `CL_MEM_D3D10_RESOURCE_KHR` and
    `memobj` was not created by the function
    [`clCreateFromD3D10BufferKHR`](clCreateFromD3D10BufferKHR.html),
    [`clCreateFromD3D10Texture2DKHR`](clCreateFromD3D10Texture2DKHR.html),
    or
    [`clCreateFromD3D10Texture3DKHR`](clCreateFromD3D10Texture3DKHR.html).

-   `CL_INVALID_DX9_MEDIA_SURFACE_KHR` if `param_name` is
    `CL_MEM_DX9_MEDIA_SURFACE_INFO_KHR` and `memobj` was not created by
    the function
    [`clCreateFromDX9MediaSurfaceKHR`](clCreateFromDX9MediaSurfaceKHR.html)
    from a Direct3D9 surface. (If the
    [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
    extension is supported)

-   `CL_INVALID_D3D11_RESOURCE_KHR` If the
    [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) extension is
    supported, if `param_name` is `CL_MEM_D3D11_RESOURCE_KHR` and
    `memobj` was not created by the function
    [`clCreateFromD3D11BufferKHR`](clCreateFromD3D11BufferKHR.html),
    [`clCreateFromD3D11Texture2DKHR`](clCreateFromD3D11Texture2DKHR.html),
    or
    [`clCreateFromD3D11Texture3DKHR`](clCreateFromD3D11Texture3DKHR.html)."

## Also see

[`clGetImageInfo`](clGetImageInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
170](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=170)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
