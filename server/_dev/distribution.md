# macOS Notarization Hints

## Signing

```
codesign -s ${DEVELOPER_ID} --timestamp --force --options runtime --entitlements opencl-language-server.entitlements ./opencl-language-server

codesign --verify -vvvv ./opencl-language-server

codesign -dvvv --entitlements :- ./opencl-language-server
```

## Notarization

```
xcrun altool --list-providers -p "@keychain:AC_PASSWORD"

xcrun altool --notarize-app --primary-bundle-id "com.vscode-opencl.language-server" --password "@keychain:AC_PASSWORD" --asc-provider ${PROVIDER} --file opencl-language-server.zip

xcrun altool --notarization-history 0 --asc-provider ${PROVIDER} --password "@keychain:AC_PASSWORD"

xcrun altool --notarization-info ${REQUEST_ID} --password "@keychain:AC_PASSWORD"
```
