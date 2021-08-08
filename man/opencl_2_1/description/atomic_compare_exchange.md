
## Parameters

`object`  
`expected`  
`desired`  
`success`  
`failure`  
The `failure` argument shall not be `memory_order_release` nor
`memory_order_acq_rel`.

`scope`  
== Description

These functions can only be used with an object of any atomic integer
type.

The `failure` argument shall be no stronger than the `success` argument.
Atomically, compares the value pointed to by `object` for equality with
that in `expected`, and if true, replaces the value pointed to by
`object` with `desired`, and if false, updates the value in `expected`
with the value pointed to by `object`. Further, if the comparison is
true, memory is affected according to the value of `success`, and if the
comparison is false, memory is affected according to the value of
`failure`. These operations are atomic read-modify-write operations (as
defined by section 5.1.2.4 of the C11 specification).

|   |   |
---|---|
|  Note                              |  The effect of the                   compare-and-exchange operations     is:                               |

    if (memcmp(object, expected, sizeof(*object) == 0)
         memcpy(object, &desired, sizeof(*object));
    else
         memcpy(expected, object, sizeof(*object));

The weak compare-and-exchange operations may fail spuriously. That is,
even when the contents of memory referred to by `expected` and `object`
are equal, it may return zero and store back to `expected` the same
memory contents that were originally there. This spurious failure
enables implementation of compare-and-exchange on a broader class of
machines, e.g. load-locked store-conditional machines.

These generic functions return the result of the comparison.

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

## Also see

[Atomic Functions](atomicFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
108](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=108)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
