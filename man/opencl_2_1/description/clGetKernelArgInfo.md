Parameters
----------

`kernel`  
Specifies the kernel object being queried.

`arg_indx`  
The argument index. Arguments to the kernel are referred by indices that
go from 0 for the leftmost argument to `n` - 1, where `n` is the total
number of arguments declared by a kernel.

`param_name`  
Specifies the argument information to query. The list of supported
`param_name` types and the information returned in `param_value` by
`clGetKernelArgInfo` is described in the table below.

`param_value`  
A pointer to memory where the appropriate result being queried is
returned. If `param_value` is NULL, it is ignored.

`param_value_size`  
Used to specify the size in bytes of memory pointed to by `param_value`.
This size must be &gt; size of return type as described in the table
below.

| cl\_kernel\_arg\_info | Return Type           | Info. returned in     |
| --- | --- | --- |
|  `CL_KERNEL_ARG_ADDRES   S_QUALIFIER`          |  cl\_kernel\_arg\_-      address\_qualifier    |  `param_value`           Returns the address     qualifier specified     for the argument        given by `arg_indx`.    This can be one of      the following values:       CL_KERNEL_ARG_ADD   RESS_GLOBAL                 CL_KERNEL_ARG_ADD   RESS_LOCAL                  CL_KERNEL_ARG_ADD   RESS_CONSTANT               CL_KERNEL_ARG_ADD   RESS_PRIVATE            If no address           qualifier is            specified, the          default address         qualifier which is      `CL_KERNEL_ARG_ADDRES   S_PRIVATE`            |
|  `CL_KERNEL_ARG_ACCESS   _QUALIFIER`           |  cl\_kernel\_arg\_-      access\_qualifier     |  is returned.            Returns the access      qualifier specified     for the argument        given by `arg_indx`.    This can be one of      the following values:       CL_KERNEL_ARG_ACC   ESS_READ_ONLY               CL_KERNEL_ARG_ACC   ESS_WRITE_ONLY              CL_KERNEL_ARG_ACC   ESS_READ_WRITE              CL_KERNEL_ARG_ACC   ESS_NONE                If argument is not an   image type and is not   declared with the       `pipe` qualifier,       `CL_KERNEL_ARG_ACCESS   _NONE`                  is returned. If         argument is an image    type, the access        qualifier specified     or the default access   qualifier is          |
|  `CL_KERNEL_ARG_TYPE_N   AME`                  |  char\[\]              |  returned.               Returns the type name   specified for the       argument given by       `arg_indx`. The type    name returned will be   the argument type       name as it was          declared with any       whitespace removed.     If argument type name   is an unsigned scalar   type (i.e. unsigned     char, unsigned short,   unsigned int,           unsigned long),         uchar, ushort, uint     and ulong will be       returned. The           argument type name      returned does not       include any type      |
|  `CL_KERNEL_ARG_TYPE_Q   UALIFIER`             |  cl\_kernel\_arg-        type\_qualifier       |  qualifiers.             Returns the type        qualifier specified     for the argument        given by `arg_indx`.    The returned value      can be:                 `CL_KERNEL_ARG_TYPE_C   ONST`,                  `CL_KERNEL_ARG_TYPE_R   ESTRICT`,               `CL_KERNEL_ARG_TYPE_V   OLATILE`,               a combination of the    above enums,            `CL_KERNEL_ARG_TYPE_P   IPE`                    or                      `CL_KERNEL_ARG_TYPE_N   ONE`.                   +--------------------   ---------------+-----   ---------------------   ---------+              KERNEL_ARG_TYPE_VOLAT   ILE` is    rned if the argument    is a       ter and the pointer i   s          ared with the volatil   e          ifier. For example, a    kernel    ment declared as        bal int volatile *x`    returns    KERNEL_ARG_TYPE_VOLAT   ILE` but   rnel argument declare   d as       bal int * volatile x`    does       Similarly,             KERNEL_ARG_TYPE_CONST   ` is       rned if the argument    is a       ter and the reference   d type     eclared with the rest   rict or    t qualifier. For exam   ple, a     el argument declared    as         bal int const *x` ret   urns       KERNEL_ARG_TYPE_CONST   ` but a    el argument declared    as         bal int * const x` do   es not.    +--------------------   ---------------+-----   ---------------------   ---------+              If the argument is      declared with the       constant address        space qualifier, the    `CL_KERNEL_ARG_TYPE_C   ONST`                   type qualifier will     be set.                 `CL_KERNEL_ARG_TYPE_R   ESTRICT`                will be returned if     the pointer type is     marked restrict. For    example,                `global int * restric   t x`                    returns                 `CL_KERNEL_ARG_TYPE_R |
|  `CL_KERNEL_ARG_NAME`  |  char\[\]              |  ESTRICT`.               Returns the name        specified for the       argument given by     |
`param_value_size_ret`  
Returns the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

Notes
-----

Kernel argument information is only available if the program object
associated with `kernel` was created with
[`clCreateProgramWithSource`](clCreateProgramWithSource.html) and the
program executable is built with the -cl-kernel-arg-info option
specified in `options` argument to
[`clBuildProgram`](clBuildProgram.html) or
[`clCompileProgram`](clCompileProgram.html).

Errors
------

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_ARG_INDEX` if `arg_indx` is not a valid argument index.

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the table above and `param_value` is not NULL

-   `CL_KERNEL_ARG_INFO_NOT_AVAILABLE` if the argument information is
    not available for kernel.

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

Also see
--------

[`clCreateKernel`](clCreateKernel.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clCreateProgramWithSource`](clCreateProgramWithSource.html),
[`clBuildProgram`](clBuildProgram.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html)

Specification
-------------

[OpenCL 2.1 API Specification, page
238](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=238)

Copyright
---------

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
