const os = require('os');
const fs = require('fs');
const path = require('path');
const tar = require('tar');

const { LanguageServerManager } = require('../../../src/providers/server/manager');

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

     describe('installNewBinary - renameSync fails when backing up existing binary', () => {

        let tmpDir;
        let binPath;
        let archivePath;

        async function createArchive(dir, binaryName) {
            const binaryPath = path.join(dir, binaryName);
            fs.writeFileSync(binaryPath, '#!/bin/sh\necho "0.7.1"');
            const archive = path.join(dir, `${binaryName}.tar.gz`);
            await tar.create({ gzip: true, file: archive, cwd: dir }, [binaryName]);
            fs.unlinkSync(binaryPath);
            return archive;
        }

        beforeEach(async () => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-rename-'));
            manager.binDir = tmpDir;
            manager.binaryName = 'opencl-language-server';
            binPath = path.join(tmpDir, 'opencl-language-server');
            archivePath = await createArchive(tmpDir, 'opencl-language-server');

            fs.writeFileSync(binPath, 'old binary');

            jest.spyOn(fs.promises, 'rename').mockImplementation(() => {
                throw Object.assign(new Error('EPERM: operation not permitted, rename'), { code: 'EPERM' });
            });

            mockContext.secrets.get.mockReset();
            mockContext.secrets.store.mockReset();
            mockContext.secrets.delete.mockReset();
        });

        afterEach(() => {
            jest.restoreAllMocks();
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        it('rethrows the rename error', async () => {
            await expect(manager.installNewBinary(archivePath, binPath))
                .rejects.toThrow('EPERM');
        });

        it('cleans up the archive in finally even when rename fails', async () => {
            await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();
            expect(fs.existsSync(archivePath)).toBe(false);
        });

        it('does not call backupChecksum when rename fails before the checksum step', async () => {
            await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();
            // backupChecksum calls secrets.get - it must not have been reached
            expect(mockContext.secrets.get).not.toHaveBeenCalled();
        });

        it('does not attempt to restore the binary (backupPath was never created)', async () => {
            await expect(manager.installNewBinary(archivePath, binPath)).rejects.toThrow();
            const backupPath = binPath + '.bak';
            // The restore branch only runs when backupPath exists on disk
            expect(fs.existsSync(backupPath)).toBe(false);
            // And secrets.store must not have been called for a restore
            expect(mockContext.secrets.store).not.toHaveBeenCalled();
        });
    });
});