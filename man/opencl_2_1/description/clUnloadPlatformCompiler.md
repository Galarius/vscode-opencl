
## Notes

This is a hint from the application and does not guarantee that the
compiler will not be used in the future or that the compiler will
actually be unloaded by the implementation. Calls to
[`clBuildProgram`](clBuildProgram.html),
[`clCompileProgram`](clCompileProgram.html), or
[`clLinkProgram`](clLinkProgram.html) after `clUnloadPlatformCompiler`
will reload the compiler, if necessary, to build the appropriate program
executable.

## Errors

`clUnloadPlatformCompiler` returns `CL_SUCCESS` if the function is
executed successfully. Otherwise, it returns one of the following
errors:

-   `CL_INVALID_PLATFORM` if `platform` is not a valid platform.

## Specification

[OpenCL 2.1 API Specification, page
213](https://www.khronos.org/registry/cl/specs/opencl-2.1.pdf#page=213)

## Copyright

[Copyright © 2007-2017 The Khronos Group Inc.](copyright.html)
