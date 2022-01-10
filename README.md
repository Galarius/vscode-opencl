# OpenCL for Visual Studio Code

[![Current Version](https://vsmarketplacebadge.apphb.com/version-short/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Install Count](https://vsmarketplacebadge.apphb.com/installs-short/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-star/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)

This extension adds [OpenCL C/C++](https://en.wikipedia.org/wiki/OpenCL) language support to [VS Code](https://code.visualstudio.com).

## Features

* OpenCL Compute Kernel Support [`*.cl`, `*.ocl`]
* OpenCL Language Server
* OpenCL C/C++ Syntax Highlighting
* Offline Kernel Compilation
* Auto Completion of Built-in OpenCL Symbols
* Built-in OpenCL API Reference
* Code Snippets
* Clang-Format Support
* OpenCL Platforms & Devices Info


## Prerequisites

* Formatting feature requires [`clang-format`](https://clang.llvm.org/docs/ClangFormat.html). By default, the extension searches for the utility inside [ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension.

* Offline kernel compilation feature requires [Intel® SDK for OpenCL™ 2019](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux] or `OpenCL.framework` [macOS] (shipped with XCode).

* OpenCL Language Server and `OpenCL: Info` command require OpenCL Runtime [[Intel](https://software.intel.com/en-us/articles/opencl-drivers), [NVidia](http://www.nvidia.com/Download/index.aspx), [AMD](http://support.amd.com/en-us/download)]

---

## Content

- [Language Server](#language-server)
- [Offline Kernel Compilation](#offline-kernel-compilation)
- [Formatting Configuration](#formatting-configuration)
- [Commands](#commands)
- [Contributing](#contributing)
- [Change Log](#change-log)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## Language Server

[opencl-language-server](https://github.com/Galarius/opencl-language-server)

Provides an OpenCL kernel diagnostics.

Language server will automatically select an OpenCL device.

Diagnostics will be published on `*.[o]cl` open/change events.

### Configuration

* `OpenCL.server.enable` - Enables OpenCL Language Server.
* `OpenCL.server.buildOptions` - Build options to be used for building the program. The list of [supported](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clBuildProgram.html) build options.
* `OpenCL.server.maxNumberOfProblems` - Controls the maximum number of problems produced by the server.
* `opencl.trace.server` - Traces the communication between VS Code and the OpenCL language server.

## Offline Kernel Compilation

This extension provides predefined set of VS Code tasks for kernel compilation using `ioc32/ioc64` or `openclc` (on macOS).

See [TASKS.md](https://github.com/Galarius/vscode-opencl/blob/master/TASKS.md) for details.

See [FAQ.md](https://github.com/Galarius/vscode-opencl/blob/master/FAQ.md) for known issues.

## Formatting Configuration

* `OpenCL.formatting.name` - Default formatting utility is 'clang-format', which is shipped with [ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension. Specify an absolute path to use another version of `clang-format`.

## Commands

1. Press `Ctrl+Shift+P` or `Cmd+Shift+P`
2. Type `OpenCL: Info`

This command opens a new VS Code tab filled with information about available OpenCL platforms/devices.

## Contributing

[Contributing Guide](https://github.com/Galarius/vscode-opencl/blob/master/CONTRIBUTING.md)

## Change Log

[OpenCL for VS Code Change Log](https://marketplace.visualstudio.com/items/galarius.vscode-opencl/changelog)

## License

[MIT License](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/LICENSE.txt)

## Disclaimer

OpenCL is the trademark of Apple Inc.
