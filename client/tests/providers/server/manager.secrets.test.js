const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

});