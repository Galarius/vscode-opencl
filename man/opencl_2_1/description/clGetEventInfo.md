Parameters
----------

`event`  
Specifies the event object being queried.

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Specifies the size in bytes of memory pointed to by `param_value`. This
size must be ≥ size of the return type as described in the table below.

`param_value_size_ret`  
Returns the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by `clGetEventInfo`
is described in the table below (Table 5.22):

| cl\_event\_info       | Return Type           | Information returned  |
| --- | --- | --- |
|  `CL_EVENT_COMMAND_QUE   UE`                   |  cl\_command\_queue    |  in `param_value`        Return the              command-queue           associated with         `event`. For user       event objects, a NULL   value is returned. If   the                     [`cl_khr_gl_sharing`]   (cl_khr_gl_sharing.ht   ml)                     extension is enabled,   the command queue of    a linked event NULL,    because the event is    not associated with     any OpenCL command      queue. If the           [`cl_khr_egl_event`](   cl_khr_egl_event.html   )                       extension is enabled,   the                     `CL_EVENT_COMMAND_QUE   UE`                     of a linked event is    `NULL`, because the     event is not            associated with any   |
|  `CL_EVENT_CONTEXT`    |  cl\_context           |  OpenCL command queue.   Return the context      associated with       |
|  `CL_EVENT_COMMAND_TYP   E`                    |  cl\_command\_type     |  `event`.                Return the command      associated with         `event`. Can be one     of the following        values:                     CL_COMMAND_NDRANG   E_KERNEL                    CL_COMMAND_NATIVE   _KERNEL                     CL_COMMAND_READ_B   UFFER                       CL_COMMAND_WRITE_   BUFFER                      CL_COMMAND_COPY_B   UFFER                       CL_COMMAND_READ_I   MAGE                        CL_COMMAND_WRITE_   IMAGE                       CL_COMMAND_COPY_I   MAGE                        CL_COMMAND_COPY_B   UFFER_TO_IMAGE              CL_COMMAND_COPY_I   MAGE_TO_BUFFER              CL_COMMAND_MAP_BU   FFER                        CL_COMMAND_MAP_IM   AGE                         CL_COMMAND_UNMAP_   MEM_OBJECT                  CL_COMMAND_MARKER       CL_COMMAND_ACQUIR   E_GL_OBJECTS                CL_COMMAND_RELEAS   E_GL_OBJECTS                CL_COMMAND_READ_B   UFFER_RECT                  CL_COMMAND_WRITE_   BUFFER_RECT                 CL_COMMAND_COPY_B   UFFER_RECT                  CL_COMMAND_USER         CL_COMMAND_BARRIE   R                           CL_COMMAND_MIGRAT   E_MEM_OBJECTS               CL_COMMAND_FILL_B   UFFER                       CL_COMMAND_FILL_I   MAGE                        CL_COMMAND_SVM_FR   EE                          CL_COMMAND_SVM_ME   MCPY                        CL_COMMAND_SVM_ME   MFILL                       CL_COMMAND_SVM_MA   P                           CL_COMMAND_SVM_UN   MAP                         CL_COMMAND_GL_FEN   CE_SYNC_OBJECT_KHR            (if cl_khr_gl_e   vent                        is enabled, indic   ating that the event    is                          associated with a    GL sync object, rath   er than an OpenCL com   mand)                       CL_COMMAND_ACQUIR   E_D3D10_OBJECTS_KHR           (if cl_khr_d3d1   0_sharing is enabled)       CL_COMMAND_RELEAS   E_D3D10_OBJECTS_KHR           (if cl_khr_d3d1   0_sharing is enabled)       CL_COMMAND_ACQUIR   E_DX9_MEDIA_SURFACES_   KHR                           (if cl_khr_dx9_   media_sharing is enab   led)                        CL_COMMAND_RELEAS   E_DX9_MEDIA_SURFACES_   KHR                           (if cl_khr_dx9_   media_sharing is enab   led)                        CL_COMMAND_ACQUIR   E_D3D11_OBJECTS_KHR           (if  cl_khr_d3d   11_sharing is enabled   )                           CL_COMMAND_RELEAS   E_D3D11_OBJECTS_KHR           (if  cl_khr_d3d   11_sharing is enabled   )                           CL_COMMAND_EGL_FE   NCE_SYNC_OBJECT_KHR           (if  cl_khr_egl |
|  `CL_EVENT_COMMAND_ EX   ECUTION_STATUS`       |  cl\_int               |  _event is enabled)      Return the execution    status of the command   identified by           `event`. The valid      values are:             `CL_QUEUED` (command    has been enqueued in    the command-queue),     `CL_SUBMITTED`          (enqueued command has   been submitted by the   host to the device      associated with the     command-queue),         `CL_RUNNING` (device    is currently            executing this          command),               `CL_COMPLETE` (the      command has             completed), or          Error code given by a   negative integer        value. (command was     abnormally terminated   – this may be caused    by a bad memory         access etc.) These      error codes come from   the same set of error   codes that are          returned from the       platform or runtime     API calls as return     values or               `errcode_ret` values.   The error code values   are negative, and       event state values      are positive. The       event state values      are ordered from the    largest value           (`CL_QUEUED`) for the   first or initial        state to the smallest   value (`CL_COMPLETE`    or negative integer     value) for the last     or complete state.      The value of            `CL_COMPLETE` and       `CL_SUCCESS` are the    same.                   If the                  [`cl_khr_gl_event`](c   l_khr_gl_event.html)    extension is enabled,   the status of a         linked event is         either                  `CL_SUBMITTED`,         indicating that the     fence command           associated with the     sync object has not     yet completed, or       `CL_COMPLETE`,          indicating that the     fence command has       completed.              If the                  [`cl_khr_egl_event`](   cl_khr_egl_event.html   )                       extension is enabled,   the status of a         linked event is         either                  `CL_SUBMITTED`,         indicating that the     fence command           associated with the     sync object has not     yet completed, or       `CL_COMPLETE`,          indicating that the     fence command has     |
|  `CL_EVENT_REFERENCE_C   OUNT`                 |  cl\_uint              |  completed.              Return the `event`      reference count. The    reference count         returned should be      considered              immediately stale. It   is unsuitable for       general use in          applications. This      feature is provided     for identifying       |
Notes
-----

Using `clGetEventInfo` to determine if a command identified by `event`
has finished execution (i.e. `CL_EVENT_COMMAND_EXECUTION_STATUS` returns
`CL_COMPLETE`) is not a synchronization point. There are no guarantees
that the memory objects being modified by command associated with
`event` will be visible to other enqueued commands.

Errors
------

Returns `CL_SUCCESS` if the function executed successfully. Otherwise,
it returns one of the following errors:

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the table above and `param_value` is not NULL.

-   `CL_INVALID_VALUE` if information to query given in `param_name`
    cannot be queried for event.

-   `CL_INVALID_EVENT` if `event` is not a valid `event` object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

Also see
--------

[`enums`](enums.html), [`clReleaseEvent`](clReleaseEvent.html),
[`clRetainEvent`](clRetainEvent.html),
[`clWaitForEvents`](clWaitForEvents.html),
[`cl_khr_gl_event`](cl_khr_gl_event.html)

Specification
-------------

[OpenCL 2.1 API Specification, page
252](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=252)

Copyright
---------

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
