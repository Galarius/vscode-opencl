
## Description

The `atomic_init` function non-atomically initializes the atomic object
pointed to by `obj` to the value `value`.

In these operation definitions:

-   An `A` refers to one of the atomic types.

-   A `C` refers to its corresponding non-atomic type.

-   An `M` refers to the type of the other argument for arithmetic
    operations. For atomic integer types, `M` is `C`.

-   The functions not ending in explicit have the same semantics as the
    corresponding explicit function with `memory_order_seq_cst` for the
    `memory_order` argument.

-   The functions that do not have `memory_scope` argument have the same
    semantics as the corresponding functions with the `memory_scope`
    argument set to `memory_scope_device`.

|   |   |
---|---|
|  Note                              |  With fine-grained system SVM,       sharing happens at the              granularity of individual loads     and stores anywhere in host         memory. Memory consistency is       always guaranteed at                synchronization points, but to      obtain finer control over           consistency, the OpenCL atomics     functions may be used to ensure     that the updates to individual      data values made by one unit of     execution are visible to other      execution units. In particular,     when a host thread needs fine       control over the consistency of     memory that is shared with one or   more OpenCL devices, it must use    atomic and fence operations that    are compatible with the C11         atomic operations.                |

We can’t require C11 atomics since host programs can be implemented in
other programming languages and versions of C or C++, but we do require
that the host programs use atomics and that those atomics be compatible
with those in C11.

Restrictions

All operations on atomic types must be performed using the built-in
atomic functions. C11 and C++11 support operators on atomic types.
OpenCL C does not support operators with atomic types. Using atomic
types with operators should result in a compilation error.

The `atomic_bool`, `atomic_char`, `atomic_uchar`, `atomic_short`,
`atomic_ushort`, `atomic_intmax_t` and `atomic_uintmax_t` types are not
supported by OpenCL C.

OpenCL C requires that the built-in atomic functions on atomic types are
lock-free.

The `_Atomic` type specifier and `_Atomic` type qualifier are not
supported by OpenCL C.

The behavior of atomic operations where pointer arguments to the atomic
functions refers to an atomic type in the private address space is
undefined.

## Example

        local atomic_int local_guide;
        if (get_local_id(0) == 0)
           atomic_init(&guide, 42);
        work_group_barrier(CLK_LOCAL_MEM_FENCE);

## Also see

[Atomic Functions](atomicFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
104](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=104)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
