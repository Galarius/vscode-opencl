
## Parameters

`in_device`  
The device to be partitioned.

`properties`  
Specifies how `in_device` is to be partition described by a partition
name and its corresponding value. Each partition name is immediately
followed by the corresponding desired value. The list is terminated with
0. The list of supported partitioning schemes is described in the table
below. Only one of the listed partitioning schemes can be specified in
`properties`.

| cl\_device\_partition\_property   | Description                       |
| --- | --- |
|  enum (Partition value)              CL\_DEVICE\_PARTITION\_EQUALLY      (unsigned int)                    |  Split the aggregate device into     as many smaller aggregate devices   as can be created, each             containing n compute units. The     value n is passed as the value      accompanying this property. If n    does not divide evenly into         `CL_DEV                             ICE_PARTITION_MAX_COMPUTE_UNITS`,   then the remaining compute units  |
|  CL\_DEVICE\_PARTITION\_BY\_COUNTS   (unsigned int)                    |  are not used.                       This property is followed by a      `CL_DEV                             ICE_PARTITION_BY_COUNTS_LIST_END`   terminated list of compute unit     counts. For each nonzero count m    in the list, a sub-device is        created with m compute units in     it.                                 `CL_DEV                             ICE_PARTITION_BY_COUNTS_LIST_END`   is defined to be 0.                 The number of non-zero count        entries in the list may not         exceed                              `CL_D                               EVICE_PARTITION_MAX_SUB_DEVICES`.   The total number of compute units   specified may not exceed            `CL_DEV                           |
|  CL\_DEVICE\_PARTITION\_BY\_-        AFFINITY\_DOMAIN                    (cl\_device\_affinity\_domain)    |  ICE_PARTITION_MAX_COMPUTE_UNITS`.   Split the device into smaller       aggregate devices containing one    or more compute units that all      share part of a cache hierarchy.    The value accompanying this         property may be drawn from the      following list:                     `                                   CL_DEVICE_AFFINITY_DOMAIN_NUMA` -   Split the device into sub-devices   comprised of compute units that     share a NUMA node.                  `CL_D                               EVICE_AFFINITY_DOMAIN_L4_CACHE` -   Split the device into sub-devices   comprised of compute units that     share a level 4 data cache.         `CL_D                               EVICE_AFFINITY_DOMAIN_L3_CACHE` -   Split the device into sub-devices   comprised of compute units that     share a level 3 data cache.         `CL_D                               EVICE_AFFINITY_DOMAIN_L2_CACHE` -   Split the device into sub-devices   comprised of compute units that     share a level 2 data cache.         `CL_D                               EVICE_AFFINITY_DOMAIN_L1_CACHE` -   Split the device into sub-devices   comprised of compute units that     share a level 1 data cache.         `CL_DEVICE_AFFI                     NITY_DOMAIN_NEXT_PARTITIONABLE` -   Split the device along the next     partitionable affinity domain.      The implementation shall find the   first level along which the         device or sub-device may be         further subdivided in the order     NUMA, L4, L3, L2, L1, and           partition the device into           sub-devices comprised of compute    units that share memory             subsystems at this level.           The user may determine what         happened by calling                 [`clGetD                            eviceInfo`](clGetDeviceInfo.html)   (`CL_DEVICE_PARTITION_TYPE`) on   |

`num_devices`  
Size of memory pointed to by `out_devices` specified as the number of
`cl_device_id` entries.

`out_devices`  
The buffer where the OpenCL sub-devices will be returned. If
`out_devices` is NULL, this argument is ignored. If `out_devices` is not
NULL, `num_devices` must be greater than or equal to the number of
sub-devices that `device` may be partitioned into according to the
partitioning scheme specified in `properties`.

`num_devices_ret`  
Returns the number of sub-devices that device may be partitioned into
according to the partitioning scheme specified in `properties`. If
`num_devices_ret` is NULL, it is ignored.

## Notes

Creates an array of sub-devices that each reference a non-intersecting
set of compute units within `in_device`, according to a partition scheme
given by `properties`. The output sub-devices may be used in every way
that the root (or parent) device can be used, including creating
contexts, building programs, further calls to `clCreateSubDevices` and
creating command-queues. When a command-queue is created against a
sub-device, the commands enqueued on the queue are executed only on the
sub-device.

## Errors

Returns `CL_SUCCESS` if the partition is created successfully.
Otherwise, it returns a NULL value with the following error values
returned in `errcode_ret`:

-   `CL_INVALID_DEVICE` if `in_device` is not valid.

-   `CL_INVALID_VALUE` if values specified in `properties` are not valid
    or if values specified in `properties` are valid but not supported
    by the device.

-   `CL_INVALID_VALUE` if `out_devices` is not NULL and `num_devices` is
    less than the number of sub-devices created by the partition scheme.

-   `CL_DEVICE_PARTITION_FAILED` if the partition name is supported by
    the implementation but `in_device` could not be further partitioned.

-   `CL_INVALID_DEVICE_PARTITION_COUNT` if the partition name specified
    in `properties` is `CL_DEVICE_PARTITION_BY_COUNTS` and the number of
    sub-devices requested exceeds `CL_DEVICE_PARTITION_MAX_SUB_DEVICES`
    or the total number of compute units requested exceeds
    `CL_DEVICE_PARTITION_MAX_COMPUTE_UNITS` for `in_device`, or the
    number of compute units requested for one or more sub-devices is
    less than zero or the number of sub-devices requested exceeds
    `CL_DEVICE_PARTITION_MAX_COMPUTE_UNITS` for `in_device`.

-   `CL_OUT_OF_RESOURCES` if there is a failure to allocate resources
    required by the OpenCL implementation on the device.

-   `CL_OUT_OF_HOST_MEMORY` if there is a failure to allocate resources
    required by the OpenCL implementation on the host.

## Example

A few examples that describe how to specify partition properties in
`properties` argument to `clCreateSubDevices` are given below.

To partition a device containing 16 compute units into two sub-devices,
each containing 8 compute units, pass the following in `properties`:

        { CL_DEVICE_PARTITION_EQUALLY, 8, 0 }

To partition a device with four compute units into two sub-devices with
one sub-device containing 3 compute units and the other sub-device 1
compute unit, pass the following in `properties` argument:

        { CL_DEVICE_PARTITION_BY_COUNTS,
          3, 1, CL_DEVICE_PARTITION_BY_COUNTS_LIST_END, 0 }

To split a device along the outermost cache line (if any), pass the
following in `properties` argument:

        { CL_DEVICE_PARTITION_BY_AFFINITY_DOMAIN,
          CL_DEVICE_AFFINITY_DOMAIN_NEXT_PARTITIONABLE, 0 }

## Also see

[`clGetDeviceInfo`](clGetDeviceInfo.html)

## Specification

[OpenCL 2.1 API Specification, page
85](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=85)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
