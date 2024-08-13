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

2. Refer to the `DEV.md` file inside the `server` directory for detailed setup instructions.

    *[optional] Inside the `server` directory, use the following commands to generate an Xcode project:*
    ```
    mkdir .build-xcode && cd .build-xcode
    cmake -G Xcode -DCMAKE_TOOLCHAIN_FILE="../.conan-install/build/Debug/generators/conan_toolchain.cmake" -DENABLE_TESTING=ON ..
    ```

3. Modify the `OPENCL_LANGUAGE_SERVER` path in `.vscode/launch.json` if needed.

## Download the binaries before publishing the package

### macOS

```shell
pushd ./bin/darwin
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "browser_download_url.*darwin-universal" | cut -d : -f 2,3 | tr -d \" )
tar -xzvf opencl-language-server-darwin-universal.tar.gz
rm opencl-language-server-darwin-universal.tar.gz
popd
```

Sign the executable

```shell
codesign -s $SIGNING_IDENTITY --timestamp --force --options runtime ./bin/darwin/opencl-language-server
codesign -vvvv ./bin/darwin/opencl-language-server
```

Archive the executable

```shell
(cd ./bin/darwin; zip opencl-language-server.zip opencl-language-server)
```

Perform the notarization

```shell
(cd ./bin/darwin; xcrun notarytool submit opencl-language-server.zip --keychain-profile $PROFILE --wait)
```

Troubleshooting

```shell
pushd ./bin/darwin
xcrun notarytool history --keychain-profile $PROFILE
xcrun notarytool info --keychain-profile $PROFILE $SUBMISSION_ID
xcrun notarytool log --keychain-profile $PROFILE $SUBMISSION_ID
popd
```

Verify the notarization

```shell
spctl --assess -vv --type install ./bin/darwin/opencl-language-server
```

Remove the archive

```shell
rm ./bin/darwin/opencl-language-server.zip
```

### Linux

```shell
pushd ./bin/linux/x64
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "browser_download_url.*linux-x86_64" | cut -d : -f 2,3 | tr -d \" )
tar -xzvf opencl-language-server-linux-x86_64.tar.gz
rm opencl-language-server-linux-x86_64.tar.gz
popd

pushd ./bin/linux/arm64
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "browser_download_url.*linux-arm64" | cut -d : -f 2,3 | tr -d \" )
tar -xzvf opencl-language-server-linux-arm64.tar.gz
rm opencl-language-server-linux-arm64.tar.gz
popd
```

### Windows

```shell
pushd ./bin/win32
curl --remote-name-all --location  $( curl -s https://api.github.com/repos/Galarius/opencl-language-server/releases/latest | grep "browser_download_url.*win32" | cut -d : -f 2,3 | tr -d \" )
tar -xzvf opencl-language-server-win32-x86_64.zip
rm opencl-language-server-win32-x86_64.zip
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
