
## Parameters

`context`  
A valid OpenCL context used to create the SVM buffer.

`svm_pointer`  
Must be the value returned by a call to [`clSVMAlloc`](clSVMAlloc.html).
If a NULL pointer is passed in `svm_pointer`, no action occurs.

## Notes

Note that `clSVMFree` does not wait for previously enqueued commands
that may be using `svm_pointer` to finish before freeing `svm_pointer`.
It is the responsibility of the application to make sure that enqueued
commands that use `svm_pointer` have finished before freeing
`svm_pointer`. This can be done by enqueuing a blocking operation such
as [`clFinish`](clFinish.html),
[`clWaitForEvents`](clWaitForEvents.html),
[`clEnqueueReadBuffer`](clEnqueueReadBuffer.html) or by registering a
callback with the events associated with enqueued commands and when the
last enqueued comamnd has finished freeing `svm_pointer`.

The behavior of using `svm_pointer` after it has been freed is
undefined. In addition, if a buffer object is created using
[`clCreateBuffer`](clCreateBuffer.html) with `svm_pointer`, the buffer
object must first be released before the `svm_pointer` is freed.

The [`clEnqueueSVMFree`](clEnqueueSVMFree.html) API can also be used to
enqueue a callback to free the shared virtual memory buffer allocated
using [`clSVMAlloc`](clSVMAlloc.html) or a shared system memory pointer.

## Also see

[`clSVMAlloc`](clSVMAlloc.html), [Shared Virtual Memory
Functions](sharedVirtualMemory.html)

## Specification

[OpenCL 2.1 API Specification, page
178](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=178)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
