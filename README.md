# OpenCL for Visual Studio Code

[![Current Version](https://vsmarketplacebadge.apphb.com/version-short/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Install Count](https://vsmarketplacebadge.apphb.com/installs/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)

This extension adds:

* Support for file extensions: `.cl` and `.ocl`
* OpenCL C keywords syntax highlighting
* OpenCL C++ keywords syntax highlighting
* Auto-Completion (Built-in OpenCL functions, data types and macros)
* Hover tooltip for OpenCL Runtime
* Code Snippets for some host and device functions ([list of functions](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/snippets/code.snippets.progress.md))
* Command `OpenCL: Info` to show OpenCL platforms/devices info. (`linux` is not supported yet)

|![screen-autocomplete](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-autocomplete.gif)|
|-|
|*Syntax Highlighting, Auto-Completion*|
|![screen-snippet](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-snippet.gif)|
|*Code Snippets*|
|![vscode-opencl-cmd-oclinfo](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-cmd-oclinfo.gif)|
|*OpenCL platforms/devices info*|
|![vscode-opencl-cmd-oclinfo](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-hover.gif)|
|*Hover tooltip for OpenCL Runtime*|
||

## Prerequisites

*[Required]*

* [Visual Studio Code](https://code.visualstudio.com)

*[Optional]*

In order to run command `OpenCL: Info` on Windows:

* Check that you have a device that supports OpenCL 
* Make sure your OpenCL device driver is up to date. You can download drivers manually: [Intel](https://software.intel.com/en-us/articles/opencl-drivers), [NVidia](http://www.nvidia.com/Download/index.aspx), [AMD](http://support.amd.com/en-us/download) 

## How To Install

See [INSTALL.md](https://github.com/Galarius/vscode-opencl/blob/master/INSTALL.md)

## How To Use

* Open any `.cl` or `.ocl` file in VS Code to activate syntax highlighting, auto-completion and code snippets for OpenCL kernel files.

* Open any file associated with `C` or `C++` language in VS Code to activate code snippets for OpenCL functions.

## Contributing

See [CONTRIBUTING.md](https://github.com/Galarius/vscode-opencl/blob/master/CONTRIBUTING.md)

## FAQ

See [FAQ.md](https://github.com/Galarius/vscode-opencl/blob/master/FAQ.md)

## Change Log

See [CHANGELOG.md](https://marketplace.visualstudio.com/items/galarius.vscode-opencl/changelog)

## License

See [LICENSE.txt](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/LICENSE.txt)