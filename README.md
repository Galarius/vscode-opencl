# OpenCL for Visual Studio Code

[![Install Count](https://vsmarketplacebadges.dev/installs-short/galarius.vscode-opencl.png)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/galarius.vscode-opencl.png)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Rating](https://vsmarketplacebadges.dev/rating-star/galarius.vscode-opencl.png)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)

This extension adds [OpenCL C/C++](https://en.wikipedia.org/wiki/OpenCL) language support to [VS Code](https://code.visualstudio.com).

## Features

* Auto Completion of Built-in OpenCL Symbols
* Built-in OpenCL API Reference
* Code Snippets
* Kernel Diagnostics
* Kernel Formatting
* Offline Kernel Compilation
* OpenCL C/C++ Syntax Highlighting
* OpenCL Compute Kernel Support (`*.cl`, `*.ocl`)
* OpenCL Devices Information

## Prerequisites

| Feature | Requirements |
| ------- | ------------ |
| `Kernel Diagnostics` | OpenCL Runtime [[Intel](https://software.intel.com/en-us/articles/opencl-drivers), [NVidia](http://www.nvidia.com/Download/index.aspx), [AMD](http://support.amd.com/en-us/download)] |
| `OpenCL Devices Information` | OpenCL Runtime [[Intel](https://software.intel.com/en-us/articles/opencl-drivers), [NVidia](http://www.nvidia.com/Download/index.aspx), [AMD](http://support.amd.com/en-us/download)] |
| `Offline Kernel Compilation` | [Intel® SDK for OpenCL™ 2019](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux] or `OpenCL.framework` [macOS] (shipped with XCode) |
| `Kernel Formatting` | Formatting feature requires [`clang-format`](https://clang.llvm.org/docs/ClangFormat.html). By default, the extension searches for the utility inside [ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension. |

---

## Configuration

| Setting | Description |
| ------- | ------------ |
| Kernel Diagnostics |
| `OpenCL.server.enable` | Enables OpenCL Language Server. |
| `OpenCL.server.buildOptions` | Build options to be used for building the program. The list of [supported](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clBuildProgram.html) build options. |
| `OpenCL.server.deviceID` | ID or 0 (automatic selection) of the OpenCL device to be used for diagnostics. Use the `OpenCL: Select` command or the `OpenCL Devices` explorer actions to specify the identifier. |
| `OpenCL.server.maxNumberOfProblems` | Controls the maximum number of problems produced by the server. |
| `opencl.trace.server` | Traces the communication between VS Code and the OpenCL language server. |
| OpenCL Devices Information | |
| `OpenCL.explorer.localizedProperties` | Show localized properties of OpenCL devices in the explorer view (uncheck to show raw OpenCL properties). |
| Kernel Formatting | |
| `OpenCL.formatting.name` | Default formatting utility is 'clang-format', which is shipped with [ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension. Specify an absolute path to use another version of `clang-format`. |

---

## Commands

| Command | Description |
| ------- | ----------- |
| `OpenCL: Info` | This command opens a new VS Code tab filled with the information about available OpenCL devices |
| `OpenCL: Select` | Select the OpenCL device for diagnostics |
| `OpenCL: Toggle View` | OpenCL: Toggle the explorer view (localized or raw properties) |

---

## Offline Kernel Compilation

This extension provides predefined set of VS Code tasks for kernel compilation using `ioc32/ioc64` or `openclc` (on macOS).

See [TASKS.md](https://github.com/Galarius/vscode-opencl/blob/master/TASKS.md) for details.

See [FAQ.md](https://github.com/Galarius/vscode-opencl/blob/master/FAQ.md) for known issues.

---

## Contributing

[Contributing Guide](https://github.com/Galarius/vscode-opencl/blob/master/CONTRIBUTING.md)

## Change Log

[OpenCL for VS Code Change Log](https://marketplace.visualstudio.com/items/galarius.vscode-opencl/changelog)

## License

[MIT License](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/LICENSE.txt)

## Disclaimer

OpenCL is the trademark of Apple Inc.
