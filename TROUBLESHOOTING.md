# Troubleshooting

This guide covers errors that can occur during language server download, installation and launch, explains what causes each one, and describes how to diagnose and fix it.

---

## Table of Contents

- [1. Where to find logs](#1-where-to-find-logs)
- [2. Download errors](#2-download-errors)
- [3. Integrity check errors](#3-integrity-check-errors)
- [4. Extraction errors](#4-extraction-errors)
- [5. Platform and architecture errors](#5-platform-and-architecture-errors)
- [6. Version and compatibility errors](#6-version-and-compatibility-errors)
- [7. Launch errors](#7-launch-errors)
- [8. Cached binary issues](#8-cached-binary-issues)
- [9. Manual installation](#9-manual-installation)
- [10. Language server errors](#10-language-server-errors)
- [Still stuck?](#still-stuck)

---

## 1. Where to find logs

Before diving into specific errors, open the relevant log panels:

**Extension host log**
`View → Output → OpenCL Language Server`
This shows progress messages (Checking for updates, Downloading, Verifying, Extracting) and any error thrown during the download pipeline.

**Developer tools console**
`Help → Toggle Developer Tools → Console`
Low-level JavaScript errors and stack traces appear here if the extension host itself crashes.

**Language client log**
`View → Output → OpenCL Language Server`
Shows the JSON-RPC communication with the running binary. Useful once the binary is already installed and you are diagnosing launch or protocol issues.

**Binary storage location**
Binary files and associated metadata are stored in the user's `globalStorage` directory. The path is also logged in the Output panel. Default paths are:

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Code/User/globalStorage/galarius.vscode-opencl/bin/` |
| Linux | `~/.config/Code/User/globalStorage/galarius.vscode-opencl/bin/` |
| Windows | `%APPDATA%\Code\User\globalStorage\galarius.vscode-opencl\bin\` |

Files present in that directory:

| File | Purpose |
|------|---------|
| `opencl-language-server` / `.exe` | The downloaded binary |
| `last-check.txt` | Timestamp of the last GitHub API check (Unix ms) |

---

## 2. Download errors

### `Failed to download OpenCL Language Server`

**Cause:** A network-level failure before any data was received. The extension host could not reach `api.github.com` or `objects.githubusercontent.com` (the S3 bucket GitHub redirects asset downloads to).

**How to diagnose:**
- Check your internet connection.
- Test the endpoint directly in a terminal:
  ```bash
  curl -I https://api.github.com/repos/Galarius/opencl-language-server/releases/latest
  ```
- If you are behind a corporate proxy or VPN, VS Code may not inherit its configuration. Set the proxy in VS Code settings:
  ```json
  "http.proxy": "http://proxy.example.com:8080"
  ```

**Fix:** Restore connectivity and reload the window (`Developer: Reload Window`). The extension retries from scratch on next activation.

Alternatively, see [Manual Installation](#9-manual-installation).

---

### `GitHub API rate limit exceeded. Try again later.`

**Cause:** GitHub's unauthenticated REST API allows limited amount of requests per hour per IP. This is rarely hit in normal use since the extension checks at most once every 24 hours, but shared NAT (office networks, CI machines) can exhaust the limit.

**How to diagnose:**
```bash
curl -I https://api.github.com/repos/Galarius/opencl-language-server/releases/latest
# Look for: X-RateLimit-Remaining: 0
```

**Fix:** Wait, then reload the window. If this happens repeatedly in a shared environment, consider installing the binary manually (see [Manual installation](#9-manual-installation)).

---

### `Download failed (HTTP 403): https://objects.githubusercontent.com/...`

**Cause:** The GitHub-to-S3 redirect was blocked or the signed URL expired.

**Fix:** Delete `last-check.txt` from the binary storage directory (see [Where to find logs](#1-where-to-find-logs)) to force a fresh check, then reload the window.

---

### `Not found: https://api.github.com/...`

**Cause:** The repository or release was not found (HTTP 404). This should not occur in normal use but can happen if the repository is renamed or the release is deleted.

**Fix:** Check https://github.com/Galarius/opencl-language-server/releases to confirm the release exists. If the extension's pinned `serverVersion` in `package.json` points to a release that no longer exists, update the extension.

---

## 3. Integrity check errors

### `SHA-256 mismatch for opencl-language-server-<platform>-<arch>.tar.gz` occured during server

```
SHA-256 mismatch for opencl-language-server-darwin-arm64.tar.gz
  expected: abc123...
  actual:   def456...
```

**When this can occur:**

a. **During download** - the archive received from GitHub is corrupt:

The extension automatically deletes the corrupt archive before throwing, so no cleanup is needed.

**Fix:** Reload the window to trigger a fresh download. If it fails repeatedly with the same mismatch, the file on GitHub itself may be corrupt - open an issue at https://github.com/Galarius/opencl-language-server/issues.

b. **During launch** - the binary already on disk has changed since it was first installed:

**Fix:** The extension will automatically attempt to re-download a fresh copy through the correct pipeline. Do not place or replace binaries directly in the storage directory (see [Manual installation](#9-manual-installation) for details). 

---

### `Unexpected digest algorithm "md5" for asset "..."`

**Cause:** The extension only supports `sha256` digests. This would indicate a change in GitHub's API that is not yet handled.

**Fix:** Update the extension. In the meantime, use manual installation.

---

## 4. Extraction errors

### `Binary "opencl-language-server" not found inside archive.`

**Cause:** The archive downloaded successfully and passed the checksum, but the expected binary was not at the root of the archive. This can happen if:
- The release was packaged with the binary inside a subdirectory (e.g. `opencl-language-server-0.7.1/opencl-language-server`)
- The asset for your platform was accidentally built with the wrong internal structure

**How to diagnose:** Manually download the asset and inspect its contents:
```bash
# For tar.gz
tar -tzf opencl-language-server-darwin-arm64.tar.gz

# For zip (Windows)
unzip -l opencl-language-server-win32-x86_64.zip
```

If the binary is inside a subdirectory, this is a packaging bug - open an issue upstream.

---

### `ENOSPC: no space left on device`

**Cause:** The disk is full. The extension cannot write the downloaded archive or extracted binary.

**Fix:** Free up disk space and reload the window.

---

## 5. Platform and architecture errors

### `Unsupported architecture: ia32`

### `Unsupported platform: freebsd`

**Cause:** The GitHub release does not provide a prebuilt binary for your platform or architecture.

**Fix:** If your platform should be supported but the error still fires, open an issue. If your platform is genuinely unsupported, request a build or compile from source at https://github.com/Galarius/opencl-language-server.

---

## 6. Version and compatibility errors

### `No compatible language server release found for pinned version X.Y.Z. Please update the extension.`

**Cause:** The extension's `serverVersion` field pins a minimum version (e.g. `0.7.1`) and auto-updates within the same minor series (up to but not including `0.8.0`). This error means:
- No release exists in that range for your platform, **and**
- There is no previously downloaded binary to fall back on

This typically happens after a fresh install when the only available releases are either older than the pinned version or have already bumped to a new minor.

**Fix:** Update the extension - a newer extension version will pin to a newer server version range. Alternatively, install the binary manually (see [Manual installation](#9-manual-installation)).

---

### Extension shows an info message: `OpenCL Language Server X.Y.Z is available but requires an extension update.`

**Cause:** A new minor or major version of the language server is available upstream (e.g. `0.8.0` when you are on `0.7.x`) but the extension has not yet been updated to support it. The extension continues using the last compatible version it downloaded.

**This is informational - the extension keeps working.** No action is required unless you want the new server features.

**Fix:** Wait for a new extension release that bumps `serverVersion` to the new range.

---

## 7. Launch errors

### Language server exits immediately / no IntelliSense

**Cause:** The binary launched but crashed before completing the LSP handshake.

**How to diagnose:** Run the binary directly in a terminal:
```bash
~/Library/Application\ Support/Code/User/globalStorage/galarius.vscode-opencl/bin/opencl-language-server --version
```

Expected output: `0.7.2` (or similar). If you see:
- `command not found` → binary was not downloaded or was deleted
- `killed` / `Abort trap: 6` → wrong architecture or missing dependency
- `zsh: exec format error` → wrong architecture for this machine
- A crash report → binary bug, open an issue upstream

---

### `EACCES: permission denied` when launching

**Cause:** The binary is not executable. This can happen if:
- The file was copied from a filesystem that does not preserve permissions.

**Fix:**
```bash
# on macOS
chmod +x ~/Library/Application\ Support/Code/User/globalStorage/galarius.vscode-opencl/bin/opencl-language-server
```
Then reload the window.

---

### `EBUSY: resource busy or locked` (Windows only)

**Cause:** VS Code is trying to overwrite the binary while it is still in use by a running language server process. Windows locks executable files that are currently running.

**Fix:** Restart VS Code fully (not just reload window) to release the file lock, then let the extension update proceed.

---

## 8. Cached binary issues

### Extension uses an outdated binary after an extension update

**Cause:** The `last-check.txt` timestamp is recent (less than 24 hours old), so the extension skipped the GitHub API check and returned the cached binary.

**Fix:** Delete `last-check.txt` from the binary storage directory to force an immediate check on next activation:
```bash
# on macOS
rm ~/Library/Application\ Support/Code/User/globalStorage/galarius.vscode-opencl/bin/last-check.txt
```
Then reload the window.

---

### Binary was replaced directly on the filesystem
 
**Cause:** Placing a binary directly into the storage directory bypasses the integrity pipeline entirely, the file will be silently overwritten on the next update check.
 
**Fix:** Always register or unregister the custom binary via the `OpenCL: Register Local Language Server` / `OpenCL: Unregister Local Language Server` commands (see [Manual installation](#9-manual-installation)).

---

### Manually replaced binary is ignored / overwritten

**Cause:** The extension determines the installed version by running `opencl-language-server --version`. If the version reported by your manually placed binary falls within the compatible range (`[serverVersion, next-minor)`), the extension treats it as up-to-date. If it falls outside the range, the extension overwrites it on the next update check.

---

## 9. Manual installation

If automatic download fails and cannot be resolved, install the binary manually:

1. Go to https://github.com/Galarius/opencl-language-server/releases
2. Download the asset matching your platform and architecture
3. Extract the archive to the desired directory:
   ```bash
   # macOS / Linux
   tar -xzf opencl-language-server-darwin-arm64.tar.gz

   # Windows (PowerShell)
   Expand-Archive opencl-language-server-win32-x86_64.zip
   ```
4. Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
5. Run `OpenCL: Register Local Language Server`
6. Select the extracted `opencl-language-server` file.
7. Reload the window by pressing on `Reload Now` button in the notification or via the command palette `Developer: Reload Window`.

*The extension will detect the binary via `--version` on next activation and skip the download entirely if the version is within the compatible range.*

**To return to the default installation flow:**

1. Open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run `OpenCL: Unregister Local Language Server`
3. Reload the window by pressing on `Reload Now` button in the notification or via the command palette `Developer: Reload Window`.
4. The extension will start downloading the language server from [GitHub Releases](https://github.com/Galarius/opencl-language-server/releases).

## 10. Language server errors
 
Once the binary is installed and running, errors in the language server itself (incorrect diagnostics, missing completions, platform enumeration failures, crashes) are separate from the extension download pipeline and require server-side logs to diagnose.

### Tracing the communication

Setting `opencl.trace.server` traces the communication between VS Code and the OpenCL language server. Useful for debugging. By default, the value is `"off"`.

1. Open VS Code settings (`Cmd+,` / `Ctrl+,`) and set:
```
  opencl.trace.server: "messages" or "verbose"
```
or add it directly to `settings.json`.

2. Open `View → Output → OpenCL Language Server`.

3. Look for errors in printed json-rpc messages.


### Enabling file logging
 
By default the language server does not write logs to a file. To get a persistent log file with more detail:
 
1. Open VS Code settings (`Cmd+,` / `Ctrl+,`) and set:
```
   OpenCL.server.debug.enableFileLogging: true
```
   Or add it directly to `settings.json`.
  
2. Apply the change by running `Developer: Reload Window` from the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
  
#### Finding the log file
 
The language server writes its log to a file whose path is printed in the extension host output panel on startup:
 
1. Open `View → Output → OpenCL Language Server`
2. Look for a line near the top similar to:
```
   Log dir is set to: /path/to/opencl-language-server.log
```
3. Open that file in any text editor or tail it in a terminal:
```bash 
   tail -f /path/to/opencl-language-server.log
```

### Unified logging system on macOS

On macOS, you can read the server logs using the following command:

```bash
log stream --info --debug --predicate 'subsystem contains "com.galarius" && process == "opencl-language-server"'
```

### Disabling file logging after diagnosis
 
Set `OpenCL.server.debug.enableFileLogging` back to `false` and reload the window.

---

## Still stuck?

If none of the above resolves your issue, open a bug report at:
https://github.com/Galarius/opencl-language-server/issues

Include:
- Your OS, architecture (`node -e "const os=require('os');console.log(os.platform(),os.arch())"`)
- VS Code version (`Help → About`)
- Extension version
- The full error message from `View → Output → OpenCL Language Server`
- Output of running the binary directly with `--version`
- The server log file if the issue is a runtime/language server error (see [Language server errors](#10-language-server-errors))
