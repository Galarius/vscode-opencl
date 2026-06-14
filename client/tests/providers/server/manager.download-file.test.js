const os = require('os');
const fs = require('fs');
const path = require('path');

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
        secrets: { }
    };

    beforeEach(() => {
        manager = new LanguageServerManager(mockContext, mockChannel);
    });

    // downloadToFile

    describe('downloadToFile', () => {

        let tmpDir;
        let destPath;
        const originalFetch = global.fetch;

        beforeEach(() => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-download-'));
            destPath = path.join(tmpDir, 'binary.tar.gz');
        });

        afterEach(() => {
            global.fetch = originalFetch;
            fs.rmSync(tmpDir, { recursive: true, force: true });
        });

        function mockDownloadFetch(status, bodyContent = 'binary data') {
            const { Readable } = require('stream');
            const body = Readable.from(Buffer.from(bodyContent));
            global.fetch = jest.fn().mockResolvedValue({
                status,
                ok: status >= 200 && status < 300,
                body,
            });
        }

        it('writes the response body to the destination file on 200', async () => {
            const content = 'mock binary content';
            mockDownloadFetch(200, content);

            await manager.downloadToFile('https://example.com/binary.tar.gz', destPath);

            expect(fs.existsSync(destPath)).toBe(true);
            expect(fs.readFileSync(destPath, 'utf8')).toBe(content);
        });

        it('calls fetch with redirect:follow', async () => {
            mockDownloadFetch(200);
            await manager.downloadToFile('https://example.com/binary.tar.gz', destPath);

            expect(global.fetch).toHaveBeenCalledWith(
                'https://example.com/binary.tar.gz',
                expect.objectContaining({ redirect: 'follow' })
            );
        });

        it('throws on HTTP 404', async () => {
            mockDownloadFetch(404);
            await expect(manager.downloadToFile('https://example.com/binary.tar.gz', destPath))
                .rejects.toThrow('Download failed (HTTP 404)');
        });

        it('throws on HTTP 500', async () => {
            mockDownloadFetch(500);
            await expect(manager.downloadToFile('https://example.com/binary.tar.gz', destPath))
                .rejects.toThrow('Download failed (HTTP 500)');
        });

        it('throws on HTTP 403', async () => {
            mockDownloadFetch(403);
            await expect(manager.downloadToFile('https://example.com/binary.tar.gz', destPath))
                .rejects.toThrow('Download failed (HTTP 403)');
        });

        it('does not create the destination file when the response is not ok', async () => {
            mockDownloadFetch(404);
            await expect(
                manager.downloadToFile('https://example.com/binary.tar.gz', destPath)
            ).rejects.toThrow();

            expect(fs.existsSync(destPath)).toBe(false);
        });
    });
});
