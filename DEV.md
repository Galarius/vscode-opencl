# Developer Notes

Setting up the development environment for the `vscode-opencl` extension.

## Setting Up the OpenCL VS Code Extension

1. Ensure you have `npm` installed.
2. Install the necessary packages for the extension using `npm install`.

## Setting Up the OpenCL Language Server for development

1. Clone or update the [opencl-language-server](https://github.com/Galarius/opencl-language-server):

    ```bash
    git clone git@github.com:Galarius/opencl-language-server.git server
    cd server
    ```

2. Refer to the [DEV.md](https://github.com/Galarius/opencl-language-server/blob/main/DEV.md) file inside the `server` directory for detailed setup instructions.

3. Modify the `OPENCL_LANGUAGE_SERVER` path in `.vscode/launch.json` if needed.

## Download opencl-language-server manually

Useful when the extension is installed in a network-isolated environment where the automatic download cannot reach GitHub.

1. On a machine with internet access, download the release archive matching your platform and architecture from the [Releases page](https://github.com/Galarius/opencl-language-server/releases) or using commands below. The minimum supported server version and compatible range are defined by `serverVersion` in `package.json` (compatible range is `[serverVersion, next minor)`).

2. Transfer the archive to the target machine, extract the binary.

3. Run `OpenCL: Register Local Language Server` from the command palette and point it to the local archive when prompted. See [TROUBLESHOOTING.md - 9. Manual Installation](https://github.com/Galarius/vscode-opencl/blob/master/TROUBLESHOOTING.md#9-manual-installation) for detailed instructions.


### macOS

```shell
mkdir -p ./bin/darwin/universal 
pushd ./bin/darwin/universal
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "browser_download_url.*darwin-universal" | cut -d : -f 2,3 | tr -d \" )
tar -xzvf opencl-language-server-darwin-universal.tar.gz
rm opencl-language-server-darwin-universal.tar.gz
popd
```

### Linux

```shell
mkdir -p ./bin/linux/x64
pushd ./bin/linux/x64
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "browser_download_url.*linux-x86_64" | cut -d : -f 2,3 | tr -d \" )
tar -xzvf opencl-language-server-linux-x86_64.tar.gz
rm opencl-language-server-linux-x86_64.tar.gz
popd

mkdir -p ./bin/linux/arm64
pushd ./bin/linux/arm64
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "browser_download_url.*linux-arm64" | cut -d : -f 2,3 | tr -d \" )
tar -xzvf opencl-language-server-linux-arm64.tar.gz
rm opencl-language-server-linux-arm64.tar.gz
popd
```

### Windows

```shell
pushd ./bin/win32
mkdir -p ./bin/win32
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "browser_download_url.*win32" | cut -d : -f 2,3 | tr -d \" )
tar -xzvf opencl-language-server-win32-x86_64.zip
rm opencl-language-server-win32-x86_64.zip
popd
```

### Licenses

```shell
pushd ./bin
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "licenses.tar.gz" | tail -n -1 | cut -d : -f 2,3 | tr -d \" )
tar -xzvf licenses.tar.gz
rm licenses.tar.gz
popd
```

## Publishing the extension to the Visual Studio Marketplace 

1. Install `vsce`: `npm install -g @vscode/vsce`.
2. Create the extension package locally using `vsce package`.
3. Publish the extension with `vsce publish`.

## Publishing the extension to Open-VSX

1. Install `npx`: `npm install -g npx`.
2. Follow the publishing guidelines available at https://github.com/eclipse/openvsx/wiki/Publishing-Extensions.
3. Publish the extension using `npx ovsx publish`.

## Upgrade dependencies

1. Install `npm-check-updates`: `npm i -g npm-check-updates`.
2. Run `ncu -u` to upgrade.
3. Install the updated packages with `npm install`.
