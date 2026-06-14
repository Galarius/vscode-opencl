const os = require('os');
const fs = require('fs');
const path = require('path');;

const { LanguageServerManager } = require('../../../src/providers/server/manager');

const vscode = require('../../../__mocks__/vscode'); // Uri

const mockChannel = {
    appendLine: jest.fn(),
};

describe('LanguageServerManager Tests', () => {
    let manager;
    const mockContext = {
        globalStorageUri: { fsPath: '/tmp' },
        logUri: { fsPath: '/tmp/log' },
        extension: { packageJSON: { serverVersion: '0.7.1' } },
        secrets: {
            store: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
        }
    };

    beforeEach(() => {
        manager = new LanguageServerManager(mockContext, mockChannel);
        // Reset all secrets spies before every test so call history never bleeds across cases
        mockContext.secrets.store.mockReset();
        mockContext.secrets.get.mockReset();
        mockContext.secrets.delete.mockReset();
    });

    // getLanguageServer
    //
    // Scenarios:
    //  A. Valid cache (binary + compatible version + check interval not elapsed) → return binPath immediately
    //  B. resolveRelease returns null + binary exists → return cached binPath
    //  C. resolveRelease returns null + no binary     → throw
    //  D. resolveRelease returns a release            → download → verify → install → return extractedPath
    //  E. Error during update + binary exists         → log and return cached binPath
    //  F. Error during update + no binary             → rethrow

    describe('getLanguageServer', () => {

        let tmpDir;
        let binPath;

        beforeEach(() => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-gls-'));
            manager.binDir = tmpDir;
            manager.binaryName = 'opencl-language-server';
            manager.lastCheckFile = path.join(tmpDir, 'last-check.txt');
            binPath = path.join(tmpDir, 'opencl-language-server');

            // Stub all collaborators so each scenario only exercises its own branch
            jest.spyOn(manager, 'getInstalledVersion');
            jest.spyOn(manager, 'resolveRelease');
            jest.spyOn(manager, 'findAsset');
            jest.spyOn(manager, 'downloadToFile').mockResolvedValue(undefined);
            jest.spyOn(manager, 'verifySha256').mockResolvedValue(undefined);
            jest.spyOn(manager, 'installNewBinary');

            mockChannel.appendLine.mockClear();
            mockContext.secrets.get.mockReset();
            mockContext.secrets.store.mockReset();
            mockContext.secrets.delete.mockReset();

            // The vscode mock executes the withProgress callback synchronously
            vscode.window.withProgress.mockImplementation((_opts, cb) =>
                cb({ report: jest.fn() })
            );
        });

        afterEach(() => {
            jest.restoreAllMocks();
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        // A: valid cache

        describe('A - valid cache: binary + compatible version + interval not elapsed', () => {

            beforeEach(() => {
                fs.writeFileSync(binPath, 'stub');
                fs.writeFileSync(manager.lastCheckFile, String(Date.now())); // just now → no update needed
                manager.getInstalledVersion.mockResolvedValue('0.7.1');
            });

            it('returns the cached binary path without calling resolveRelease', async () => {
                const result = await manager.discoverLanguageServer();
                expect(result).toBe(binPath);
                expect(manager.resolveRelease).not.toHaveBeenCalled();
            });

            it('does not open the progress notification', async () => {
                await manager.discoverLanguageServer();
                expect(vscode.window.withProgress).not.toHaveBeenCalled();
            });

            it('logs that the existing binary was found', async () => {
                await manager.discoverLanguageServer();
                expect(mockChannel.appendLine).toHaveBeenCalledWith(
                    expect.stringContaining('Found existing OpenCL Language Server')
                );
            });
        });

        // B: resolveRelease → null, binary exists

        describe('B - resolveRelease returns null, binary exists (use cache)', () => {

            beforeEach(() => {
                fs.writeFileSync(binPath, 'stub');
                fs.writeFileSync(manager.lastCheckFile, '0'); // force update check
                manager.getInstalledVersion.mockResolvedValue('0.7.1');
                manager.resolveRelease.mockResolvedValue(null);
            });

            it('returns the cached binary path', async () => {
                expect(await manager.discoverLanguageServer()).toBe(binPath);
            });

            it('logs that it is using the cached binary', async () => {
                await manager.discoverLanguageServer();
                expect(mockChannel.appendLine).toHaveBeenCalledWith(
                    expect.stringContaining('Using cached OpenCL Language Server')
                );
            });

            it('does not attempt to download anything', async () => {
                await manager.discoverLanguageServer();
                expect(manager.downloadToFile).not.toHaveBeenCalled();
            });
        });

        // C: resolveRelease → null, no binary 

        describe('C - resolveRelease returns null, no binary on disk', () => {

            beforeEach(() => {
                manager.getInstalledVersion.mockResolvedValue(null);
                manager.resolveRelease.mockResolvedValue(null);
            });

            it('throws with a message about no compatible release', async () => {
                await expect(manager.discoverLanguageServer()).rejects.toThrow(
                    'No compatible language server release found for pinned version'
                );
            });
        });

        // D: resolveRelease → release, full download + install

        describe('D - resolveRelease returns a release, full install path', () => {

            const fakeRelease = { tag_name: '0.7.1', assets: [] };
            const fakeAsset = {
                name: 'opencl-language-server-linux-x86_64.tar.gz',
                browser_download_url: 'https://example.com/opencl.tar.gz',
                digest: 'sha256:abc123',
            };
            const extractedPath = '/tmp/bin/opencl-language-server';

            beforeEach(() => {
                manager.getInstalledVersion.mockResolvedValue(null);
                manager.resolveRelease.mockResolvedValue(fakeRelease);
                manager.findAsset.mockReturnValue(fakeAsset);
                manager.installNewBinary.mockResolvedValue(extractedPath);
            });

            it('returns the extracted binary path', async () => {
                expect(await manager.discoverLanguageServer()).toBe(extractedPath);
            });

            it('calls downloadToFile with the asset URL and local archive path', async () => {
                await manager.discoverLanguageServer();
                expect(manager.downloadToFile).toHaveBeenCalledWith(
                    fakeAsset.browser_download_url,
                    path.join(tmpDir, fakeAsset.name)
                );
            });

            it('calls verifySha256 with the archive path and asset digest', async () => {
                await manager.discoverLanguageServer();
                expect(manager.verifySha256).toHaveBeenCalledWith(
                    path.join(tmpDir, fakeAsset.name),
                    fakeAsset.digest
                );
            });

            it('calls installNewBinary with the archive path and bin path', async () => {
                await manager.discoverLanguageServer();
                expect(manager.installNewBinary).toHaveBeenCalledWith(
                    path.join(tmpDir, fakeAsset.name),
                    binPath
                );
            });

            it('writes the last-check timestamp file', async () => {
                await manager.discoverLanguageServer();
                expect(fs.existsSync(manager.lastCheckFile)).toBe(true);
                expect(Number(fs.readFileSync(manager.lastCheckFile, 'utf8'))).toBeGreaterThan(0);
            });

            it('runs steps in order: resolveRelease → download → verify → install', async () => {
                const order = [];
                manager.resolveRelease.mockImplementation(async () => { order.push('resolveRelease'); return fakeRelease; });
                manager.downloadToFile.mockImplementation(async () => { order.push('downloadToFile'); });
                manager.verifySha256.mockImplementation(async () => { order.push('verifySha256'); });
                manager.installNewBinary.mockImplementation(async () => { order.push('installNewBinary'); return extractedPath; });

                await manager.discoverLanguageServer();

                expect(order).toEqual(['resolveRelease', 'downloadToFile', 'verifySha256', 'installNewBinary']);
            });
        });

        // E: error during update, binary exists → fallback 

        describe('E - error during update, binary exists (fall back to cache)', () => {

            beforeEach(() => {
                fs.writeFileSync(binPath, 'stub');
                fs.writeFileSync(manager.lastCheckFile, '0');
                manager.getInstalledVersion.mockResolvedValue('0.7.0');
                manager.resolveRelease.mockRejectedValue(new Error('network failure'));
            });

            it('returns the cached binary path instead of throwing', async () => {
                expect(await manager.discoverLanguageServer()).toBe(binPath);
            });

            it('logs the update error', async () => {
                await manager.discoverLanguageServer();
                expect(mockChannel.appendLine).toHaveBeenCalledWith(
                    expect.stringContaining('OpenCL Language Server discovery error')
                );
            });

            it('logs the fallback-to-cache message', async () => {
                await manager.discoverLanguageServer();
                expect(mockChannel.appendLine).toHaveBeenCalledWith(
                    expect.stringContaining('Using cached binary')
                );
            });
        });

        // F: error during update, no binary → rethrow

        describe('F - error during update, no binary on disk (rethrow)', () => {

            beforeEach(() => {
                manager.getInstalledVersion.mockResolvedValue(null);
                manager.resolveRelease.mockRejectedValue(new Error('network failure'));
            });

            it('rethrows the error when there is no cached binary to fall back to', async () => {
                await expect(manager.discoverLanguageServer()).rejects.toThrow('network failure');
            });
        });
    });
});
