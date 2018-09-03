# OpenCL for Visual Studio Code

![](https://github.com/Galarius/vscode-opencl/blob/master/images/kernel.png)[![Current Version](https://vsmarketplacebadge.apphb.com/version-short/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Install Count](https://vsmarketplacebadge.apphb.com/installs/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)

This extension adds OpenCL C/C++ language support to [VS Code](https://code.visualstudio.com).

## Features

* OpenCL Compute Kernel Support [`*.cl`, `*.ocl`]
* OpenCL C/C++ Syntax Highlighting
* Auto Completion of Built-in OpenCL Symbols
* Offline Kernel Compilation
* Code Snippets ([details](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/snippets/code.snippets.progress.md))
* Support for External Code Formatters (e.g. [AStyle](http://astyle.sourceforge.net))
* OpenCL Platforms & Devices Info

## Prerequisites

* OpenCL Drivers [[Intel](https://software.intel.com/en-us/articles/opencl-drivers), [NVidia](http://www.nvidia.com/Download/index.aspx), [AMD](http://support.amd.com/en-us/download)]
* [Intel OpenCL SDK](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux]
* OpenCL.framework [macOS]

## How to use this extension?

Install and open [VS Code](https://code.visualstudio.com). Press `Ctrl+Shift+X` or `Cmd+Shift+X` to open the Extensions pane. Find and install the `OpenCL` extension. You can also install the extension from the Marketplace ([Installation Guide](https://github.com/Galarius/vscode-opencl/blob/master/INSTALL.md)). Open any `.cl` or `.ocl` file in VS Code to activate syntax highlighting, auto-completion, code snippets and document formatting for OpenCL kernel files. Open any file associated with `C` or `C++` language in VS Code to activate code snippets for OpenCL host device functions.

The extension uses a set of tools to provide offline compilation and OpenCL devices/platforms information. By default `ioc32/ioc64` offline compiler is used on `Linux` and `Windows` and `openclc` is used on `macOS`. This requires [Intel OpenCL SDK](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux] to be installed on the system. For macOS `openclc` should be a part of `OpenCL.framework`. It is possible to customize command and arguments (see [Offline Kernel Compilation](#offline-kernel-compilation) for details).


## Offline Compilation

## Formatting Configuration

* `opencl.formatting.enabled` - Enable / Disable code formatting for OpenCL (Restart is required);
* `opencl.formatting.name` - The file name of the formatting utility (Should be available at `$PATH`, otherwise specify full file name);
* `opencl.formatting.args` - An array of command line options.
[AStyle](http://astyle.sourceforge.net) formatting utility is used by default. If workspace contains AStyle configuration file `.astylerc`, add `--options=${workspaceRoot}/.astylerc` option to `opencl.formatting.args` in a workspace configuration.

## Commands

1. Press `Ctrl+Shift+P` or `Cmd+Shift+P`
2. Type `OpenCL: Info`

## Contributing

[Contributing Guide](https://github.com/Galarius/vscode-opencl/blob/master/CONTRIBUTING.md)

## Change Log

[OpenCL for VS Code Change Log](https://marketplace.visualstudio.com/items/galarius.vscode-opencl/changelog)

## License

[MIT License](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/LICENSE.txt)