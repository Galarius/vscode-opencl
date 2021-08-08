
## Description

An OpenCL context is created with one or more devices. Contexts are used
by the OpenCL runtime for managing objects such as command-queues,
memory, program and kernel objects and for executing kernels on one or
more devices specified in the context.

## Parameters

properties  
Specifies a list of context property names and their corresponding
values. Each property name is immediately followed by the corresponding
desired value. The list is terminated with 0. `properties` can be NULL
in which case the platform that is selected is implementation-defined.
The list of supported `properties` is described in the table below.

If the extension
[`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html) is enabled,
then `properties` specifies a list of context property names and their
corresponding values. Each property is followed immediately by the
corresponding desired value. The list is terminated with zero. If a
property is not specified in `properties`, then its default value
(listed in the table below) is used (it is said to be specified
implicitly). If `properties` is NULL or empty (points to a list whose
first value is zero), all attributes take on their default values.

If the extension [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html) is
enabled, then `properties` specifies a list of context property names
and their corresponding values. Each property is followed immediately by
the corresponding desired value. The list is terminated with zero. If a
property is not specified in `properties`, then its default value is
used (it is said to be specified implicitly). If `properties` is NULL or
empty (points to a list whose first value is zero), all attributes take
on their default value.

If the extension [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) is
enabled, then `properties` specifies a list of context property names
and their corresponding values. Each property is followed immediately by
the corresponding desired value. The list is terminated with zero. If a
property is not specified in `properties`, then its default value is
used (it is said to be specified implicitly). If `properties` is NULL or
empty (points to a list whose first value is zero), all attributes take
on their default value.

If the extension [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) is
enabled, then `properties` points to an attribute list, which is a array
of ordered &lt;attribute name, value> pairs terminated with zero. If an
attribute is not specified in `properties`, then its default value is
used (it is said to be specified implicitly). If `properties` is NULL or
empty (points to a list whose first value is zero), all attributes take
on their default values.

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

`num_devices`  
The number of devices specified in the `devices` argument.

`devices`  
A pointer to a list of unique devices returned by
[`clGetDeviceIDs`](clGetDeviceIDs.html) or sub-devices created by
[`clCreateSubDevices`](clCreateSubDevices.html) for a platform.
Duplicate devices specified in `devices` are ignored.

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

|   |   |
---|---|
|  Note                              |  There are a number of cases where   error notifications need to be      delivered due to an error that      occurs outside a context. Such      notifications may not be            delivered through the               `pfn_notify` callback. Where        these notifications go is           implementation-defined.           |

`user_data`  
Passed as the `user_data` argument when `pfn_notify` is called.
`user_data` can be NULL.

`errcode_ret`  
Returns an appropriate error code. If `errcode_ret` is NULL, no error
code is returned.

## Notes

`clCreateContext` and
[`clCreateContextFromType`](clCreateContextFromType.html) perform an
implicit retain. This is very helpful for 3rd party libraries, which
typically get a context passed to them by the application. However, it
is possible that the application may delete the context without
informing the library. Allowing functions to attach to (i.e. retain) and
release a context solves the problem of a context being used by a
library no longer being valid.

If the [`cl_khr_terminate_context`](cl_khr_terminate_context.html)
extension is enabled, `CL_CONTEXT_TERMINATE_KHR` can be specified in the
context properties only if all devices associated with the context
support the ability to support context termination (i.e.
`CL_DEVICE_TERMINATE_CAPABILITY_CONTEXT_KHR` is set for
`CL_DEVICE_TERMINATE_CAPABILITY_KHR`). Otherwise, context creation fails
with error code of `CL_INVALID_PROPERTY`.

If the [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is
enabled: Attributes control sharing of OpenCL memory objects with OpenGL
buffer, texture, and renderbuffer objects as described in section 9.7.
Depending on the platform-specific API used to bind OpenGL contexts to
the window system, the following attributes may be set to identify an
OpenGL context:

-   When the CGL binding API is supported, the attribute
    `CL_CGL_SHAREGROUP_KHR` should be set to a `CGLShareGroup` handle to
    a CGL share group object.

-   When the EGL binding API is supported, the attribute
    `CL_GL_CONTEXT_KHR` should be set to an
    `` EGLContext`handle to an OpenGL ES or OpenGL context, and the attribute `CL_EGL_DISPLAY_KHR ``
    should be set to the EGLDisplay handle of the display used to create
    the OpenGL ES or OpenGL context.

-   When the GLX binding API is supported, the attribute
    `CL_GL_CONTEXT_KHR` should be set to a `GLXContext` handle to an
    OpenGL context, and the attribute `CL_GLX_DISPLAY_KHR` should be set
    to the Display handle of the X Window System display used to create
    the OpenGL context.

-   When the WGL binding API is supported, the attribute
    `CL_GL_CONTEXT_KHR` should be set to an HGLRC handle to an OpenGL
    context, and the attribute `CL_WGL_HDC_KHR` should be set to the HDC
    handle of the display used to create the OpenGL context.

If the [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is
enabled: Memory objects created in the context so specified may be
shared with the specified OpenGL or OpenGL ES context (as well as with
any other OpenGL contexts on the share list of that context, according
to the description of sharing in the GLX 1.4 and EGL 1.4 specifications,
and the WGL documentation for OpenGL implementations on Microsoft
Windows), or with the explicitly identified OpenGL share group for CGL.
If no OpenGL or OpenGL ES context or share group is specified in the
attribute list, then memory objects may not be shared, and calling any
of the commands in section 9.7 will result in a
`CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR` error.

## Errors

`clCreateContext` returns a valid non-zero context and `errcode_ret` is
set to `CL_SUCCESS` if the context is created successfully. Otherwise,
it returns a NULL value with the following error values returned in
`errcode_ret`:

-   `CL_INVALID_PLATFORM` if `properties` is NULL and no platform could
    be selected or if platform value specified in `properties` is not a
    valid platform. (If the extension
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) is enabled, then this
    error is replaced with `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR`; see
    below.)

-   `CL_INVALID_PROPERTY` if context property name in `properties` is
    not a supported property name, if the value specified for a
    supported property name is not valid, or if the same property name
    is specified more than once. However if the extension
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) is enabled, then
    `CL_INVALID_PROPERTY` is returned if an attribute name other than
    those listed in the table for `properties` above or if
    `CL_CONTEXT_INTEROP_USER_SYNC` is specified in `properties`.

-   `CL_INVALID_PROPERTY` if the
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is enabled
    and an attribute name other than those specified in the table above
    (table 4.5) or if `CL_CONTEXT_INTEROP_USER_SYNC` is specified in
    `properties`.

-   `CL_INVALID_VALUE` if `devices` is NULL; if `num_devices` is equal
    to zero; or if `pfn_notify` is NULL but `user_data` is not NULL.

-   `CL_INVALID_DEVICE` if `devices` contains an invalid device.

-   `CL_INVALID_OPERATION` if Direct3D 10 interoperability is specified
    by setting `CL_INVALID_D3D10_DEVICE_KHR` to a non-NULL value, and
    interoperability with another graphics API is also specified (if the
    [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html) extension is
    enabled).

-   `CL_DEVICE_NOT_AVAILABLE` if a device in `devices` is currently not
    available even though the device was returned by
    [`clGetDeviceIDs`](clGetDeviceIDs.html).

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

-   `CL_INVALID_D3D10_DEVICE_KHR` if the Direct3D 10 device specified
    for interoperability is not compatible with the devices against
    which the context is to be created (if the
    [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html) extension is
    enabled).

-   `CL_INVALID_D3D10_DEVICE_KHR` if the value of the property
    `CL_CONTEXT_D3D10_DEVICE_KHR` is non-NULL and does not specify a
    valid Direct3D 10 device with which the `cl_device_ids` against
    which this context is to be created may interoperate (if the
    [`cl_khr_d3d10_sharing`](cl_khr_d3d10_sharing.html) extension is
    enabled).

-   `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR` when an invalid OpenGL
    context or share group object handle is specified in `properties`
    (only if the [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension
    is enabled).

-   `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR` if no OpenGL or OpenGL ES
    context or share group is specified in the attribute list given to
    [`clCreateContext`](#) and any of the commands in section 9.7 are
    called. (if the [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html)
    extension is enabled)

-   `CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR` if the
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is enabled
    and if a context was specified by any of the following means:

    -   A context specified for an EGL-based OpenGL ES or OpenGL
        implementation by setting the attributes `CL_GL_CONTEXT_KHR` and
        `CL_EGL_DISPLAY_KHR`.

    -   A context was specified for a GLX-based OpenGL implementation by
        setting the attributes `CL_GL_CONTEXT_KHR` and
        `CL_GLX_DISPLAY_KHR`.

    -   A context was specified for a WGL-based OpenGL implementation by
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
    does not identify a valid CGL share group object (if the
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is enabled).

-   `CL_INVALID_OPERATION` if the
    [`cl_khr_gl_sharing`](cl_khr_gl_sharing.html) extension is enabled
    and if a context was specified as described above and any of the
    following conditions hold:

    -   A context or share group object was specified for one of CGL,
        EGL, GLX, or WGL and the OpenGL implementation does not support
        that window-system binding API.

    -   More than one of the attributes `CL_CGL_SHAREGROUP_KHR`,
        `CL_EGL_DISPLAY_KHR`, `CL_GLX_DISPLAY_KHR`, and `CL_WGL_HDC_KHR`
        is set to a non-default value.

    -   Both of the attributes `CL_CGL_SHAREGROUP_KHR` and
        `CL_GL_CONTEXT_KHR` are set to non-default values.

    -   Any of the devices specified in the `devices` argument cannot
        support OpenCL objects which share the data store of an OpenGL
        object, as described in section 9.7.

-   `CL_INVALID_DX9_MEDIA_ADAPTER_KHR` if the media adapter specified
    for interoperability is not compatible with the devices against
    which the context is to be created (only if the
    [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
    extension is supported).

-   `CL_INVALID_ADAPTER_KHR` if any of the values of the properties
    `CL_CONTEXT_ADAPTER_D3D9_KHR`, `CL_CONTEXT_ADAPTER_D3D9EX_KHR` or
    `CL_CONTEXT_ADAPTER_DXVA_KHR` is non-NULL and does not specify a
    valid media adapter with which the `cl_device_ids` against which
    this context is to be created may interoperate (only if the
    [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
    extension is supported).

-   `CL_INVALID_OPERATION` if interoperability is specified by setting
    `CL_CONTEXT_ADAPTER_D3D9_KHR`, `CL_CONTEXT_ADAPTER_D3D9EX_KHR` or
    `CL_CONTEXT_ADAPTER_DXVA_KHR` to a non-NULL value, and
    interoperability with another graphics API is also specified (only
    if the [`cl_khr_dx9_media_sharing`](cl_khr_dx9_media_sharing.html)
    extension is supported).

-   `CL_INVALID_OPERATION` if Direct3D 11 interoperability is specified
    by setting `CL_INVALID_D3D11_DEVICE_KHR` to a non-NULL value, and
    interoperability with another graphics API is also specified (only
    if the [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) extension
    is supported).

-   `CL_INVALID_D3D11_DEVICE_KHR` if the value of the property
    `CL_CONTEXT_D3D11_DEVICE_KHR` is non-NULL and does not specify a
    valid Direct3D 11 device with which the `cl_device_ids` against
    which this context is to be created may interoperate (only if the
    [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) extension is
    supported).

-   `CL_INVALID_D3D11_DEVICE_KHR` if the Direct3D 11 device specified
    for interoperability is not compatible with the devices against
    which the context is to be created (only if the
    [`cl_khr_d3d11_sharing`](cl_khr_d3d11_sharing.html) extension is
    supported).

## Also see

[`clGetDeviceIDs`](clGetDeviceIDs.html),
[`clCreateContextFromType`](clCreateContextFromType.html),
[`clRetainContext`](clRetainContext.html),
[`clReleaseContext`](clReleaseContext.html),
[`clGetContextInfo`](clGetContextInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
90](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=90)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
