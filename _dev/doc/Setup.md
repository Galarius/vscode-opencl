# Developer Notes

## Setup OpenCL VS Code Extension

* Install npm if needed: `brew install npm`
* Install vsce if needed: `npm install -g vsce`
* For zsh: `echo 'source ~/.zshrc' > ~/.zshenv`
* Install packages for extension: `npm install`

## Setup OpenCL Language Server

* Clone/update [opencl-language-server](https://github.com/Galarius/opencl-language-server) submodule: `git submodule update --init --recursive`

## VSCE 

* Create extension package locally: `vsce package`
* Publish extesion: `vsce publish`

## OpenCL:Info

* On Windows & macOS: [ocl-info](https://github.com/Galarius/ocl-info)
* On Linux: [clinfo](https://github.com/Oblomov/clinfo)