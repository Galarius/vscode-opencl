const os = require('os');
const fs = require('fs');
const path = require('path');

const cmd = require('../../../src/commands/cmd');
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

    // getInstalledVersion
    //
    // Expected sequence: loadChecksum(false) → verifySha256(path, checksum) → cmd.execute
    // Any failure in the chain must be caught internally and return null.

    describe('getInstalledVersion', () => {

        const fakePath = '/tmp/opencl-language-server';
        const fakeHash = 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899';

        beforeEach(() => {
            jest.spyOn(manager, 'loadChecksum');
            jest.spyOn(manager, 'verifySha256');
            jest.spyOn(cmd, 'execute');
        });

        afterEach(() => {
            jest.restoreAllMocks();
            mockContext.secrets.get.mockReset();
        });

        // Happy path

        it('returns the version string when all three steps succeed', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockResolvedValue(undefined);
            cmd.execute.mockResolvedValue(Buffer.from('opencl-language-server 0.7.1'));

            const result = await manager.getInstalledVersion(fakePath);

            expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('OpenCL.server.debug', null);
            expect(result).toBe('0.7.1');
        });

        it('calls loadChecksum with isBackup=false', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockResolvedValue(undefined);
            cmd.execute.mockResolvedValue(Buffer.from('0.7.1'));

            await manager.getInstalledVersion(fakePath);

            expect(manager.loadChecksum).toHaveBeenCalledWith(false);
        });

        it('calls verifySha256 with the server path and the loaded checksum', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockResolvedValue(undefined);
            cmd.execute.mockResolvedValue(Buffer.from('0.7.1'));

            await manager.getInstalledVersion(fakePath);

            expect(manager.verifySha256).toHaveBeenCalledWith(fakePath, fakeHash);
        });

        it('calls cmd.execute with the quoted server path and --version flag', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockResolvedValue(undefined);
            cmd.execute.mockResolvedValue(Buffer.from('0.7.1'));

            await manager.getInstalledVersion(fakePath);

            expect(cmd.execute).toHaveBeenCalledWith(`"${fakePath}" --version`);
        });

        it('calls the three steps in order: loadChecksum → verifySha256 → cmd.execute', async () => {
            const callOrder = [];

            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.loadChecksum.mockImplementation(async (...args) => {
                callOrder.push('loadChecksum');
                // delegate to real implementation so secrets.get is actually called
                return mockContext.secrets.get();
            });
            manager.verifySha256.mockImplementation(async () => {
                callOrder.push('verifySha256');
            });
            cmd.execute.mockImplementation(async () => {
                callOrder.push('cmd.execute');
                return Buffer.from('0.7.1');
            });

            await manager.getInstalledVersion(fakePath);

            expect(callOrder).toEqual(['loadChecksum', 'verifySha256', 'cmd.execute']);
        });

        it('extracts a version from multi-word output', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockResolvedValue(undefined);
            cmd.execute.mockResolvedValue(Buffer.from('opencl-language-server version 0.7.2\n'));

            const result = await manager.getInstalledVersion(fakePath);

            expect(result).toBe('0.7.2');
        });

        // Failure: no checksum stored─

        it('returns null when loadChecksum returns undefined', async () => {
            mockContext.secrets.get.mockResolvedValue(undefined);

            const result = await manager.getInstalledVersion(fakePath);

            expect(result).toBeNull();
        });

        it('does not call verifySha256 when checksum is missing', async () => {
            mockContext.secrets.get.mockResolvedValue(undefined);

            await manager.getInstalledVersion(fakePath);

            expect(manager.verifySha256).not.toHaveBeenCalled();
        });

        it('does not call cmd.execute when checksum is missing', async () => {
            mockContext.secrets.get.mockResolvedValue(undefined);

            await manager.getInstalledVersion(fakePath);

            expect(cmd.execute).not.toHaveBeenCalled();
        });

        // Failure: checksum mismatch

        it('returns null when verifySha256 rejects', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockRejectedValue(new Error('SHA-256 mismatch'));

            const result = await manager.getInstalledVersion(fakePath);

            expect(result).toBeNull();
        });

        it('does not call cmd.execute when verifySha256 fails', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockRejectedValue(new Error('SHA-256 mismatch'));

            await manager.getInstalledVersion(fakePath);

            expect(cmd.execute).not.toHaveBeenCalled();
        });

        // Failure: binary execution fails

        it('returns null when cmd.execute rejects', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockResolvedValue(undefined);
            cmd.execute.mockRejectedValue(new Error('spawn error'));

            const result = await manager.getInstalledVersion(fakePath);

            expect(result).toBeNull();
        });

        it('returns null when cmd.execute output contains no version pattern', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockResolvedValue(undefined);
            cmd.execute.mockResolvedValue(Buffer.from('unexpected output'));

            const result = await manager.getInstalledVersion(fakePath);

            expect(result).toBeNull();
        });

        it('returns null when cmd.execute output is empty', async () => {
            mockContext.secrets.get.mockResolvedValue(fakeHash);
            manager.verifySha256.mockResolvedValue(undefined);
            cmd.execute.mockResolvedValue(Buffer.from(''));

            const result = await manager.getInstalledVersion(fakePath);

            expect(result).toBeNull();
        });

        // Error logging─

        it('logs to the output channel on any failure', async () => {
            mockContext.secrets.get.mockResolvedValue(undefined); // triggers "No checksum found"
            mockChannel.appendLine.mockClear();

            await manager.getInstalledVersion(fakePath);

            expect(mockChannel.appendLine).toHaveBeenCalledWith(
                expect.stringContaining('Version check failed')
            );
        });

        it('does not throw - always returns null on error', async () => {
            mockContext.secrets.get.mockRejectedValue(new Error('secrets storage unavailable'));

            await expect(manager.getInstalledVersion(fakePath)).resolves.toBeNull();
        });
    });
});
