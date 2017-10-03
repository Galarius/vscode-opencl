# OpenCL for Visual Studio Code

[![Current Version](https://vsmarketplacebadge.apphb.com/version-short/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)
[![Install Count](https://vsmarketplacebadge.apphb.com/installs/galarius.vscode-opencl.svg)](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)

This extension adds support for:

* `.cl` and `.ocl` file extensions
* OpenCL C keywords syntax highlighting
* OpenCL C++ keywords syntax highlighting
* Auto-Completion (Built-in OpenCL functions, data types and macros)
* Code Snippets for some host and device functions

![screen-autocomplete](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-autocomplete.gif)  
*Syntax Highlighting, Auto-Completion*

![screen-snippet](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/vscode-opencl-snippet.gif)  
*Code Snippets*

## Prerequisites

* [Visual Studio Code](https://code.visualstudio.com)

## How To Install This Extension

### **I.** Install from the Extensions pane

1. Press `Ctrl+Shift+X` or `Cmd+Shift+X` to open the Extensions pane

2. Find and install the `OpenCL` extension

### **II.** Install from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl)

Press `Install` button

![screen-install](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/images/install.button.png)

### **III.** Install from the `.vsix` file

1. Download `vsix` package from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=galarius.vscode-opencl) (Press `Download Extension` link) or select the specific version of this extension from it's [Releases page](https://github.com/Galarius/vscode-opencl/releases)

2. In VS Code press `Ctrl+Shift+X` or `Cmd+Shift+X` to open the Extensions pane

3. Press at the right top corner of the pane and select `Install from VSIX...`

## How To Use This Extension

* Open any `.cl` or `.ocl` file in VS Code to activate syntax highlighting, auto-completion and code snippets for OpenCL kernel files.

* Open any file associated with `C` or `C++` language in VS Code to activate code snippets for OpenCL functions.

## Contributing

There are plenty of possible improvements:

* Auto-Completion for OpenCL C++ Standard Library

* Documentation Hover View for OpenCL API

* More Code Snippets (check [current progress](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/snippets/code.snippets.progress.md))

* Check for [open issues](https://github.com/Galarius/vscode-opencl/issues)

Here's a quick guide on `pull requests`:

1. [Check for open issues](https://github.com/galarius/vscode-opencl/issues), or
   open a fresh issue to start a discussion around a feature idea or a bug.
   Opening a separate issue to discuss the change is less important for smaller
   changes, as the discussion can be done in the pull request.
2. [Fork](https://github.com/galarius/vscode-opencl.git) this repository on GitHub, and start making your changes.
3. Push the change (it's recommended to use a separate branch for your feature).
4. Open a pull request.
5. I will try to merge and deploy changes as soon as possible, or at least leave
   some feedback, but if you haven't heard back from me after a couple of days,
   feel free to leave a comment on the pull request.

## OpenCL for Visual Studio Code Change Log

### Version 0.1.2: October 3, 2017

* Added Code Snippets for host OpenCL functions
* Added Code Snippets for device OpenCL functions

### Version 0.1.1: September 30, 2017

* Added Auto-Completion (Words from the document)

### Version 0.1.0: September 27, 2017

* Added Auto-Completion (Built-in OpenCL functions, data types and macros)

### Version 0.0.2: September 27, 2017

* Improving the highlighting of OpenCL data types (In accordance with the built-in rules for C and C++ syntax highlighting).

### Version 0.0.1: September 23, 2017

* `.cl` and `.ocl` file extensions support
* OpenCL C keywords
* OpenCL C++ datatypes

## License

[MIT](https://raw.githubusercontent.com/Galarius/vscode-opencl/master/LICENSE.txt)