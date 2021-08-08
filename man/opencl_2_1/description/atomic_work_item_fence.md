
## Parameters

`flags`  
Must be set to `CLK_GLOBAL_MEM_FENCE`, `CLK_LOCAL_MEM_FENCE`,
`CLK_IMAGE_MEM_FENCE` or a combination of these values ORed together;
otherwise the behavior is undefined. The behavior of calling
`atomic_work_item_fence` with `CLK_IMAGE_MEM_FENCE` ORed together with
either `CLK_GLOBAL_MEM_FENCE` or `CLK_LOCAL_MEM_FENCE` is equivalent to
calling `atomic_work_item_fence` individually for `CLK_IMAGE_MEM_FENCE`
and the other flags. Passing both `CLK_GLOBAL_MEM_FENCE` and
`CLK_LOCAL_MEM_FENCE` to `atomic_work_item_fence` will synchronize
memory operations to both local and global memory through some shared
atomic action, as described in section 3.3.6.2 of the OpenCL API
specficiation.

`order`  
`scope`  
== Description

Depending on the value of order, this operation:

-   has no effects, if `order` == `memory_order_relaxed`.

-   is an acquire fence, if `order` == `memory_order_acquire`.

-   is a release fence, if `order` == `memory_order_release`.

-   is both an acquire fence and a release fence, if `order` ==
    `memory_order_acq_rel`.

-   is a sequentially consistent acquire and release fence, if `order`
    == `memory_order_seq_cst`.

For images declared with the `read_write` qualifier, the
`atomic_work_item_fence` must be called to make sure that writes to the
image by a work-item become visible to that workitem on subsequent reads
to that image by that work-item.

## Also see

[Atomic Functions](atomicFunctions.html)

## Specification

[OpenCL 2.0 C Language Specification, page
105](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=105)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
