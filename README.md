# OpenCL for Visual Studio Code

This extension adds [OpenCL C/C++](https://en.wikipedia.org/wiki/OpenCL) language support to [VS Code](https://code.visualstudio.com).

## Features

- Kernel Diagnostics ¹
- Code Completion ¹
- OpenCL Devices Information ¹
- Built-in OpenCL API Reference
- Code Snippets
- Kernel Formatting
- OpenCL C/C++ Syntax Highlighting
- OpenCL Compute Kernel Support (`*.cl`, `*.ocl`)
- Offline Kernel Compilation

> ¹ Powered by [opencl-language-server](https://github.com/Galarius/opencl-language-server).

## Getting Started

1. Install [OpenCL Language Server](https://github.com/Galarius/opencl-language-server#prerequisites) prerequisities:  

    1.1. OpenCL Runtime [[Intel](https://software.intel.com/en-us/articles/opencl-drivers), [NVidia](http://www.nvidia.com/Download/index.aspx), [AMD](http://support.amd.com/en-us/download)]  

    1.2. [**Windows**] [Latest Microsoft Visual C++ Redistributable Version ](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170) 

2. **Offline Kernel Compilation** feature requires OpenCL SDK:  

    a. [**Windows, Linux**]: `ioc64` from [Intel® SDK for OpenCL™ 2019](https://software.intel.com/en-us/articles/opencl-drivers)

    (*On macOS `openclc` is preinstalled at `/System/Library/Frameworks/OpenCL.framework/Libraries/openclc`*)

3. **Kernel Formatting** feature requires [`clang-format`](https://clang.llvm.org/docs/ClangFormat.html). By default, the extension searches for the utility inside [ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension.

4. Install the extension following instructions in [INSTALL.md](https://github.com/Galarius/vscode-opencl/blob/master/INSTALL.md).

5. Open any `.cl` or `.ocl` file, the extension will download the compatible version of [OpenCL Language Server](https://github.com/Galarius/opencl-language-server/releases).

6. If activation succeeds, syntax highlighting is enabled, the OpenCL Devices explorer view appears, and no error notification is shown from the OpenCL Language Server. See [TROUBLESHOOTING.md](https://github.com/Galarius/vscode-opencl/blob/master/TROUBLESHOOTING.md) if extension activation failed.

---

## Configuration

| Setting | Description | Default |
| ------- | ----------- | ------- |
| `OpenCL.server.enable` | Enables the OpenCL Language Server. Disabling this turns off Kernel Diagnostics, Code Completion, and OpenCL Devices Information. | `true` |
| `OpenCL.server.path` | Path to a local OpenCL language server binary. When set, the extension skips automatic download and uses this binary directly. The binary must be [compatible](https://github.com/Galarius/opencl-language-server/releases) with the extension version. Use the **OpenCL: Register Local Language Server** command to set this safely - the extension registers the binary to perform integrity checks later. | `""` |
| **Kernel Diagnostics** | | |
| `OpenCL.server.buildOptions` | Build options passed when building the program. See the list of [supported options](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clBuildProgram.html). | `[]` |
| `OpenCL.server.deviceID` | Device ID of the OpenCL device used for diagnostics, or `0` for automatic selection. Use the `OpenCL: Select` command or the OpenCL Devices explorer to set this. | `0` |
| `OpenCL.server.maxNumberOfProblems` | Maximum number of problems reported by the language server. | `100` |
| `opencl.trace.server` | Traces the communication between VS Code and the OpenCL language server. Useful for debugging. | `"off"` |
| **OpenCL Devices Information** | | |
| `OpenCL.explorer.localizedProperties` | Display localized property names in the explorer view. Disable to show raw OpenCL property names instead. | `true` |
| **Kernel Formatting** | | |
| `OpenCL.formatting.name` | Formatting utility to use. Defaults to `clang-format` from the [ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) extension. Specify an absolute path to use a different version. | `"clang-format"` |
 

---

## Commands

| Command | Description |
| ------- | ----------- |
| `OpenCL: Info` | Opens a new tab with information about all available OpenCL devices. |
| `OpenCL: Select` | Select the OpenCL device to use for kernel diagnostics. |
| `OpenCL: Toggle View` | Toggle the explorer view between localized and raw property names. |
| `OpenCL: Register Local Language Server` | Register a user-specified local binary as the OpenCL language server. Use this when GitHub.com is unavailable or a prebuilt binary is missing for your platform. |
| `OpenCL: Unregister Local Language Server` | Remove a previously registered local binary. The extension will revert to automatically downloading the language server from GitHub.com. |

---

## Offline Kernel Compilation

This extension provides predefined set of VS Code tasks for kernel compilation using `ioc32/ioc64` or `openclc` (on macOS).

See [TASKS.md](https://github.com/Galarius/vscode-opencl/blob/master/TASKS.md) for details.

---

## Development

See [development notes](https://github.com/Galarius/vscode-opencl/blob/master/DEV.md).

## Contributing

[Contributing Guide](https://github.com/Galarius/vscode-opencl/blob/master/CONTRIBUTING.md)

## Change Log

[OpenCL for VS Code Change Log](https://marketplace.visualstudio.com/items/galarius.vscode-opencl/changelog)

## License

[MIT License](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/LICENSE.txt)

## Disclaimer

OpenCL is the trademark of Apple Inc.
