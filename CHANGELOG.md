# OpenCL for Visual Studio Code Change Log

## Version 0.6.0: May 12, 2019

* Updated: `clang-format` (bundled with `ms-vscode.cpptools`) is a default formatting utility now.
* Updated: Configuration `opencl.formatting.args` was renamed to `opencl.formatting.options`.
* Updated: Command `OpenCL: Info` will not create `oclinfo.txt` file in the project's root. Instead it will just open a new VS Code tab with command's result without saving it to a file.
* Added: Neither `OpenCL: Info` command nor `Format Document` action do not require an open workspace anymore.

## Version 0.5.2: February 16, 2019

* Fixed OpenCL Offline Compiler tasks for the VS Code ^1.31.0.

## Version 0.5.1: December 23, 2018

* Fixed OpenCL tasks for the latest VS Code

* `$ioc` and `$openclc` problem matchers replaced with `$opencl.common` and `$opencl.openclc`

* Optimized task list generation

## Version 0.5.0: September 19, 2018

### Offline OpenCL Kernel Compilation

The extension provides predefined set of VS Code tasks for kernel compilation using `ioc32/ioc64` or `openclc` (on macOS).

### Run Predefined Task

1. Press `Tasks > Run Task...`

2. Press `Run Task...` and select one of the predefined `opencl` tasks for file `kernel.cl`. The set of tasks (fig. 1) is generated for each kernel file that was found in the current workspace.

    ![fig 1](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-clc-2.png)

    *Figure 1. Predefined Tasks for `ioc64` compiler.*

### Customize Build Task

Press `Tasks > Configure Tasks...`. Select one of the predefined `opencl` tasks. File `tasks.json` will be created (or extended) with configuration of the selected task.

You can override `command` and `args` fields to use another compiler. Field `label` is a displayed task name, `problemMatcher` should be overriten to match a compiler's errors and warnings so messages could be displayed in `Problems` view.

An example of modified `tasks.json` configuration file for using [AMD Mali](https://developer.arm.com/products/software-development-tools/graphics-development-tools/mali-offline-compiler) as OpenCL offline compiler:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "shell",
            "label": "opencl: malisc compile",
            "task": "compile",
            "command": "malisc",
            "args": [
                "--name kernelName",
                "kernel.cl"
            ],
            "problemMatcher": [
                {
                    "owner": "opencl",
                    "fileLocation": ["relative", "${workspaceFolder}"],
                    "pattern": {
                        "regexp": "^(ERROR|WARNING): <(.*)>:(\\d+):(\\d+): (error|warning): (.*)$",
                        "file": 2,
                        "line": 3,
                        "column": 4,
                        "severity": 1,
                        "message": 6
                    }
                }
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

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
