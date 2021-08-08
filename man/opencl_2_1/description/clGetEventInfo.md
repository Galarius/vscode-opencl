
## Parameters

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

| cl\_event\_info      | Return Type          | Information returned  |
| --- | --- | --- |
|  `CL_                   EVENT_COMMAND_QUEUE` |  cl\_command\_queue   |  in `param_value`        Return the              command-queue           associated with         `event`. For user       event objects, a NULL   value is returned. If   the                     [`c                     l_khr_gl_sharing`](cl   _khr_gl_sharing.html)   extension is enabled,   the command queue of    a linked event NULL,    because the event is    not associated with     any OpenCL command      queue. If the           [                       `cl_khr_egl_event`](c   l_khr_egl_event.html)   extension is enabled,   the                     `CL                     _EVENT_COMMAND_QUEUE`   of a linked event is    `NULL`, because the     event is not            associated with any   |
|  `CL_EVENT_CONTEXT`   |  cl\_context          |  OpenCL command queue.   Return the context      associated with       |
|  `CL                    _EVENT_COMMAND_TYPE` |  cl\_command\_type    |  `event`.                Return the command      associated with         `event`. Can be one     of the following        values:                     CL_C                OMMAND_NDRANGE_KERNEL       CL_                 COMMAND_NATIVE_KERNEL       C                   L_COMMAND_READ_BUFFER       CL                  _COMMAND_WRITE_BUFFER       C                   L_COMMAND_COPY_BUFFER   CL_COMMAND_READ_IMAGE       C                   L_COMMAND_WRITE_IMAGE   CL_COMMAND_COPY_IMAGE       CL_COMMAND          _COPY_BUFFER_TO_IMAGE       CL_COMMAND          _COPY_IMAGE_TO_BUFFER   CL_COMMAND_MAP_BUFFER    CL_COMMAND_MAP_IMAGE       CL_COM              MAND_UNMAP_MEM_OBJECT       CL_COMMAND_MARKER       CL_COMMA            ND_ACQUIRE_GL_OBJECTS       CL_COMMA            ND_RELEASE_GL_OBJECTS       CL_COM              MAND_READ_BUFFER_RECT       CL_COMM             AND_WRITE_BUFFER_RECT       CL_COM              MAND_COPY_BUFFER_RECT       CL_COMMAND_USER        CL_COMMAND_BARRIER       CL_COMMAN           D_MIGRATE_MEM_OBJECTS       C                   L_COMMAND_FILL_BUFFER   CL_COMMAND_FILL_IMAGE     CL_COMMAND_SVM_FREE   CL_COMMAND_SVM_MEMCPY       C                   L_COMMAND_SVM_MEMFILL      CL_COMMAND_SVM_MAP    CL_COMMAND_SVM_UNMAP       CL_COMMAND_GL_      FENCE_SYNC_OBJECT_KHR     (if cl_khr_gl_event     is enabled, indicat   ing that the event is       a                   ssociated with a GL s   ync object, rather th   an an OpenCL command)       CL_COMMAND_ACQU     IRE_D3D10_OBJECTS_KHR         (if cl_khr_d3d1   0_sharing is enabled)       CL_COMMAND_RELE     ASE_D3D10_OBJECTS_KHR         (if cl_khr_d3d1   0_sharing is enabled)    CL_COMMAND_ACQUIRE_D   X9_MEDIA_SURFACES_KHR     (if cl_khr_dx9_medi   a_sharing is enabled)    CL_COMMAND_RELEASE_D   X9_MEDIA_SURFACES_KHR     (if cl_khr_dx9_medi   a_sharing is enabled)       CL_COMMAND_ACQU     IRE_D3D11_OBJECTS_KHR        (if  cl_khr_d3d1   1_sharing is enabled)       CL_COMMAND_RELE     ASE_D3D11_OBJECTS_KHR        (if  cl_khr_d3d1   1_sharing is enabled)       CL_COMMAND_EGL_     FENCE_SYNC_OBJECT_KHR         (if  cl_khr_    |
|  `CL_EVENT_COMMAN       D_ EXECUTION_STATUS` |  cl\_int              |  egl_event is enabled)   Return the execution    status of the command   identified by           `event`. The valid      values are:             `CL_QUEUED` (command    has been enqueued in    the command-queue),     `CL_SUBMITTED`          (enqueued command has   been submitted by the   host to the device      associated with the     command-queue),         `CL_RUNNING` (device    is currently            executing this          command),               `CL_COMPLETE` (the      command has             completed), or          Error code given by a   negative integer        value. (command was     abnormally terminated   – this may be caused    by a bad memory         access etc.) These      error codes come from   the same set of error   codes that are          returned from the       platform or runtime     API calls as return     values or               `errcode_ret` values.   The error code values   are negative, and       event state values      are positive. The       event state values      are ordered from the    largest value           (`CL_QUEUED`) for the   first or initial        state to the smallest   value (`CL_COMPLETE`    or negative integer     value) for the last     or complete state.      The value of            `CL_COMPLETE` and       `CL_SUCCESS` are the    same.                   If the                  [`cl_khr_gl_event`](    cl_khr_gl_event.html)   extension is enabled,   the status of a         linked event is         either                  `CL_SUBMITTED`,         indicating that the     fence command           associated with the     sync object has not     yet completed, or       `CL_COMPLETE`,          indicating that the     fence command has       completed.              If the                  [                       `cl_khr_egl_event`](c   l_khr_egl_event.html)   extension is enabled,   the status of a         linked event is         either                  `CL_SUBMITTED`,         indicating that the     fence command           associated with the     sync object has not     yet completed, or       `CL_COMPLETE`,          indicating that the     fence command has     |
|  `CL_EV                 ENT_REFERENCE_COUNT` |  cl\_uint             |  completed.              Return the `event`      reference count. The    reference count         returned should be      considered              immediately stale. It   is unsuitable for       general use in          applications. This      feature is provided     for identifying       |

## Notes

Using `clGetEventInfo` to determine if a command identified by `event`
has finished execution (i.e. `CL_EVENT_COMMAND_EXECUTION_STATUS` returns
`CL_COMPLETE`) is not a synchronization point. There are no guarantees
that the memory objects being modified by command associated with
`event` will be visible to other enqueued commands.

## Errors

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

## Also see

[`enums`](enums.html), [`clReleaseEvent`](clReleaseEvent.html),
[`clRetainEvent`](clRetainEvent.html),
[`clWaitForEvents`](clWaitForEvents.html),
[`cl_khr_gl_event`](cl_khr_gl_event.html)

## Specification

[OpenCL 2.1 API Specification, page
252](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=252)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
