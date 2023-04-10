# Developer Notes

## Setup OpenCL VS Code Extension

* Install npm if needed: `brew install npm`
* Install vsce if needed: `npm install -g vsce`
* Install packages for extension: `npm install`

## Setup OpenCL Language Server

* Clone/update [opencl-language-server](https://github.com/Galarius/opencl-language-server) submodule: `git submodule update --init --recursive`

## VSCE 

* Create extension package locally: `vsce package`
* Publish extesion: `vsce publish`

## How to update each dependency in package.json to the latest version?

```
npm i -g npm-check-updates
ncu -u
npm install
```
