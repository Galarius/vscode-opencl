'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { pipeline } from 'stream/promises';
import * as tar from 'tar';
import * as fflate from 'fflate';
import * as cmd from '../../commands/cmd';
import { CONFIG_OPECL_SERVER_PATH } from '../../modules/common';
import { OpenCLLanguageServerCLI } from './cli';
// import { isDebugMode } from '../../modules/debug';

const GITHUB_OWNER = 'Galarius';
const GITHUB_REPO = 'opencl-language-server';
export const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

const ARCH_MAP: Partial<Record<NodeJS.Architecture, string>> = {
    'x64': 'x86_64',
    'arm64': 'arm64'
};

const PLATFORM_MAP: Array<NodeJS.Platform> = ['darwin', 'linux', 'win32'];

interface GitHubAsset {
    name: string;
    browser_download_url: string;
    digest: string | null;
}

interface GitHubRelease {
    tag_name: string;
    assets: GitHubAsset[];
}

export class LanguageServerManager {
    private binDir: string;
    private binaryName: string;
    private lastCheckFile: string;
    private pinnedVersion: string;
    private logDir: string;

    /**
     * Returns the server path. 
     * Note: call `discoverLanguageServer` before using this property.
     */
    public serverPath: string | undefined;
    /**
     * Use this path for debugging (could differ from the real server path).
     * Note: no checks are enforced for the debug path.
     */
    public debugPath: string | undefined;

    constructor(
        private context: vscode.ExtensionContext,
        private channel: vscode.OutputChannel
    ) {
        this.pinnedVersion = context.extension.packageJSON['serverVersion'] ?? '';
        this.debugPath = process.env.OPENCL_LANGUAGE_SERVER;
        this.logDir = context.logUri.fsPath;

        if (!this.pinnedVersion) {
            throw new Error('"serverVersion" is missing from package.json');
        }

        this.binDir = path.join(context.globalStorageUri.fsPath, 'bin');
        this.binaryName = this.getBinaryName();
        this.lastCheckFile = path.join(this.binDir, 'last-check.txt');
    }

    /**
     * Discovers the language server on disk or downloads and installs the latest compatible release.
     * Note: `LanguageServerManager` checks the checksum of the executable before using it.
     */
    public async discoverLanguageServer(): Promise<string> {
        this.channel.appendLine(`Log dir is set to "${this.logDir}"`);
        this.channel.appendLine("Searching for OpenCL Language Server...");

        let configuaration = vscode.workspace.getConfiguration();
        let userPath = configuaration ? configuaration.get<string>(CONFIG_OPECL_SERVER_PATH) : null;

        if (userPath) {
            if (!fs.existsSync(userPath)) {
                throw new Error(
                    `Registered local server not found at: ${userPath}\n` +
                    `Use the 'OpenCL: Unregister Local Language Server' command to clear it, ` +
                    `or update the '${CONFIG_OPECL_SERVER_PATH}' setting.`
                );
            }
            const checksum = await this.loadChecksum(false);
            if (!checksum) {
                throw new Error(
                    `The server has not been registered at: ${userPath}\n` +
                    `Use 'OpenCL: Register Local Language Server' to register the binary.`
                );
            }
            await this.verifySha256(userPath, checksum);
            this.channel.appendLine(`Using user-registered OpenCL Language Server at ${userPath}.`);
            this.serverPath = userPath;
            return this.serverPath;
        }

        await fs.promises.mkdir(this.binDir, { recursive: true });

        const binPath = path.join(this.binDir, this.binaryName);
        const binaryExists = fs.existsSync(binPath);

        let installedVersion: string | null = null;
        if (binaryExists) {
            installedVersion = await this.getInstalledVersion(binPath);
        }

        // Scenario: Valid cache exists
        if (binaryExists && installedVersion &&
            this.isCompatible(installedVersion, this.pinnedVersion) &&
            !this.shouldCheckForUpdate(this.lastCheckFile)) {
            this.channel.appendLine(`Found existing OpenCL Language Server (${installedVersion}) at ${binPath}.`);
            this.serverPath = binPath;
            return this.serverPath;
        }

        this.channel.appendLine("Searching for OpenCL Language Server release on GitHub...");

        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'OpenCL Language Server',
            cancellable: true,
        }, async (progress) => {
            try {
                const release = await this.resolveRelease(installedVersion, progress);
                this.writeTextFile(this.lastCheckFile, String(Date.now()));

                if (!release) {
                    if (binaryExists) {
                        this.channel.appendLine(`Using cached OpenCL Language Server (${installedVersion}) at ${binPath}...`);
                        this.serverPath = binPath;
                        return this.serverPath;
                    }
                    throw new Error(`No compatible language server release found for pinned version ${this.pinnedVersion}.`);
                }

                const asset = this.findAsset(release);
                const archivePath = path.join(this.binDir, asset.name);

                // Download
                progress.report({ message: `Downloading ${asset.name}…` });
                await this.downloadToFile(asset.browser_download_url, archivePath);

                // Verify
                progress.report({ message: 'Verifying checksum…' });
                await this.verifySha256(archivePath, asset.digest);

                // Install
                progress.report({ message: 'Extracting…' });
                const extractedPath = await this.installNewBinary(archivePath, binPath);

                this.channel.appendLine(`Using OpenCL Language Server (${release.tag_name}) at ${extractedPath}...`);
                this.serverPath = extractedPath;
                return this.serverPath;

            } catch (err) {
                this.channel.appendLine(`OpenCL Language Server discovery error: ${err}`);
                if (binaryExists) {
                    this.channel.appendLine(`Using cached binary...`);
                    this.serverPath = binPath;
                    return this.serverPath;
                }
                throw err;
            }
        });
    }
     
    /**
     * Registers a user-supplied binary as the language server.
     * Computes and stores its SHA-256 checksum in vscode.secrets, then
     * persists the path in global settings under CONFIG_OPECL_SERVER_PATH.
     * Called by the `opencl.register-server` command.
     */
    public async registerLocalServer(serverPath: string): Promise<void> {
        if (!fs.existsSync(serverPath)) {
            throw new Error(`Binary not found at: ${serverPath}`);
        }
        await this.saveChecksum(serverPath);
        await vscode.workspace.getConfiguration().update(
            CONFIG_OPECL_SERVER_PATH,
            serverPath,
            vscode.ConfigurationTarget.Global,
        );
    }
    
    /**
     * Removes the registered local binary from settings and deletes its
     * stored checksum from vscode.secrets.
     * Called by the `opencl.unregister-server` command.
     */
    public async unregisterLocalServer(): Promise<void> {
        await this.deleteChecksum(false);
        await vscode.workspace.getConfiguration().update(
            CONFIG_OPECL_SERVER_PATH,
            undefined,
            vscode.ConfigurationTarget.Global,
        );
    }
    
    /**
     * Returns the real or the debug path (if in Debug mode).
     * Note: call `discoverLanguageServer` before using this property.
     */
    public getRuntimePath(): string {
        /*  // Do not ship this code (use for debugging only)
            if (isDebugMode() && !!this.debugPath) {
                return this.debugPath;
            }
        */
        if (!!this.serverPath) {
            return this.serverPath;
        }
        throw new Error(`OpenCL Language Server is not available`);
    }

    // Runs `opencl-language-server --version` with safety checks
    public async version(): Promise<string | null> {
        return this.getInstalledVersion(this.getRuntimePath());
    }

    // Runs `opencl-language-server clinfo` with safety checks
    public async info(): Promise<any | undefined> {    
        try {
            const path = this.getRuntimePath();
            return await this.execute("clinfo", path, 'info');
        } catch (err) {
            this.channel.appendLine(`Version check failed: ${err}`);
            return undefined;
        }
    }

    public getLaunchArgs(): string[] {
        let debugConfiguration = vscode.workspace.getConfiguration('OpenCL.server.debug', null);
        let enableFileLogging = debugConfiguration.get('enableFileLogging', false);
        let logLevel = debugConfiguration.get('logLevel', 0);
        let logFileName = path.join(this.logDir, 'opencl-language-server.log');
        let cli = new OpenCLLanguageServerCLI("")
                    .excludeExecutable()
                    .setEnableFileLogging(enableFileLogging)
                    .setLogLevel(logLevel)
        let args = cli.buildArgs();
        args.push("--log-file");
        // LanguageClient + opencl-language-server do not like path escaping here, 
        // so adding explicitly instead of using `setLogFile`.
        args.push(`${logFileName}`);
        return args;
    }

    public async checkServerPath() {
        if (!this.serverPath) {
            throw new Error('Server is not available');
        }
        const checksum = await this.loadChecksum(false);
        if (!checksum) {
            throw new Error('No checksum found');
        }
        await this.verifySha256(this.serverPath, checksum);
    }

    // --- Private Helpers ---

    private async resolveRelease(installedVersion: string | null, progress: vscode.Progress<{
        message?: string;
        increment?: number;
    }> | null): Promise<GitHubRelease | null> {

        if (progress) {
            progress.report({ message: 'Checking for updates…' });
        }

        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
        const response = await this.githubFetch(url);
        const latest = await response.json() as GitHubRelease;
        const latestVersion = latest.tag_name;

        if (this.isCompatible(latestVersion, this.pinnedVersion)) {
            if (installedVersion && !this.versionLt(installedVersion, latestVersion)) {
                this.channel.appendLine(`Latest release ${latestVersion} is already installed.`);
                return null;
            }
            return latest;
        }

        this.channel.appendLine(`Latest release ${latestVersion} not compatible. Searching history...`);
        const allUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;
        const allResponse = await this.githubFetch(allUrl);
        const allReleases = await allResponse.json() as GitHubRelease[];

        const best = allReleases
            .filter(r => this.isCompatible(r.tag_name, this.pinnedVersion))
            .sort((a, b) => this.versionLt(a.tag_name, b.tag_name) ? 1 : -1)
            .at(0) ?? null;

        if (best) {
            if (installedVersion && !this.versionLt(installedVersion, best.tag_name)) {
                return null;
            }
            vscode.window.showInformationMessage(`OpenCL Language Server ${latestVersion} is available but requires an extension update.`);
            return best;
        }

        return null;
    }

    private async installNewBinary(archivePath: string, binPath: string): Promise<string> {
        const backupPath = binPath + '.bak';
        let backedUp = false;
        let extractedBinPath = '';

        try {
            if (fs.existsSync(binPath)) {
                await fs.promises.rename(binPath, backupPath);
                await this.backupChecksum();
                backedUp = true;
            }

            extractedBinPath = await this.extractArchive(archivePath, this.binDir, this.binaryName);
            await this.saveChecksum(extractedBinPath);

            const newVersion = await this.getInstalledVersion(extractedBinPath);
            if (newVersion) {
                if (fs.existsSync(backupPath)) {
                    await fs.promises.unlink(backupPath);
                    await this.deleteChecksum(true);
                }
            } else {
                throw new Error('Failed to verify version of extracted binary.');
            }
        } catch (err) {
            if (backedUp && fs.existsSync(backupPath)) {
                await fs.promises.rename(backupPath, binPath);
                await this.restoreChecksum();
            }
            throw err;
        } finally {
            if (fs.existsSync(archivePath)) { 
                await fs.promises.unlink(archivePath);
            }
        }

        return extractedBinPath;
    }

    private findAsset(release: GitHubRelease): GitHubAsset {
        const assetName = this.getAssetName();
        const asset = release.assets.find(a => a.name === assetName);
        if (!asset) {
            throw new Error(`Asset ${assetName} not found in release.`);
        }
        if (!asset.digest) {
            throw new Error(`No digest for asset ${assetName}.`);
        }
        return asset;
    }

    private getBinaryName(platform: NodeJS.Platform = os.platform()): string {
        return platform === 'win32' ? 'opencl-language-server.exe' : 'opencl-language-server';
    }

    private getAssetName(platform: NodeJS.Platform = os.platform(), arch: NodeJS.Architecture = os.arch()): string {
        const supportedArch = ARCH_MAP[arch];
        if (!supportedArch || !PLATFORM_MAP.includes(platform)) {
            throw new Error(`Unsupported platform/architecture: ${platform}/${arch}`);
        }
        const ext = platform === 'win32' ? '.zip' : '.tar.gz';
        return `opencl-language-server-${platform}-${supportedArch}${ext}`;
    }

    private parseVersion(v: string): [number, number, number] {
        const [ma, mi, pa] = v.replace(/^v/, '').split('.').map(Number);
        return [isNaN(ma) ? 0 : ma, isNaN(mi) ? 0 : mi, isNaN(pa) ? 0 : pa];
    }

    private upperBound(pinned: string): string {
        const [major, minor] = this.parseVersion(pinned);
        return `${major}.${minor + 1}.0`;
    }

    private versionLt(a: string, b: string): boolean {
        const [ama, ami, apa] = this.parseVersion(a);
        const [bma, bmi, bpa] = this.parseVersion(b);
        if (ama !== bma) return ama < bma;
        if (ami !== bmi) return ami < bmi;
        return apa < bpa;
    }

    private isCompatible(version: string, pinned: string): boolean {
        const ceiling = this.upperBound(pinned);
        return !this.versionLt(version, pinned) && this.versionLt(version, ceiling);
    }

    private shouldCheckForUpdate(lastCheckFile: string): boolean {
        try {
            const raw = fs.readFileSync(lastCheckFile, 'utf8').trim();
            const ts = Number(raw);
            return isNaN(ts) || Date.now() - ts > CHECK_INTERVAL_MS;
        } catch {
            return true;
        }
    }

    private async githubFetch(url: string): Promise<Response> {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2026-03-10',
            },
            redirect: 'follow',
        });
        if (response.status === 403) {
            throw new Error('GitHub API rate limit exceeded.');
        }
        if (response.status === 404) {
            throw new Error(`Not found: ${url}`);
        }
        if (!response.ok) {
            throw new Error(`GitHub API error ${response.status}`);
        }
        return response;
    }

    private async downloadToFile(url: string, dest: string): Promise<void> {
        const response = await fetch(url, { redirect: 'follow' });
        if (!response.ok) { 
            throw new Error(`Download failed (HTTP ${response.status})`);
        }
        const fileStream = fs.createWriteStream(dest);
        await pipeline(response.body as unknown as NodeJS.ReadableStream, fileStream);
    }

    private async verifySha256(filePath: string, expectedDigest: string | null): Promise<void> {
        if (!expectedDigest) {
            throw new Error("SHA-256 verification failed: null digest");
        }
        var expectedHash: string = expectedDigest
        if (expectedDigest.includes(':')) {
            const [digestAlgo, hash] = expectedDigest.split(':');
            if (digestAlgo !== 'sha256') {
                throw new Error(`Unexpected digest algorithm "${digestAlgo}".`);
            }
            expectedHash = hash
        }
        const hash = crypto.createHash('sha256');
        await pipeline(fs.createReadStream(filePath), hash);
        const actual = hash.digest('hex');
        if (actual !== expectedHash.trim().toLowerCase()) {
            throw new Error(`SHA-256 mismatch. Expected: ${expectedHash}, Actual: ${actual}`);
        }
    }

    private async extractArchive(archivePath: string, destDir: string, binaryName: string): Promise<string> {
        if (archivePath.endsWith('.tar.gz')) {
            await tar.extract({ file: archivePath, cwd: destDir, strict: true });
        } else {
            const data = await fs.promises.readFile(archivePath);
            const unzipped = fflate.unzipSync(Buffer.from(data));
            for (const [filename, contents] of Object.entries(unzipped)) {
                const outPath = path.join(destDir, filename);
                await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
                await fs.promises.writeFile(outPath, contents);
            }
        }
        const binPath = path.join(destDir, binaryName);
        if (!fs.existsSync(binPath)) {
            throw new Error(`Binary "${binaryName}" not found in archive.`);
        }
        return binPath;
    }

    private getOpenCLLanguageServerCLI(serverPath: string, label: string): OpenCLLanguageServerCLI {
        let debugConfiguration = vscode.workspace.getConfiguration('OpenCL.server.debug', null);
        if (!!debugConfiguration) {
            let enableFileLogging = debugConfiguration.get('enableFileLogging', false);
            let logLevel = debugConfiguration.get('logLevel', 0);
            let logFileName = path.join(this.logDir, `${label}.log`);
            return new OpenCLLanguageServerCLI(serverPath)
                        .setEnableFileLogging(enableFileLogging)
                        .setLogFile(logFileName)
                        .setLogLevel(logLevel)
        }
        return new OpenCLLanguageServerCLI(serverPath);
    }

    private async execute(subcommand: string, serverPath: string, label: string): Promise<string> {
        const checksum = await this.loadChecksum(false);
        if (!checksum) {
            throw new Error('No checksum found.');
        }
        await this.verifySha256(serverPath, checksum);
        const cli = this.getOpenCLLanguageServerCLI(serverPath, label)
                        .setSubcommand(subcommand);
        const command = cli.buildCommand();
        const output = await cmd.execute(command);
        return output.toString("utf-8").trim();
    }

    private async getInstalledVersion(serverPath: string): Promise<string | null> {
        try {
            const output = await this.execute("--version", serverPath, 'version');
            const match = output.match(/(\d+\.\d+\.\d+)/);
            return match ? match[1] : null;
        } catch (err) {
            this.channel.appendLine(`Version check failed: ${err}`);
            return null;
        }
    }

    // --- Secret / Checksum Helpers ---

    private getStorageKey(isBackup: boolean): string {
        return `opencl-language-server-${os.platform()}-${os.arch()}-sha256${isBackup ? '-bak' : ''}`;
    }

    private async saveChecksum(filePath: string): Promise<void> {
        const hash = crypto.createHash('sha256');
        await pipeline(fs.createReadStream(filePath), hash);
        await this.context.secrets.store(this.getStorageKey(false), hash.digest('hex'));
    }

    private async backupChecksum(): Promise<void> {
        const value = await this.loadChecksum(false);
        if (value) {
            await this.context.secrets.store(this.getStorageKey(true), value);
            await this.deleteChecksum(false);
        }
    }

    private async restoreChecksum(): Promise<void> {
        const value = await this.loadChecksum(true);
        if (value) {
            await this.context.secrets.store(this.getStorageKey(false), value);
            await this.deleteChecksum(true);
        }
    }

    private async loadChecksum(isBackup: boolean): Promise<string | undefined> {
        return await this.context.secrets.get(this.getStorageKey(isBackup));
    }

    private async deleteChecksum(isBackup: boolean): Promise<void> {
        await this.context.secrets.delete(this.getStorageKey(isBackup));
    }

    private writeTextFile(filePath: string, content: string): void {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}
