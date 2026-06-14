const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const tar = require('tar');
const fflate = require('fflate');

const { LanguageServerManager } = require('../../../src/providers/server/manager');
const vscode = require('../../../__mocks__/vscode');

const mockChannel = {
    appendLine: jest.fn(),
};

describe('LanguageServerManager Tests', () => {
    let manager;
    const mockContext = {
        globalStorageUri: { fsPath: '/tmp' },
        logUri: { fsPath: '/tmp/log' },
        extension: {
            packageJSON: { serverVersion: '0.7.1' }
        },
        secrets: {
            store: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(() => {
        manager = new LanguageServerManager(mockContext, mockChannel);
        // Reset all secrets spies before every test so call history never bleeds across cases
        mockContext.secrets.store.mockReset();
        mockContext.secrets.get.mockReset();
        mockContext.secrets.delete.mockReset();
    });

    // resolveRelease

    describe('resolveRelease', () => {
        const originalFetch = global.fetch;

        /** @param {object} release */
        function mockLatest(release) {
            global.fetch = jest.fn().mockResolvedValue({
                status: 200,
                ok: true,
                json: () => Promise.resolve(release),
                headers: { get: () => null },
            });
        }

        /** @param {object[]} releases */
        function mockAll(releases) {
            global.fetch = jest.fn()
                // first call: /releases/latest  - return something beyond ceiling
                .mockResolvedValueOnce({
                    status: 200,
                    ok: true,
                    json: () => Promise.resolve(releases[0]),
                    headers: { get: () => null },
                })
                // second call: /releases  - return full list
                .mockResolvedValueOnce({
                    status: 200,
                    ok: true,
                    json: () => Promise.resolve(releases),
                    headers: { get: () => null },
                });
        }

        /** @param {number} status */
        function mockError(status) {
            global.fetch = jest.fn().mockResolvedValue({
                status,
                statusText: 'Mocked',
                ok: false,
                headers: { get: () => null },
            });
        }

        afterEach(() => {
            global.fetch = originalFetch;
            jest.clearAllMocks();
        });

        // helper to build a minimal release object
        function release(tag, assetNames = []) {
            return {
                tag_name: tag,
                assets: assetNames.map(name => ({
                    name,
                    browser_download_url: `https://example.com/${name}`,
                    digest: 'sha256:abc123',
                })),
            };
        }

        it('returns the latest release when it is within the compatible range', async () => {
            mockLatest(release('0.7.2'));
            const result = await manager.resolveRelease('0.7.1', null);
            expect(result.tag_name).toBe('0.7.2');
        });

        it('returns the latest release when no binary is installed yet', async () => {
            mockLatest(release('0.7.1'));
            const result = await manager.resolveRelease(null, null);
            expect(result.tag_name).toBe('0.7.1');
        });

        it('returns null when installed version equals the latest compatible release', async () => {
            mockLatest(release('0.7.2'));
            const result = await manager.resolveRelease('0.7.2', null);
            expect(result).toBeNull();
        });

        it('returns null when installed version is newer than latest (downgrade guard)', async () => {
            mockLatest(release('0.7.2'));
            const result = await manager.resolveRelease('0.7.3', null);
            expect(result).toBeNull();
        });

        it('fetches all releases when latest is beyond the ceiling', async () => {
            mockAll([release('0.8.0'), release('0.7.5'), release('0.7.2'), release('0.6.0')]);
            const result = await manager.resolveRelease('0.7.1', null);
            expect(result.tag_name).toBe('0.7.5'); // highest within [0.7.1, 0.8.0)
        });

        it('returns the highest compatible release, not just the first match', async () => {
            mockAll([release('0.8.0'), release('0.7.3'), release('0.7.5'), release('0.7.1')]);
            const result = await manager.resolveRelease('0.7.1', null);
            expect(result.tag_name).toBe('0.7.5');
        });

        it('shows an info message when a newer incompatible version exists', async () => {
            mockAll([release('0.8.0'), release('0.7.3')]);
            await manager.resolveRelease('0.7.1', null);
            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
                expect.stringContaining('requires an extension update')
            );
        });

        it('returns null when no compatible release exists in the full list', async () => {
            mockAll([release('0.8.0'), release('0.9.0'), release('1.0.0')]);
            const result = await manager.resolveRelease('0.7.1', null);
            expect(result).toBeNull();
        });

        it('returns null when installed version already equals the best compatible release', async () => {
            mockAll([release('0.8.0'), release('0.7.3')]);
            const result = await manager.resolveRelease('0.7.3', null);
            expect(result).toBeNull();
        });

        it('throws on 403 rate limit', async () => {
            mockError(403);
            await expect(manager.resolveRelease('0.7.1', null))
                .rejects.toThrow('rate limit');
        });

        it('throws on 404', async () => {
            mockError(404);
            await expect(manager.resolveRelease('0.7.1', null))
                .rejects.toThrow('Not found');
        });

        it('makes only one fetch call when latest is compatible', async () => {
            mockLatest(release('0.7.3'));
            await manager.resolveRelease('0.7.1', null);
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        it('makes two fetch calls when latest is beyond the ceiling', async () => {
            mockAll([release('0.8.0'), release('0.7.3')]);
            await manager.resolveRelease('0.7.1', null);
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });

    // vscode.secrets - Checksum Helpers

    describe('vscode.secrets - Checksum Helpers', () => {

        const primaryKey = `opencl-language-server-${os.platform()}-${os.arch()}-sha256`;
        const backupKey = `opencl-language-server-${os.platform()}-${os.arch()}-sha256-bak`;

        let tmpFile;

        beforeEach(() => {
            tmpFile = path.join(os.tmpdir(), `jest-secrets-${process.pid}-${Date.now()}.bin`);
            fs.writeFileSync(tmpFile, 'opencl-test-content');
        });

        afterEach(() => {
            if (fs.existsSync(tmpFile)) {
                fs.unlinkSync(tmpFile);
            }
        });

        // saveChecksum

        describe('saveChecksum', () => {

            it('calls secrets.store with the primary key', async () => {
                await manager.saveChecksum(tmpFile);

                expect(mockContext.secrets.store).toHaveBeenCalledTimes(1);
                expect(mockContext.secrets.store).toHaveBeenCalledWith(
                    primaryKey,
                    expect.any(String)
                );
            });

            it('stores the correct SHA-256 hex digest', async () => {
                await manager.saveChecksum(tmpFile);

                const expectedHash = crypto
                    .createHash('sha256')
                    .update(fs.readFileSync(tmpFile))
                    .digest('hex');

                expect(mockContext.secrets.store).toHaveBeenCalledWith(primaryKey, expectedHash);
            });

            it('does not touch the backup key', async () => {
                await manager.saveChecksum(tmpFile);

                const storeCalls = mockContext.secrets.store.mock.calls;
                const touchedKeys = storeCalls.map(([key]) => key);
                expect(touchedKeys).not.toContain(backupKey);
            });

            it('does not call secrets.get or secrets.delete', async () => {
                await manager.saveChecksum(tmpFile);

                expect(mockContext.secrets.get).not.toHaveBeenCalled();
                expect(mockContext.secrets.delete).not.toHaveBeenCalled();
            });
        });

        // backupChecksum

        describe('backupChecksum', () => {

            it('reads the primary key and copies value to the backup key', async () => {
                const existingHash = 'aabbccdd1122334455';
                mockContext.secrets.get.mockResolvedValue(existingHash);

                await manager.backupChecksum();

                expect(mockContext.secrets.get).toHaveBeenCalledWith(primaryKey);
                expect(mockContext.secrets.store).toHaveBeenCalledWith(backupKey, existingHash);
            });

            it('deletes the primary key after copying to backup', async () => {
                mockContext.secrets.get.mockResolvedValue('somehash');

                await manager.backupChecksum();

                expect(mockContext.secrets.delete).toHaveBeenCalledWith(primaryKey);
            });

            it('calls secrets in order: get → store(backup) → delete(primary)', async () => {
                const callOrder = [];
                mockContext.secrets.get.mockImplementation(() => {
                    callOrder.push('get');
                    return Promise.resolve('hashvalue');
                });
                mockContext.secrets.store.mockImplementation(() => {
                    callOrder.push('store');
                    return Promise.resolve();
                });
                mockContext.secrets.delete.mockImplementation(() => {
                    callOrder.push('delete');
                    return Promise.resolve();
                });

                await manager.backupChecksum();

                expect(callOrder).toEqual(['get', 'store', 'delete']);
            });

            it('does nothing when there is no existing primary checksum', async () => {
                mockContext.secrets.get.mockResolvedValue(undefined);

                await manager.backupChecksum();

                expect(mockContext.secrets.store).not.toHaveBeenCalled();
                expect(mockContext.secrets.delete).not.toHaveBeenCalled();
            });
        });

        // restoreChecksum

        describe('restoreChecksum', () => {

            it('reads the backup key and copies value to the primary key', async () => {
                const backedUpHash = 'ff00ff00cafebabe';
                mockContext.secrets.get.mockResolvedValue(backedUpHash);

                await manager.restoreChecksum();

                expect(mockContext.secrets.get).toHaveBeenCalledWith(backupKey);
                expect(mockContext.secrets.store).toHaveBeenCalledWith(primaryKey, backedUpHash);
            });

            it('deletes the backup key after restoring to primary', async () => {
                mockContext.secrets.get.mockResolvedValue('backedup');

                await manager.restoreChecksum();

                expect(mockContext.secrets.delete).toHaveBeenCalledWith(backupKey);
            });

            it('calls secrets in order: get(backup) → store(primary) → delete(backup)', async () => {
                const callOrder = [];
                mockContext.secrets.get.mockImplementation(() => {
                    callOrder.push('get');
                    return Promise.resolve('hashvalue');
                });
                mockContext.secrets.store.mockImplementation(() => {
                    callOrder.push('store');
                    return Promise.resolve();
                });
                mockContext.secrets.delete.mockImplementation(() => {
                    callOrder.push('delete');
                    return Promise.resolve();
                });

                await manager.restoreChecksum();

                expect(callOrder).toEqual(['get', 'store', 'delete']);
            });

            it('does nothing when there is no backup checksum', async () => {
                mockContext.secrets.get.mockResolvedValue(undefined);

                await manager.restoreChecksum();

                expect(mockContext.secrets.store).not.toHaveBeenCalled();
                expect(mockContext.secrets.delete).not.toHaveBeenCalled();
            });
        });

        // deleteChecksum

        describe('deleteChecksum', () => {

            it('deletes the primary key when isBackup is false', async () => {
                await manager.deleteChecksum(false);

                expect(mockContext.secrets.delete).toHaveBeenCalledTimes(1);
                expect(mockContext.secrets.delete).toHaveBeenCalledWith(primaryKey);
            });

            it('deletes the backup key when isBackup is true', async () => {
                await manager.deleteChecksum(true);

                expect(mockContext.secrets.delete).toHaveBeenCalledTimes(1);
                expect(mockContext.secrets.delete).toHaveBeenCalledWith(backupKey);
            });

            it('does not call secrets.store or secrets.get', async () => {
                await manager.deleteChecksum(false);

                expect(mockContext.secrets.store).not.toHaveBeenCalled();
                expect(mockContext.secrets.get).not.toHaveBeenCalled();
            });
        });

        // loadChecksum

        describe('loadChecksum', () => {

            it('reads the primary key when isBackup is false', async () => {
                mockContext.secrets.get.mockResolvedValue('myhash');

                const result = await manager.loadChecksum(false);

                expect(mockContext.secrets.get).toHaveBeenCalledWith(primaryKey);
                expect(result).toBe('myhash');
            });

            it('reads the backup key when isBackup is true', async () => {
                mockContext.secrets.get.mockResolvedValue('backuphash');

                const result = await manager.loadChecksum(true);

                expect(mockContext.secrets.get).toHaveBeenCalledWith(backupKey);
                expect(result).toBe('backuphash');
            });

            it('returns undefined when the key is absent', async () => {
                mockContext.secrets.get.mockResolvedValue(undefined);

                const result = await manager.loadChecksum(false);

                expect(result).toBeUndefined();
            });
        });
    });

    // installNewBinary - Backup Logic
    //
    // installNewBinary(archivePath, binPath):
    //   1. If binPath exists  → rename to .bak, backupChecksum()
    //   2. extractArchive(archivePath, binDir, binaryName)
    //   3. saveChecksum(extractedPath)
    //   4. getInstalledVersion(extractedPath)
    //      success → delete .bak, deleteChecksum(true)
    //      failure → rename .bak back, restoreChecksum(), rethrow
    //   5. finally: delete archivePath

    describe('installNewBinary - Backup Logic', () => {

        let tmpDir;
        let archivePath;
        let binPath;
        let backupPath;

        // Expected secrets keys
        const primaryKey = `opencl-language-server-${os.platform()}-${os.arch()}-sha256`;
        const backupKey = `opencl-language-server-${os.platform()}-${os.arch()}-sha256-bak`;

        // Build a minimal valid tar.gz archive containing the binary
        async function createArchive(dir, binaryName, scriptContent = '#!/bin/sh\necho "0.7.1"') {
            const binaryPath = path.join(dir, binaryName);
            fs.writeFileSync(binaryPath, scriptContent);
            const archive = path.join(dir, `${binaryName}.tar.gz`);
            await tar.create({ gzip: true, file: archive, cwd: dir }, [binaryName]);
            fs.unlinkSync(binaryPath);
            return archive;
        }

        beforeEach(async () => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-install-'));

            // Override binDir on the manager so installNewBinary extracts here
            manager.binDir = tmpDir;
            manager.binaryName = 'opencl-language-server';

            binPath = path.join(tmpDir, 'opencl-language-server');
            backupPath = binPath + '.bak';
            archivePath = await createArchive(tmpDir, 'opencl-language-server');
        });

        afterEach(() => {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        function mockVersionSuccess(version = '0.7.1') {
            // saveChecksum calls pipeline+createReadStream; 
            // getInstalledVersion calls loadChecksum then verifySha256 
            // then cmd.execute. We stub the whole
            // private method to keep tests focused on secrets interactions.
            jest.spyOn(manager, 'getInstalledVersion').mockResolvedValue(version);
        }

        function mockVersionFailure() {
            jest.spyOn(manager, 'getInstalledVersion').mockResolvedValue(null);
        }

        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('success path - fresh install (no existing binary)', () => {

            beforeEach(() => {
                mockVersionSuccess();
                // secrets: primary key already holds a hash from saveChecksum
                mockContext.secrets.get.mockResolvedValue(undefined); // no backup to worry about
                mockContext.secrets.store.mockResolvedValue(undefined);
                mockContext.secrets.delete.mockResolvedValue(undefined);
            });

            it('does not call backupChecksum (no existing binary)', async () => {
                await manager.installNewBinary(archivePath, binPath);

                // backupChecksum → secrets.get(primaryKey) then secrets.store(backupKey, ...)
                // With no prior binary it should never touch the backup key via store
                const storeBackupCalls = mockContext.secrets.store.mock.calls
                    .filter(([key]) => key === backupKey);
                expect(storeBackupCalls).toHaveLength(0);
            });

            it('calls secrets.store with the primary key (saveChecksum)', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(mockContext.secrets.store).toHaveBeenCalledWith(primaryKey, expect.any(String));
            });

            it('does not call secrets.delete (no backup to clean up)', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(mockContext.secrets.delete).not.toHaveBeenCalled();
            });

            it('archive is removed after successful install', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(fs.existsSync(archivePath)).toBe(false);
            });
        });

        // Success path - upgrade (existing binary present)

        describe('success path - upgrade (existing binary)', () => {

            beforeEach(() => {
                // Place a fake existing binary so installNewBinary triggers backup
                fs.writeFileSync(binPath, '#!/bin/sh\necho "0.7.0"');
                mockVersionSuccess('0.7.1');

                // secrets.get for backupChecksum: primary key has the old hash
                mockContext.secrets.get.mockResolvedValue('oldhash');
                mockContext.secrets.store.mockResolvedValue(undefined);
                mockContext.secrets.delete.mockResolvedValue(undefined);
            });

            it('calls secrets.get with the primary key to read the old checksum', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(mockContext.secrets.get).toHaveBeenCalledWith(primaryKey);
            });

            it('stores the old checksum under the backup key', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(mockContext.secrets.store).toHaveBeenCalledWith(backupKey, 'oldhash');
            });

            it('deletes the primary key after backing it up', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(mockContext.secrets.delete).toHaveBeenCalledWith(primaryKey);
            });

            it('saves the new checksum under the primary key', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(mockContext.secrets.store).toHaveBeenCalledWith(primaryKey, expect.any(String));
            });

            it('deletes the backup key after confirming new binary version', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(mockContext.secrets.delete).toHaveBeenCalledWith(backupKey);
            });

            it('secrets calls follow the expected order: get → store(bak) → delete(primary) → store(primary) → delete(bak)', async () => {
                const callLog = [];

                mockContext.secrets.get.mockImplementation((key) => {
                    callLog.push(`get(${key === primaryKey ? 'primary' : 'backup'})`);
                    return Promise.resolve('oldhash');
                });
                mockContext.secrets.store.mockImplementation((key) => {
                    callLog.push(`store(${key === primaryKey ? 'primary' : 'backup'})`);
                    return Promise.resolve();
                });
                mockContext.secrets.delete.mockImplementation((key) => {
                    callLog.push(`delete(${key === primaryKey ? 'primary' : 'backup'})`);
                    return Promise.resolve();
                });

                await manager.installNewBinary(archivePath, binPath);

                expect(callLog).toEqual([
                    'get(primary)',      // backupChecksum: load existing hash
                    'store(backup)',     // backupChecksum: save it to .bak
                    'delete(primary)',   // backupChecksum: clear primary
                    'store(primary)',    // saveChecksum:   persist new binary hash
                    'delete(backup)',    // success:        discard the backup
                ]);
            });

            it('removes the .bak file after successful upgrade', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(fs.existsSync(backupPath)).toBe(false);
            });

            it('archive is cleaned up after successful upgrade', async () => {
                await manager.installNewBinary(archivePath, binPath);

                expect(fs.existsSync(archivePath)).toBe(false);
            });
        });

        // Failure path - version verification fails, backup is restored 

        describe('failure path - version check fails after extraction', () => {

            beforeEach(() => {
                // Existing binary so the backup branch is taken
                fs.writeFileSync(binPath, '#!/bin/sh\necho "0.7.0"');
                mockVersionFailure(); // getInstalledVersion returns null → error thrown

                mockContext.secrets.get.mockResolvedValue('oldhash');
                mockContext.secrets.store.mockResolvedValue(undefined);
                mockContext.secrets.delete.mockResolvedValue(undefined);
            });

            it('rejects with "Failed to verify version" error', async () => {
                await expect(manager.installNewBinary(archivePath, binPath))
                    .rejects.toThrow('Failed to verify version');
            });

            it('calls secrets.get with the backup key to restore old checksum', async () => {
                await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();

                expect(mockContext.secrets.get).toHaveBeenCalledWith(backupKey);
            });

            it('restores the old checksum back to the primary key', async () => {
                await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();

                expect(mockContext.secrets.store).toHaveBeenCalledWith(primaryKey, 'oldhash');
            });

            it('deletes the backup key after restoring', async () => {
                await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();

                expect(mockContext.secrets.delete).toHaveBeenCalledWith(backupKey);
            });

            it('does NOT delete the backup key for a successful install scenario (guard)', async () => {
                // On failure path deleteChecksum(true) must NOT be called before restore
                const deleteBackupCalls = () =>
                    mockContext.secrets.delete.mock.calls.filter(([key]) => key === backupKey);

                await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();

                // deleteChecksum(true) may be called once - but only from restoreChecksum
                // (which calls deleteChecksum(true) after moving value back to primary)
                // Verify it was NOT called with backupKey before restoreChecksum ran.
                // We confirm this by checking store(primary) always precedes delete(backup).
                const callLog = [];
                mockContext.secrets.store.mockReset();
                mockContext.secrets.delete.mockReset();
                mockContext.secrets.get.mockReset();

                mockContext.secrets.get.mockImplementation((key) => {
                    callLog.push(`get(${key === primaryKey ? 'primary' : 'backup'})`);
                    return Promise.resolve('oldhash');
                });
                mockContext.secrets.store.mockImplementation((key) => {
                    callLog.push(`store(${key === primaryKey ? 'primary' : 'backup'})`);
                    return Promise.resolve();
                });
                mockContext.secrets.delete.mockImplementation((key) => {
                    callLog.push(`delete(${key === primaryKey ? 'primary' : 'backup'})`);
                    return Promise.resolve();
                });

                // Re-create archive since it was cleaned up
                const newArchive = await createArchive(tmpDir, 'opencl-language-server');
                fs.writeFileSync(binPath, '#!/bin/sh\necho "0.7.0"'); // restore existing binary
                await expect(manager.installNewBinary(newArchive, binPath)).rejects.toThrow();

                // restore sequence: get(backup) → store(primary) → delete(backup)
                const restoreSlice = callLog.slice(callLog.indexOf('get(backup)'));
                expect(restoreSlice).toEqual(['get(backup)', 'store(primary)', 'delete(backup)']);
            });

            it('restores the .bak file to the original binary path', async () => {
                await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();

                expect(fs.existsSync(binPath)).toBe(true);
                expect(fs.existsSync(backupPath)).toBe(false);
            });

            it('archive is cleaned up even on failure', async () => {
                await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();

                expect(fs.existsSync(archivePath)).toBe(false);
            });
        });

        // Failure path - no prior binary, extraction fails

        describe('failure path - extraction fails with no prior binary', () => {

            it('does not attempt to restore when there was no existing binary', async () => {
                // Archive that does NOT contain the expected binary name
                const wrongBinaryName = 'wrong-binary';
                const badArchivePath = await createArchive(tmpDir, wrongBinaryName);

                await expect(manager.installNewBinary(badArchivePath, binPath))
                    .rejects.toThrow(`Binary "opencl-language-server" not found in archive.`);

                // No backup was created, so no restore calls should happen
                const storeBackupCalls = mockContext.secrets.store.mock.calls
                    .filter(([key]) => key === backupKey);
                expect(storeBackupCalls).toHaveLength(0);

                const deleteBackupCalls = mockContext.secrets.delete.mock.calls
                    .filter(([key]) => key === backupKey);
                expect(deleteBackupCalls).toHaveLength(0);
            });
        });
    });
});