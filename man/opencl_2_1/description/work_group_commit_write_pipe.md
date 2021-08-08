
## Description

Indicates that all writes to `num_packets` associated with reservation
`reserve_id` are completed.

This built-in function must be encountered by all work-items in a
work-group executing the kernel with the same argument values; otherwise
the behavior is undefined.

We use the generic type name gentype to indicate the built-in OpenCL C
scalar or vector integer or floating-point data types or any user
defined type built from these scalar and vector data types can be used
as the type for the arguments to the pipe functions listed in this
section. The half scalar and vector types can only be used if the
[`cl_khr_fp16`](cl_khr_fp16.html) extension is supported. The `double`
scalar and vector types can only be used if double precision is
supported.

General information about pipes

A pipe is identified by specifying the `pipe` keyword with a type. The
data type specifies the size of each packet in the pipe. The `pipe`
keyword is a type modifier. When it is applied to another type `T`, the
result is a pipe type whose elements (or packets) are of type `T`. The
packet type `T` may be any supported OpenCL C scalar and vector integer
or floating-point data types, or a user-defined type built from these
scalar and vector data types.

The [`read_only`](qualifiers.html) (or `read_only`) and
[`write_only`](qualifiers.html) (or `write_only`) qualifiers must be
used with the pipe qualifier when a pipe is a parameter of a kernel or
of a user-defined function to identify if a pipe can be read from or
written to by a kernel and its callees and enqueued child kernels. If no
qualifier is specified, [`read_only`](qualifiers.html) is assumed.

A kernel cannot read from and write to the same pipe object. Using the
[`read_write`](qualifiers.html) (or `__read_write`) qualifier with the
pipe qualifier is a compilation error.

The macro `CLK_NULL_RESERVE_ID` refers to an invalid reservation ID.

|   |   |
---|---|
|  Note                              |  The [`read_pipe`](read_pipe.html)   and                                 [`write_pipe`](write_pipe.html)     functions that take a reservation   ID as an argument can be used to    read from or write to a packet      index. These built-ins can be       used to read from or write to a     packet index one or multiple        times. If a packet index that is    reserved for writing is not         written to using the                [`write_pipe`](write_pipe.html)     function, the contents of that      packet in the pipe are undefined.   [`commit_r                          ead_pipe`](commit_read_pipe.html)   and                                 [`work_group_commit_read_pipe`](    work_group_commit_read_pipe.html)   remove the entries reserved for     reading from the pipe.              [`commit_wri                        te_pipe`](commit_write_pipe.html)   and                                 [`                                  work_group_commit_write_pipe`](#)   ensures that the entries reserved   for writing are all added           in-order as one contiguous set of   packets to the pipe.              |

There can only be `CL_DEVICE_PIPE_MAX_ACTIVE_RESERVATIONS` (refer to the
list of possible values for `parame_name` for
[`clGetDeviceInfo`](clGetDeviceInfo.html)(table 4.3)) reservations
active (i.e. reservation IDs that have been reserved but not committed)
per work-item or work-group for a pipe in a kernel executing on a
device.

Work-item based reservations made by a work-item are ordered in the pipe
as they are ordered in the program. Reservations made by different
work-items that belong to the same work-group can be ordered using the
work-group barrier function. The order of work-item based reservations
that belong to different work-groups is implementation defined.

Work-group based reservations made by a work-group are ordered in the
pipe as they are ordered in the program. The order of work-group based
reservations by different work-groups is implementation defined.

Restrictions

Pipes can only be passed as arguments to a function (including kernel
functions). The C [`operators`](operators.html) (refer to section 6.3 of
the OpenCL 2.0 specification) cannot be used with variables declared
with the `pipe` qualifier.

The `pipe` qualifier cannot be used with variables declared inside a
kernel, a structure or union field, a pointer type, an array, global
variables declared in program scope or the return type of a function.

The following behavior is undefined:

-   A kernel fails to call `reserve_pipe` before calling
    [`read_pipe`](read_pipe.html) or [`write_pipe`](write_pipe.html)
    that take a reservation ID.

-   A kernel calls [`read_pipe`](read_pipe.html),
    [`write_pipe`](write_pipe.html),
    [`commit_read_pipe`](commit_read_pipe.html) or
    [`commit_write_pipe`](commit_write_pipe.html) with an invalid
    reservation ID.

-   A kernel calls [`read_pipe`](read_pipe.html) or
    [`write_pipe`](write_pipe.html) with an valid reservation ID but
    with an `index` that is not a value from 0 …​ `num_packets` - 1
    specified to the corresponding call to `reserve_pipe`.

-   A kernel calls [`read_pipe`](read_pipe.html) or
    [`write_pipe`](write_pipe.html) with a reservation ID that has
    already been committed (i.e. a
    [`commit_read_pipe`](commit_read_pipe.html) or
    [`commit_write_pipe`](commit_write_pipe.html) with this reservation
    ID has already been called).

-   A kernel fails to call [`commit_read_pipe`](commit_read_pipe.html)
    for any reservation ID obtained by a prior call to
    [`reserve_read_pipe`](reserve_read_pipe.html).

-   A kernel fails to call [`commit_write_pipe`](commit_write_pipe.html)
    for any reservation ID obtained by a prior call to
    [`reserve_write_pipe`](reserve_write_pipe.html).

-   The contents of the reserved data packets in the pipe are undefined
    if the kernel does not call [`write_pipe`](write_pipe.html) for all
    entries that were reserved by the corresponding call to
    `reserve_pipe`.

-   Calls to [`read_pipe`](read_pipe.html) that takes a reservation ID
    and [`commit_read_pipe`](commit_read_pipe.html) or
    [`write_pipe`](write_pipe.html) that takes a reservation ID and
    [`commit_write_pipe`](commit_write_pipe.html) for a given
    reservation ID must be called by the same kernel that made the
    reservation using [`reserve_read_pipe`](reserve_read_pipe.html) or
    [`reserve_write_pipe`](reserve_write_pipe.html). The reservation ID
    cannot be passed to another kernel including child kernels.

## Example

In the following example

    kernel void
    foo (read_only pipe fooA_t pipeA,
         write_only pipe fooB_t pipeB)
    {
    ...
    }

`pipeA` is a read-only pipe object, and `pipeB` is a write-only pipe
object.

## Also see

[Pipe Functions](pipeFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
159](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=159)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
