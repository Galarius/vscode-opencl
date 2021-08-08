
## Description

The built-in function `barrier` has been renamed `work_group_barrier`.
For backward compatibility, `barrier` is also supported.

All work-items in a work-group executing the kernel on a processor must
execute this function before any are allowed to continue execution
beyond the `work_group_barrier`. This function must be encountered by
all work-items in a work-group executing the kernel. These rules apply
to ND-ranges implemented with uniform and non-uniform work-groups.

If `work_group_barrier` is inside a conditional statement, then all
work-items must enter the conditional if any work-item enters the
conditional statement and executes the `work_group_barrier`.

If `work_group_barrier` is inside a loop, all work-items must execute
the `work_group_barrier` for each iteration of the loop before any are
allowed to continue execution beyond the `work_group_barrier`.

The `work_group_barrier` function also supports a variant that specifies
the memory scope. For the `work_group_barrier` variant that does not
take a memory scope, the `scope` is `memory_scope_work_group`.

The `scope` argument specifies whether the memory accesses of work-items
in the work-group to memory address space(s) identified by `flags`
become visible to all work-items in the work-group, the device or all
SVM devices.

The `work_group_barrier` function can also be used to specify which
memory operations i.e. to global memory, local memory or images become
visible to the appropriate memory scope identified by `scope`. The
`flags` argument specifies the memory address spaces and can be set to 0
or a combination of the following values ORed together. When these flags
are OR’ed together the `work_group_barrier` acts as a combined barrier
for all address spaces specified by the flags ordering memory accesses
both within and across the specified address spaces.

`CLK_LOCAL_MEM_FENCE` - The `work_group_barrier` function will ensure
that all local memory accesses become visible to all workitems in the
work-group. Note that the value of `scope` is ignored as the memory
scope is always `memory_scope_work_group`.

`CLK_GLOBAL_MEM_FENCE` – The `work_group_barrier` function ensure that
all global memory accesses become visible to the appropriate scope as
given by `scope`.

`CLK_IMAGE_MEM_FENCE` – The `work_group_barrier` function will ensure
that all image memory accesses become visible to the appropriate scope
as given by `scope`. The value of `scope` must be
`memory_scope_work_group` or `memory_scope_device`.

The values of `flags` and `scope` must be the same for all work-items in
the work-group.

## Specification

[OpenCL 2.0 C Language Specification, page
97](https://www.khronos.org/registry/cl/specs/opencl-2.0-openclc.pdf#page=97)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
