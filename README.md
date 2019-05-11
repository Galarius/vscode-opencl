# OpenCL for Visual Studio Code

![](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/kernel.png)[![Current Version](https://vsmarketplacebadge.apphb.com/version-short/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Install Count](https://vsmarketplacebadge.apphb.com/installs/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)

This extension adds [OpenCL C/C++](https://en.wikipedia.org/wiki/OpenCL) language support to [VS Code](https://code.visualstudio.com).

## Features

* OpenCL Compute Kernel Support [`*.cl`, `*.ocl`]
* OpenCL C/C++ Syntax Highlighting
* Auto Completion of Built-in OpenCL Symbols
* Offline Kernel Compilation
* Built-in OpenCL API Reference
* Code Snippets ([details](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/snippets/code.snippets.progress.md))
* Support for External Code Formatters (e.g. [AStyle](http://astyle.sourceforge.net))
* OpenCL Platforms & Devices Info

[Features Preview](https://github.com/Galarius/vscode-opencl/blob/master/PREVIEW.md) (GIFs)


## Prerequisites

* Extension [ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)
* OpenCL Drivers [[Intel](https://software.intel.com/en-us/articles/opencl-drivers), [NVidia](http://www.nvidia.com/Download/index.aspx), [AMD](http://support.amd.com/en-us/download)]
* [Intel OpenCL SDK](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux]
or `OpenCL.framework` [macOS] (shipped with XCode)

---

## Content

- [How to use this extension?](#how-to-use-this-extension)
- [Offline Kernel Compilation](#offline-kernel-compilation)
    - [Run Predefined Task](#run-predefined-task)
    - [Configure Default Build Task](#configure-default-build-task)
    - [Customize Build Task](#customize-build-task)
- [Formatting Configuration](#formatting-configuration)
- [Commands](#commands)
- [Contributing](#contributing)
- [Change Log](#change-log)
- [License](#license)

---

## How to use this extension?

Install and open [VS Code](https://code.visualstudio.com). Press `Ctrl+Shift+X` or `Cmd+Shift+X` to open the Extensions pane. Find and install the `OpenCL` extension. You can also install the extension from the Marketplace ([Installation Guide](https://github.com/Galarius/vscode-opencl/blob/master/INSTALL.md)). Open any `.cl` or `.ocl` file in VS Code to activate syntax highlighting, auto-completion, code snippets, API reference tooltips and document formatting for OpenCL kernel files. Open any file associated with `C` or `C++` language in VS Code to activate code snippets for OpenCL host device functions.

The extension uses a set of tools to provide offline compilation and OpenCL devices/platforms information. By default `ioc32/ioc64` offline compiler is used on `Linux` and `Windows` and `openclc` is used on `macOS`. This requires [Intel OpenCL SDK](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux] to be installed on the system. For macOS `openclc` should be a part of `OpenCL.framework` (shipped with XCode). It is possible to use another offline OpenCL compiler (see [Customize Build Task](#customize-build-task) for details).

## Offline Kernel Compilation

This extension provides predefined set of VS Code tasks for kernel compilation using `ioc32/ioc64` or `openclc` (on macOS). To run compilation/build task:

### Run Predefined Task

1. Press `Terminal > Run Task...` (fig. 1)

2. Press `Run Task...` and select one of the predefined `opencl` tasks for file `kernel.cl`. The set of tasks (fig. 2) is generated for each kernel file that was found in the current workspace.

|   |   |
|---|---|
|![fig 1](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-clc-1.png)|![fig 2](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-clc-2.png)|
|*Figure 1. `Terminal` menu.*|*Figure 2. Predefined Tasks for `openclc` compiler.*|

### Configure Default Build Task

Press `Terminal > Configure Default Build Task...`. Select one of the predefined `opencl` tasks. File `tasks.json` will be created (or extended) with configuration of the selected task. Press `Ctrl+Shift+B` to call it with the shortcut.

It is possible to override selected  task definition. **It is important** to change the field `type` of the task from `opencl` to `shell`, otherwise the task will be ignored.

An example of configurable task for an `openclc` offline compiler:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "shell", // replace `opencl` with `shell`
            "label": "opencl: custom build [kernel] {gpu_64}",
            "command": "/System/Library/Frameworks/OpenCL.framework/Libraries/openclc",
            "args": [
                "-emit-llvm",
                "-c",
                "-arch",
                "gpu_64",
                "kernel.cl",
                "-o kernel.gpu_64.bc"
            ],
            "problemMatcher": [
                "$opencl.common",
                "$opencl.openclc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```


### Customize Build Task

Press `Terminal > Configure Tasks...`. Select one of the predefined `opencl` tasks. File `tasks.json` will be created (or extended) with configuration of the selected task.

**It is important** to change the field `type` of a task from `opencl` to `shell`, otherwise the task will be ignored. Fields `command` and `args` may be overridden for using another compiler. Field `label` is a displayed task name. `problemMatcher` should be overridden to match a compiler's errors and warnings so messages could be displayed in `Problems` view.

An example of modified `tasks.json` configuration file for using [AMD Mali](https://developer.arm.com/products/software-development-tools/graphics-development-tools/mali-offline-compiler) as OpenCL offline compiler:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "shell",
            "label": "opencl: malisc compile",
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

This code will execute `malisc --name kernelName kernel.cl` on `Ctrl+Shift+B` press. Field `problemMatcher` is also customized to parse error/warning messages generated by `malisc` e.g.:

```
ERROR: <source>:56:25: error: used type 'float' where floating point type is not allowed
                        float cN = eval_func ? exponential(abs(deltaN), thresh)
                                   ~~~~~~~~~ ^
```

Customized tasks can also be bound to a custom shortcuts (See [Binding keyboard shortcuts to tasks](https://code.visualstudio.com/Docs/editor/tasks#_binding-keyboard-shortcuts-to-tasks)).

## Formatting Configuration

* `opencl.formatting.name` - The file name of the formatting utility. Should be available at `$PATH`, otherwise specify the full file name. Default value is `clang-format` which is shipped with `ms-vscode.cpptools` extension.

* `opencl.formatting.options` - Command line arguments for a formatting utility. **Options are ommited if default 'clang-format' utility is used**. In this case create `.clang-format` file in the root of the project to override default options. If other utility is specified (e.g. `astyle`) provide a list of arguments. Use variable `${workspaceRoot}` to specify configuration file in a workspace (e.g. `--options=${workspaceRoot}/.astylerc` for Artistic Style).

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