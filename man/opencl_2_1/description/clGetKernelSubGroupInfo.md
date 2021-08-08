
## Parameters

`kernel`  
Specifies the kernel object being queried.

`device`  
Identifies a specific device in the list of devices associated with
`kernel`. The list of devices is the list of devices in the OpenCL
context that is associated with `kernel`. If the list of devices
associated with `kernel` is a single device, `device` can be a NULL
value.

`param_name`  
Specifies the information to query. The list of supported `param_name`
types and the information returned in `param_value` by
`clGetKernelSubGroupInfo` is described in the table below.

`input_value_size`  
Specifies the size in bytes of memory pointed to by `input_value`. This
size must be == size of input type as described in table below.

`input_value`  
A pointer to memory where the appropriate parameterization of the query
is passed from. If `input_value` is NULL, it is ignored.

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Used to specify the size in bytes of memory pointed to by `param_value`.
This size must be ≥ size of return type as described in the table below.

`param_value_size_ret`  
Returns the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

| cl\_kernel\_s   | Input Type      | Return Type     | Info. returned  |
| --- | --- | --- | --- |
|  ub\_group\_info   `CL_KERNEL_MAX    _SUB_- GROUP_SI   ZE_FOR_NDRANGE` |  size\_t \*      |  size\_t         |  in                `param_value`     Returns the       maximum           sub-group size    for this          kernel. All       subgroups must    be the same       size, while the   last sub-group    in any            work-group        (i.e. the         sub-group with    the maximum       index) could be   the same or       smaller size.     The               `input_value`     must be an        array of          `size_t` values   corresponding     to the local      work size         parameter of      the intended      dispatch. The     number of         dimensions in     the ND-range      will be           inferred from     the value         specified for   |
|  `CL_KERNEL_       SUB_GROUP_- COU   NT_FOR_NDRANGE` |  size\_t \*      |  size\_t         |  `inp              ut_value_size`.   Returns the       number of         sub-groups that   will be present   in each           work-group for    a given local     work size. All    workgroups,       apart from the    last work-group   in each           dimension in      the presence of   non-uniform       work-group        sizes, will       have the same     number of         subgroups.        The               `input_value`     must be an        array of          `size_t` values   corresponding     to the local      work size         parameter of      the intended      dispatch. The     number of         dimensions in     the ND-range      will be           inferred from     the value         specified for   |
|  `CL_KERNEL_LO     CAL_SIZE_ FOR_S   UB_GROUP_COUNT` |  size\_t         |  size\_t \[\]    |  `inp              ut_value_size`.   Returns the       local size that   will generate     the requested     number of sub-    groups for the    kernel. The       output array      must be an        array of          `size_t` values   corresponding     to the local      size parameter.   Any returned      work-group will   have one          dimension.        Other             dimensions        inferred from     the value         specified for     `pa               ram_value_size`   will be filled    with the value    1. The returned   value will        produce an        exact number of   sub-groups and    result in no      partial groups    for an            executing         kernel except     in the case       where the last    work- group in    a dimension has   a size            different from    that of the       other groups.     If no             work-group size   can accommodate   the requested     number of         sub-groups, 0     will be           returned in       each element of |
|  `CL_KERNEL_MAX_   NUM_SUB_GROUPS` |  ignored         |  size\_t         |  the return        array.            This provides a   mechanism for     the application   to query the      maximum number    of sub-groups     that may make     up each           work-group to     execute a         kernel on a       specific device   given by          device. The       OpenCL            implementation    uses the          resource          requirements of   the kernel        (register usage   etc.) to          determine what    this work-group   size should be.   The returned      value may be      used to compute   a work-group      size to enqueue   the kernel with   to give a round   number of       |
|  `CL_              KERNEL_COMPILE_   NUM_SUB_GROUPS` |  ignored         |  size\_t         |  sub-groups for    an enqueue.       Returns the       number of         sub-groups        specified in      the kernel        source or IL.     If the            sub-group count   is not            specified using   the above       |

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_DEVICE` if `device` is not in the list of devices
    associated with `kernel` or if `device` is NULL but there is more
    than one device associated with `kernel`.

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the table above and `param_value` is not NULL.

-   `CL_INVALID_VALUE` if `param_name` is
    `CL_KERNEL_SUB_GROUP_SIZE_FOR_NDRANGE` and the size in bytes
    specified by `input_value_size` is not valid or if `input_value` is
    NULL.

-   `CL_INVALID_KERNEL` if `kernel` is a not a valid kernel object.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Also see

## Specification

[OpenCL 2.1 API Specification, page
236](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=236)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
