
## Parameters

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
This size must be > size of return type as described in the table below.

| c                    | Return Type          | Info. returned in     |
| --- | --- | --- |
|  l\_kernel\_arg\_info   `CL_KERNEL_AR          G_ADDRESS_QUALIFIER` |  cl\_kernel\_arg\_-     address\_qualifier   |  `param_value`           Returns the address     qualifier specified     for the argument        given by `arg_indx`.    This can be one of      the following values:       CL_KERN             EL_ARG_ADDRESS_GLOBAL       CL_KER              NEL_ARG_ADDRESS_LOCAL       CL_KERNEL           _ARG_ADDRESS_CONSTANT       CL_KERNE            L_ARG_ADDRESS_PRIVATE   If no address           qualifier is            specified, the          default address         qualifier which is      `CL_KERNEL              _ARG_ADDRESS_PRIVATE` |
|  `CL_KERNEL_A           RG_ACCESS_QUALIFIER` |  cl\_kernel\_arg\_-     access\_qualifier    |  is returned.            Returns the access      qualifier specified     for the argument        given by `arg_indx`.    This can be one of      the following values:       CL_KERNEL           _ARG_ACCESS_READ_ONLY       CL_KERNEL_          ARG_ACCESS_WRITE_ONLY       CL_KERNEL_          ARG_ACCESS_READ_WRITE       CL_K                ERNEL_ARG_ACCESS_NONE   If argument is not an   image type and is not   declared with the       `pipe` qualifier,       `CL_KE                  RNEL_ARG_ACCESS_NONE`   is returned. If         argument is an image    type, the access        qualifier specified     or the default access   qualifier is          |
|  `CL_K                  ERNEL_ARG_TYPE_NAME` |  char\[\]             |  returned.               Returns the type name   specified for the       argument given by       `arg_indx`. The type    name returned will be   the argument type       name as it was          declared with any       whitespace removed.     If argument type name   is an unsigned scalar   type (i.e. unsigned     char, unsigned short,   unsigned int,           unsigned long),         uchar, ushort, uint     and ulong will be       returned. The           argument type name      returned does not       include any type      |
|  `CL_KERNEL             _ARG_TYPE_QUALIFIER` |  cl\_kernel\_arg-       type\_qualifier      |  qualifiers.             Returns the type        qualifier specified     for the argument        given by `arg_indx`.    The returned value      can be:                 `CL_KE                  RNEL_ARG_TYPE_CONST`,   `CL_KERNE               L_ARG_TYPE_RESTRICT`,   `CL_KERNE               L_ARG_TYPE_VOLATILE`,   a combination of the    above enums,            `CL_                    KERNEL_ARG_TYPE_PIPE`   or                      `CL_K                   ERNEL_ARG_TYPE_NONE`.   +--------+--------+     +--------+--------+     If the argument is      declared with the       constant address        space qualifier, the    `CL_K                   ERNEL_ARG_TYPE_CONST`   type qualifier will     be set.                 `CL_KERN                EL_ARG_TYPE_RESTRICT`   will be returned if     the pointer type is     marked restrict. For    example,                `glo                    bal int * restrict x`   returns                 `CL_KERNE             |
|  `CL_KERNEL_ARG_NAME` |  char\[\]             |  L_ARG_TYPE_RESTRICT`.   Returns the name        specified for the       argument given by     |

`param_value_size_ret`  
Returns the actual size in bytes of data copied to `param_value`. If
`param_value_size_ret` is NULL, it is ignored.

## Notes

Kernel argument information is only available if the program object
associated with `kernel` was created with
[`clCreateProgramWithSource`](clCreateProgramWithSource.html) and the
program executable is built with the -cl-kernel-arg-info option
specified in `options` argument to
[`clBuildProgram`](clBuildProgram.html) or
[`clCompileProgram`](clCompileProgram.html).

## Errors

Returns `CL_SUCCESS` if the function is executed successfully.
Otherwise, it returns one of the following errors:

-   `CL_INVALID_ARG_INDEX` if `arg_indx` is not a valid argument index.

-   `CL_INVALID_VALUE` if `param_name` is not valid, or if size in bytes
    specified by `param_value_size` is &lt; size of return type as
    described in the table above and `param_value` is not NULL

-   `CL_KERNEL_ARG_INFO_NOT_AVAILABLE` if the argument information is
    not available for kernel.

-   `CL_INVALID_KERNEL` if `kernel` is not a valid kernel object.

## Also see

[`clCreateKernel`](clCreateKernel.html),
[`clGetKernelInfo`](clGetKernelInfo.html),
[`clCreateKernelsInProgram`](clCreateKernelsInProgram.html),
[`clCreateProgramWithSource`](clCreateProgramWithSource.html),
[`clBuildProgram`](clBuildProgram.html),
[`clSetKernelArg`](clSetKernelArg.html),
[`clGetKernelWorkGroupInfo`](clGetKernelWorkGroupInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
238](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=238)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
