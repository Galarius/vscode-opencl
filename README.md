# OpenCL for Visual Studio Code

![](https://raw.githubusercontent.com/Galarius/vscode-opencl/feature/taskProvider/images/kernel.png)[![Current Version](https://vsmarketplacebadge.apphb.com/version-short/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Install Count](https://vsmarketplacebadge.apphb.com/installs/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)

This extension adds OpenCL C/C++ language support to [VS Code](https://code.visualstudio.com).

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

* OpenCL Drivers [[Intel](https://software.intel.com/en-us/articles/opencl-drivers), [NVidia](http://www.nvidia.com/Download/index.aspx), [AMD](http://support.amd.com/en-us/download)]
* [Intel OpenCL SDK](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux]
* OpenCL.framework [macOS, shipped with XCode]

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

The extension uses a set of tools to provide offline compilation and OpenCL devices/platforms information. By default `ioc32/ioc64` offline compiler is used on `Linux` and `Windows` and `openclc` is used on `macOS`. This requires [Intel OpenCL SDK](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux] to be installed on the system. For macOS `openclc` should be a part of `OpenCL.framework` (shipped with XCode). It is possible to customize command and arguments (see [Offline Kernel Compilation](#offline-kernel-compilation) for details).

## Offline Kernel Compilation

This extension provides predefined set of VS Code tasks for kernel compilation using `ioc32/ioc64` or `openclc` (on macOS). To run compilation/build task:

### Run Predefined Task

1. Press `Tasks > Run Task...` (fig. 1)

    ![fig 1](https://raw.githubusercontent.com/Galarius/vscode-opencl/feature/taskProvider/images/vscode-opencl-clc-1.png)

    *Figure 1. Tasks menu.*

2. Press `Run Task...` and select one of the predefined `opencl` tasks for file `kernel.cl`. The set of tasks (fig. 2) is generated for each kernel file that was found in the current workspace.

    ![fig 2](https://raw.githubusercontent.com/Galarius/vscode-opencl/feature/taskProvider/images/vscode-opencl-clc-2.png)

    *Figure 2. Predefined Tasks for `ioc64` compiler.*

### Configure Default Build Task

Press `Tasks > Configure Default Build Task...`. Select one of the predefined `opencl` tasks. File `tasks.json` will be created (or extended) with configuration of the selected task (fig. 3). Press `Ctrl+Shift+B` to call it with the shortcut.

![fig 3](https://raw.githubusercontent.com/Galarius/vscode-opencl/feature/taskProvider/images/vscode-opencl-clc-3.png)

*Figure 3. Default Build Task Configuration.*

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

This code will execute `malisc --name kernelName kernel.cl` on `Ctrl+Shift+B` press. Field `problemMatcher` is also customized to parse error/warning messages generated by `malisc` e.g.:

```
ERROR: <source>:56:25: error: used type 'float' where floating point type is not allowed
                        float cN = eval_func ? exponential(abs(deltaN), thresh)
                                   ~~~~~~~~~ ^
```

Customized tasks can also be bound to a custom shortcuts (See [Binding keyboard shortcuts to tasks](https://code.visualstudio.com/Docs/editor/tasks#_binding-keyboard-shortcuts-to-tasks)).

## Formatting Configuration

* `opencl.formatting.enabled` - Enable / Disable code formatting for OpenCL (Restart is required);
* `opencl.formatting.name` - The file name of the formatting utility (Should be available at `$PATH`, otherwise specify full file name);
* `opencl.formatting.args` - An array of command line options.
[AStyle](http://astyle.sourceforge.net) formatting utility is used by default. If workspace contains AStyle configuration file `.astylerc`, add `--options=${workspaceRoot}/.astylerc` option to `opencl.formatting.args` in a workspace configuration.

## Commands

1. Press `Ctrl+Shift+P` or `Cmd+Shift+P`
2. Type `OpenCL: Info`

This command will produce a file `oclinfo.txt` with information about available OpenCL platforms/devices.

## Contributing

[Contributing Guide](https://github.com/Galarius/vscode-opencl/blob/master/CONTRIBUTING.md)

## Change Log

[OpenCL for VS Code Change Log](https://marketplace.visualstudio.com/items/galarius.vscode-opencl/changelog)

## License

[MIT License](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/LICENSE.txt)