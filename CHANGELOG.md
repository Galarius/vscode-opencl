# OpenCL for Visual Studio Code Change Log

## Version 0.4.0: August 22, 2018

* Added auto closing pairs (brackets and quotes)

* Added [clinfo](https://github.com/Oblomov/clinfo) binary supporting `OpenCL: Info` command on Linux (*Requirements: OpenCL drivers and runtime libraries*)

* `node-sshpk ` and `url-parse` dependencies were updated due to potential security vulnerability in older versions.

## Version 0.3.0: July 07, 2018

* Added: Support for external formatters (e.g. [AStyle](http://astyle.sourceforge.net))

![vscode-opencl-formatting](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-formatting.gif)

## Version 0.2.1: April 28, 2018

* `Hoek` dependency was updated due to potential security vulnerability in older version.

## Version 0.2.0: March 11, 2018

* Added: Hover tooltip for OpenCL Runtime.
    
    ![vscode-opencl-cmd-oclinfo](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-hover.gif)

* Added: New icon with transparent background.

## Version 0.1.5: January 13, 2018

* Fixed: Types `ushort`, `uint`, `size_t`, `intptr_t`, `uintptr_t` were not highlighted.

## Version 0.1.4: January 2, 2018

`Happy New Year!`

![logo-ny](https://www.dropbox.com/s/yp46odwnkxwxvlq/OpenCL_128x_ny.png?dl=1)

* Fixed: Unsigned types and types with `_t` at the end were not highlighted for some color themes;
* Fixed: `Toggle Line Comment` and `Toggle Block Comment` commands did not work in `*.cl` files.

## Version 0.1.3: October 29, 2017

Added command `OpenCL: Info` to show OpenCL platforms/devices info.

![vscode-opencl-cmd-oclinfo](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-cmd-oclinfo.gif)

*Only Win32 and macOS are supported.*

*Requirements: OpenCL drivers and runtime libraries.*

## Version 0.1.2: October 3, 2017

* Added Code Snippets for host OpenCL functions;
* Added Code Snippets for device OpenCL functions.

## Version 0.1.1: September 30, 2017

* Added Auto-Completion (Words from the document).

## Version 0.1.0: September 27, 2017

* Added Auto-Completion (Built-in OpenCL functions, data types and macros).

## Version 0.0.2: September 27, 2017

* Improving the highlighting of OpenCL data types (In accordance with the built-in rules for C and C++ syntax highlighting).

## Version 0.0.1: September 23, 2017

* `.cl` and `.ocl` file extensions support
* OpenCL C keywords
* OpenCL C++ datatypes
