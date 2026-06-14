const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const tar = require('tar');
const fflate = require('fflate');

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
        secrets: {}
    };

    beforeEach(() => {
        manager = new LanguageServerManager(mockContext, mockChannel);
    });

    // Binary Verification & Extraction

    describe('LanguageServerManager Binary Verification', () => {

        describe('verifySha256', () => {

            const tmpFile = path.join(os.tmpdir(), `jest-sha256-${process.pid}.txt`);
            const content = 'hello opencl';

            beforeAll(() => {
                fs.writeFileSync(tmpFile, content);
            });

            afterAll(() => {
                if (fs.existsSync(tmpFile)) {
                    fs.unlinkSync(tmpFile);
                }
            });

            it('resolves when hash matches', async () => {
                const expected = crypto.createHash('sha256').update(content).digest('hex');
                await expect(manager.verifySha256(tmpFile, expected)).resolves.toBeUndefined();
            });

            it('resolves when expected hash has leading/trailing whitespace', async () => {
                const expected = crypto.createHash('sha256').update(content).digest('hex');
                await expect(manager.verifySha256(tmpFile, `  ${expected}  `)).resolves.toBeUndefined();
            });

            it('resolves when expected hash is uppercase', async () => {
                const expected = crypto.createHash('sha256').update(content).digest('hex').toUpperCase();
                await expect(manager.verifySha256(tmpFile, expected)).resolves.toBeUndefined();
            });

            it('rejects when hash does not match', async () => {
                await expect(manager.verifySha256(tmpFile, 'deadbeef')).rejects.toThrow('SHA-256 mismatch');
            });

            it('rejects when file does not exist', async () => {
                await expect(manager.verifySha256('/nonexistent/path/file.tar.gz', 'abc123'))
                    .rejects.toThrow();
            });
        });

        describe('verifySha256 - different digest algorithms', () => {

            const tmpFile = path.join(os.tmpdir(), `jest-digest-algo-${process.pid}.txt`);
            const content = 'test content'

            beforeAll(() => { fs.writeFileSync(tmpFile, content); });
            afterAll(() => { if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile); });

            it('accepts when the digest prefix is sha256', async () => {
                const expected = crypto.createHash('sha256').update(content).digest('hex');
                await expect(manager.verifySha256(tmpFile, `sha256:${expected}`)).resolves.toBeUndefined()
            });

            it('rejects when the digest prefix is md5', async () => {
                await expect(manager.verifySha256(tmpFile, 'md5:abc123'))
                    .rejects.toThrow('Unexpected digest algorithm "md5".');
            });

            it('rejects when the digest prefix is sha512', async () => {
                await expect(manager.verifySha256(tmpFile, 'sha512:abc123'))
                    .rejects.toThrow('Unexpected digest algorithm "sha512".');
            });

            it('rejects when the prefix is an empty string (":hash" form)', async () => {
                // ":hash" splits into ["", "hash"] - algo "" is not "sha256"
                await expect(manager.verifySha256(tmpFile, ':abc123'))
                    .rejects.toThrow('Unexpected digest algorithm "".');
            });

            it('rejects with a null digest', async () => {
                await expect(manager.verifySha256(tmpFile, null))
                    .rejects.toThrow('SHA-256 verification failed: null digest');
            });
        });

        // extractArchive

        describe('extractArchive', () => {

            let tmpDir;

            beforeEach(() => {
                tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-extract-'));
            });

            afterEach(() => {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            });

            async function createTarGz(archivePath, binaryName) {
                const binaryPath = path.join(tmpDir, binaryName);
                fs.writeFileSync(binaryPath, '#!/bin/sh\necho "0.7.1"');
                await tar.create({ gzip: true, file: archivePath, cwd: tmpDir }, [binaryName]);
                fs.unlinkSync(binaryPath);
            }

            it('extracts binary from tar.gz and returns its path', async () => {
                const binaryName = 'opencl-language-server';
                const archivePath = path.join(tmpDir, 'archive.tar.gz');

                await createTarGz(archivePath, binaryName);
                await manager.extractArchive(archivePath, tmpDir, binaryName);

                expect(fs.existsSync(path.join(tmpDir, binaryName))).toBe(true);
            });

            it('binary is absent when archive contains a different file', async () => {
                const binaryName = 'opencl-language-server';
                const wrongName = 'other-binary';
                const archivePath = path.join(tmpDir, 'archive.tar.gz');

                const wrongPath = path.join(tmpDir, wrongName);
                fs.writeFileSync(wrongPath, 'dummy');
                await tar.create({ gzip: true, file: archivePath, cwd: tmpDir }, [wrongName]);
                fs.unlinkSync(wrongPath);

                expect(fs.existsSync(archivePath)).toBe(true);

                await expect(manager.extractArchive(archivePath, tmpDir, binaryName)).rejects.toThrow(`Binary "${binaryName}" not found in archive.`);
                expect(fs.existsSync(path.join(tmpDir, binaryName))).toBe(false);
            });

            it('extractArchive returns path for zip', async () => {
                const archivePath = path.join(tmpDir, 'test.zip');
                const binaryName = 'test.exe';
                const content = 'dummy content';

                const files = { [binaryName]: fflate.strToU8(content) };
                fs.writeFileSync(archivePath, fflate.zipSync(files));

                const result = await manager.extractArchive(archivePath, tmpDir, binaryName);
                expect(fs.existsSync(result)).toBe(true);
            });
        });
    });
});