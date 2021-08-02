# FAQ

> How to use this extension?

Install and open [VS Code](https://code.visualstudio.com). Press `Ctrl+Shift+X` or `Cmd+Shift+X` to open the Extensions pane. Find and install the `OpenCL` extension. You can also install the extension from the Marketplace ([Installation Guide](https://github.com/Galarius/vscode-opencl/blob/master/INSTALL.md)). Open any `.cl` or `.ocl` file in VS Code to activate syntax highlighting, auto-completion, code snippets, API reference tooltips and document formatting for OpenCL kernel files. Open any file associated with `C` or `C++` language in VS Code to activate code snippets for OpenCL host device functions.

The extension uses a set of tools to provide offline compilation and OpenCL devices/platforms information. By default `ioc32/ioc64` offline compiler is used on `Linux` and `Windows` and `openclc` is used on `macOS`. This requires [Intel OpenCL SDK](https://software.intel.com/en-us/articles/opencl-drivers) [Windows, Linux] to be installed on the system. For macOS `openclc` should be a part of `OpenCL.framework` (shipped with XCode). It is possible to use another offline OpenCL compiler (see [Customize Build Task](#customize-build-task) for details).

---

> Why ioc32/ioc64 doesn't work with `#include`?

* **Problem matcher doesn't work on Windows for kernal file with `#include` statements** ([#13](https://github.com/Galarius/vscode-opencl/issues/13))

    There are two workarounds:

    1. Override `options.cwd` and `problemMatcher` in `tasks.json` adding `problemMatcher.fileLocation` like this:

    <details>
    <summary>tasks.json</summary>

    ```json
    {
        "type": "shell",
        "label": "opencl: custom build",
        "command": "ioc64",
        "options": {
            "cwd": "${workspaceFolder}/some_path"
        },
        "args": [
            "-cmd=build",
            "-input=\"main.cl\""
        ],
        "problemMatcher": [
            {
                "fileLocation": ["autoDetect", "${workspaceFolder}/some_path"],
                "pattern": {
                    "regexp": "^(.*):(\\d+):(\\d+): ((fatal )?error|warning|Scholar): (.*)$",
                    "file": 1,
                    "line": 2,
                    "column": 3,
                    "severity": 4,
                    "message": 6
                }
            }
        ],
        "group": "build"
    }
    ```

    </details>

    2. Another way is to modify `ioc` arguments in `tasks.json`:

    <details>
    <summary>tasks.json</summary>

    ```json
    {
        "type": "shell",
        "label": "opencl: custom build",
        "command": "ioc64",
        "args": [
            "-cmd=build",
            "-input=\"${workspaceFolder}\\some_path\\main.cl\"",
            "-bo=\"-I ${workspaceFolder}\\some_path\""
        ],
        "problemMatcher": [
            "$opencl.common"
        ],
        "group": "build"
    },
    ```

    </details>

---

> Why `OpenCL: Info` command shows error?

The command needs OpenCL drivers and run-time libraries to be installed on your system. They can be obtained e.g. from [Intel](https://software.intel.com/en-us/articles/opencl-drivers).


---

> I am on Linux. `OpenCL: Info` seems very overwhelming compared to other operating systems?

`OpenCL: Info` on Linux uses another tool to extract the information about the system.
