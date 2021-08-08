
## Parameters

properties  
Specifies a list of context property names and their corresponding
values. Each property name is immediately followed by the corresponding
desired value. The list of supported properties is described in the
table below. `properties` can also be NULL in which case the platform
that is selected is implementation-defined.

If the [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is
supported, `properties` points to an attribute list whose format and
valid contents are identical to the `properties` argument of
[`clCreateContext`](clCreateContext.html).

If the [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
extension is supported, `properties` points to an attribute list whose
format and valid contents are identical to the `properties` argument of
[`clCreateContext`](clCreateContext.html).

If the [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html) extension is
supported, `properties` specifies a list of context property names and
their corresponding values. Each property is followed immediately by the
corresponding desired value. The list is terminated with zero. If a
property is not specified in `properties`, then its default value
(listed in table 4.5) is used (it is said to be specified implicitly).
If `properties` is NULL or empty (points to a list whose first value is
zero), all attributes take on their default values."

If the [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) extension is
supported, `properties` specifies a list of context property names and
their corresponding values. Each property is followed immediately by the
corresponding desired value. The list is terminated with zero. If a
property is not specified in `properties`, then its default value
(listed in table 4.5) is used (it is said to be specified implicitly).
If `properties` is NULL or empty (points to a list whose first value is
zero), all attributes take on their default values."

List of supported `properties` (Table 4.5)

| cl\                  | Property value       | Description           |
| --- | --- | --- |
|  _context\_properties   enum                 |||
|  `                      CL_CONTEXT_PLATFORM`   `CL_CONTEX             T_INTEROP_USER_SYNC` |  cl\_platform\_id       cl\_bool             |  Specifies the           platform to use.        Specifies whether the   user is responsible     for synchronization     between OpenCL and      other APIs. Please      refer to the specific   sections in the         OpenCL 2.0 extension    specification that      describe sharing with   other APIs for          restrictions on using   this flag. If           `CL_CONTE               XT_INTEROP_USER_SYNC`   is not specified, a     default of `CL_FALSE`   is assumed. OpenCL /    OpenGL sharing does     not support the         `CL_CONTE               XT_INTEROP_USER_SYNC`   property defined in     table 4.5. Specifying   this property when      creating a context      with OpenCL / OpenGL  |
|  `CL_CONTE              XT_D3D10_DEVICE_KHR` |  `ID3D10Device` \*    |  sharing will return     an appropriate error.   Specifies the           `ID3D10Device` \* to    use for Direct3D 10     interoperability. The   default value is NULL   (applies if the         extension               [`cl_khr_               d3d10_sharing`](cl_kh |
|  `CL_CONTE              XT_ADAPTER_D3D9_KHR` |  `                      IDirect3DDevice9` \* |  r_d3d10_sharing.html)   is supported)           Specifies an            `IDirect3DDevice9` to   use for D3D9 interop    (applies if the         [`cl_khr_dx9_medi       a_sharing`](cl_khr_dx   9_media_sharing.html) |
|  `CL_CONTEXT            _ADAPTER_D3D9EX_KHR` |  `I                     Direct3DDeviceEx` \* |  extension is            supported)              Specifies an            `IDirect3DDevice9Ex`    to use for D3D9         interop (applies if     the                     [`cl_khr_dx9_medi       a_sharing`](cl_khr_dx   9_media_sharing.html) |
|  `CL_CONTE              XT_ADAPTER_DXVA_KHR` |  `IDXVAHD_Device` \*  |  extension is            supported)              Specifies an            `IDXVAHD_Device` to     use for DXVA interop    (applies if the         [`cl_khr_dx9_medi       a_sharing`](cl_khr_dx   9_media_sharing.html) |
|  `CL_GL_CONTEXT_KHR`  |  0, OpenGL context      handle               |  extension is            supported)              OpenGL context to       associated the OpenCL   context with            (available if the       [`c                     l_khr_gl_sharing`](cl |
|  `CL                    _CGL_SHAREGROUP_KHR` |  0, CGL share group     handle               |  _khr_gl_sharing.html)   extension is enabled)   CGL share group to      associate the OpenCL    context with            (available if the       [`c                     l_khr_gl_sharing`](cl |
|  `CL_EGL_DISPLAY_KHR` |  `EGL_NO_DISPLAY`,      `EGLDisplay` handle  |  _khr_gl_sharing.html)   extension is enabled)   EGLDisplay an OpenGL    context was created     with respect to         (available if the       [`c                     l_khr_gl_sharing`](cl |
|  `CL_GLX_DISPLAY_KHR` |  None, X handle       |  _khr_gl_sharing.html)   extension is enabled)   X Display an OpenGL     context was created     with respect to         (available if the       [`c                     l_khr_gl_sharing`](cl |
|  `CL_WGL_HDC_KHR`     |  0, HDC handle        |  _khr_gl_sharing.html)   extension is enabled)   HDC an OpenGL context   was created with        respect to (available   if the                  [`c                     l_khr_gl_sharing`](cl |
|  `CL_CONTE              XT_D3D11_DEVICE_KHR` |  `ID3D11Device` \*    |  _khr_gl_sharing.html)   extension is enabled)   Specifies the           `ID3D11Device` \* to    use for Direct3D 11     interoperability. The   default value is        NULL. (Applies if the   [`cl_khr_               d3d11_sharing`](cl_kh   r_d3d11_sharing.html) |
|  `CL_CONTEXT_ME         MORY_INITIALIZE_KHR` |  `cl_context_memo       ry- _initialize_khr` |  extension is            supported.)             Describes which         memory types for the    context must be         initialized. This is    a bit-field, where      the following values    are currently           supported:              `CL_CONTEXT_MEMORY_IN   ITIALIZE_LOCAL_KHR` -   Initialize local        memory to zeros.        `C                      L_CONTEXT_MEMORY_INIT   IALIZE_PRIVATE_KHR` -   Initialize private      memory to zeros.        (applies if the         [`cl_khr_initiali       ze_memory`](cl_khr_in   itialize_memory.html) |
|  `CL_CO                 NTEXT_TERMINATE_KHR` |  `cl_bool`            |  extension is            supported)              Specifies whether the   context can be          terminated. The         default value is        `CL_FALSE`. (applies    if the                  [`cl_khr_terminat       e_context`](cl_khr_te   rminate_context.html) |

device\_type  
A bit-field that identifies the type of device and is described in the
table below.

| cl\_device\_type                  | Description                       |
| --- | --- |
|  `CL_DEVICE_TYPE_CPU`              |  An OpenCL device that is the host   processor. The host processor       runs the OpenCL implementations     and is a single or multi-core       CPU.                              |
|  `CL_DEVICE_TYPE_GPU`              |  An OpenCL device that is a GPU.     By this we mean that the device     can also be used to accelerate a    3D API such as OpenGL or DirectX. |
|  `CL_DEVICE_TYPE_ACCELERATOR`      |  Dedicated OpenCL accelerators       (for example the IBM CELL Blade).   These devices communicate with      the host processor using a          peripheral interconnect such as     PCIe.                             |
|  `CL_DEVICE_TYPE_CUSTOM`           |  Dedicated accelerators that do      not support programs written in     OpenCL C.                         |
|  `CL_DEVICE_TYPE_DEFAULT`          |  The default OpenCL device in the    system. The default device cannot   be a `CL_DEVICE_TYPE_CUSTOM`        device.                           |
|  `CL_DEVICE_TYPE_ALL`              |  All OpenCL devices available in     the system except                   `CL_DEVICE_TYPE_CUSTOM` devices.  |

`pfn_notify`  
A callback function that can be registered by the application. This
callback function will be used by the OpenCL implementation to report
information on errors during context creation as well as errors that
occur at runtime in this context. This callback function may be called
asynchronously by the OpenCL implementation. It is the application’s
responsibility to ensure that the callback function is thread-safe. If
`pfn_notify` is NULL, no callback function is registered. The parameters
to this callback function are:

`errinfo` is a pointer to an error string.

`private_info` and `cb` represent a pointer to binary data that is
returned by the OpenCL implementation that can be used to log additional
information helpful in debugging the error.

`user_data` is a pointer to user supplied data.

There are a number of cases where error notifications need to be
delivered due to an error that occurs outside a context. Such
notifications may not be delivered through the `pfn_notify` callback.
Where these notifications go is implementation-defined.

`user_data`  
Passed as the `user_data` argument when `pfn_notify` is called.
`user_data` can be NULL.

`errcode_ret`  
Return an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Description

Only devices that are returned by
[`clGetDeviceIDs`](clGetDeviceIDs.html) for `device_type` are used to
create the context. The context does not reference any sub-devices that
may have been created from these devices.

## Notes

`clCreateContextFromType` may return all or a subset of the actual
physical devices present in the platform and that match `device_type`.

`clCreateContextFromType` and [`clCreateContext`](clCreateContext.html)
perform an implicit retain. This is very helpful for 3rd party
libraries, which typically get a context passed to them by the
application. However, it is possible that the application may delete the
context without informing the library. Allowing functions to attach to
(i.e. retain) and release a context solves the problem of a context
being used by a library no longer being valid.

## Errors

`clCreateContextFromType` returns a valid non-zero context and
`errcode_ret` is set to `CL_SUCCESS` if the context is created
successfully. Otherwise, it returns a NULL value with the following
error values returned in `errcode_ret`:

-   `CL_INVALID_PLATFORM` if `properties` is NULL and no platform could
    be selected or if platform value specified in `properties` is not a
    valid platform. If the [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html)
    extension is supported, this error is replaced (or not) by
    `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR` and possibly
    `CL_INVALID_OPERATION` (see below and section 9.5.4 of the spec for
    clarification).

-   `CL_INVALID_PROPERTY` if context property name in `properties` is
    not a supported property name, or if the value specified for a
    supported property name is not valid, or if the same property name
    is specified more than once.

-   `CL_INVALID_VALUE` if `pfn_notify` is NULL but `user_data` is not
    NULL.

-   `CL_INVALID_DEVICE_TYPE` if `device_type` is not a valid value.

-   `CL_DEVICE_NOT_AVAILABLE` if no devices that match `device_type` and
    property values specified in `properties` are currently available.

-   `CL_DEVICE_NOT_FOUND` if no devices that match `device_type` and
    property values specified in `properties` were found.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

-   `CL_INVALID_D3D10_DEVICE_KHR` if the Direct3D 10 device specified
    for interoperability is not compatible with the devices against
    which the context is to be created (if the
    [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html) extension is
    enabled).

-   `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR` when an invalid OpenGL
    context or share group object handle is specified in `properties` if
    the [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is
    enabled.

-   `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR`: If no OpenGL or OpenGL ES
    context or share group is specified in the attribute list, then
    memory objects may not be shared, and calling any of the commands in
    section 9.7 will result in this error (if the
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is enabled).

-   `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR` if the
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is enabled
    and if a context was specified by any of the following means:

    -   Context specified for an EGL-based OpenGL ES or OpenGL
        implementation by setting the attributes `CL_GL_CONTEXT_KHR` and
        `CL_EGL_DISPLAY_KHR`.

    -   Context was specified for a GLX-based OpenGL implementation by
        setting the attributes `CL_GL_CONTEXT_KHR` and
        `CL_GLX_DISPLAY_KHR`.

    -   Context was specified for a WGL-based OpenGL implementation by
        setting the attributes `CL_GL_CONTEXT_KHR` and `CL_WGL_HDC_KHR`.

    and any of the following conditions hold:

    -   The specified display and context attributes do not identify a
        valid OpenGL or OpenGL ES context.

    -   The specified context does not support buffer and renderbuffer
        objects.

    -   The specified context is not compatible with the OpenCL context
        being created (for example, it exists in a physically distinct
        address space, such as another hardware device, or does not
        support sharing data with OpenCL due to implementation
        restrictions).

-   `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR` if a share group was
    specified for a CGL-based OpenGL implementation by setting the
    attribute `CL_CGL_SHAREGROUP_KHR`, and the specified share group
    does not identify a valid CGL share group object (only if the
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is enabled).

-   `CL_INVALID_DX9_MEDIA_ADAPTER_KHR` if the media adapter specified
    for interoperability is not compatible with the devices against
    which the context is to be created (only if the
    [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
    extension is supported).

-   `CL_INVALID_ADAPTER_KHR` if any of the values of the properties
    `CL_CONTEXT_ADAPTER_D3D9_KHR`, `CL_CONTEXT_ADAPTER_D3D9EX_KHR` or
    `CL_CONTEXT_ADAPTER_DXVA_KHR` is non-NULL and does not specify a
    valid media adapter with which the cl\_device\_ids against which
    this context is to be created may interoperate. (only if the
    [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
    extension is supported).

-   `CL_INVALID_OPERATION` if interoperability is specified by setting
    `CL_CONTEXT_ADAPTER_D3D9_KHR`, `CL_CONTEXT_ADAPTER_D3D9EX_KHR` or
    `CL_CONTEXT_ADAPTER_DXVA_KHR` to a non-NULL value, and
    interoperability with another graphics API is also specified. (only
    if the [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
    extension is supported).

-   `CL_INVALID_OPERATION` if Direct3D 10 interoperability is specified
    by setting `CL_INVALID_D3D10_DEVICE_KHR` to a non-NULL value, and
    interoperability with another graphics API is also specified (if the
    [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html) extension is
    enabled).

-   `CL_INVALID_D3D11_DEVICE_KHR` if the Direct3D 11 device specified
    for interoperability is not compatible with the devices against
    which the context is to be created (only if the
    [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) extension is
    supported).

-   `CL_INVALID_OPERATION` if Direct3D 11 interoperability is specified
    by setting `CL_INVALID_D3D11_DEVICE_KHR` to a non-NULL value, and
    interoperability with another graphics API is also specified. (only
    if the [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) extension
    is supported).

-   `CL_INVALID_D3D11_DEVICE_KHR` if the value of the property
    `CL_CONTEXT_D3D11_DEVICE_KHR` is non-NULL and does not specify a
    valid Direct3D 11 device with which the `cl_device_ids` against
    which this context is to be created may interoperate. (only if the
    [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) extension is
    supported).

## Also see

[`clCreateContext`](clCreateContext.html),
[`clGetContextInfo`](clGetContextInfo.html),
[`clReleaseContext`](clReleaseContext.html),
[`clRetainContext`](clRetainContext.html),
[`clGetContextInfo`](clGetContextInfo.html), [Cardinality
Diagram](classDiagram.html)

## Specification

[OpenCL 2.1 API Specification, page
92](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=92)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
