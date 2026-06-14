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
        secrets: {}
    };

    beforeEach(() => {
        manager = new LanguageServerManager(mockContext, mockChannel);
    });


    // Update & Fetch Logic

    describe('LanguageServerManager Update Logic', () => {
        let tmpFile;

        beforeEach(() => {
            tmpFile = path.join(os.tmpdir(), `jest-update-${process.pid}.txt`);
        });

        afterEach(() => {
            if (fs.existsSync(tmpFile)) {
                fs.unlinkSync(tmpFile);
            }
        });

        // shouldCheckForUpdate

        it('shouldCheckForUpdate returns true when file does not exist', () => {
            if (fs.existsSync(tmpFile)) {
                fs.unlinkSync(tmpFile);
            }
            expect(manager.shouldCheckForUpdate(tmpFile)).toBe(true);
        });

        it('returns false when checked less than 24 hours ago', () => {
            fs.writeFileSync(tmpFile, String(Date.now()));
            expect(manager.shouldCheckForUpdate(tmpFile)).toBe(false);
        });

        it('returns true when last check was more than 24 hours ago', () => {
            const longAgo = Date.now() - manager.CHECK_INTERVAL_MS - 1000;
            fs.writeFileSync(tmpFile, String(longAgo));
            expect(manager.shouldCheckForUpdate(tmpFile)).toBe(true);
        });

        it('returns true when file contains non-numeric content', () => {
            fs.writeFileSync(tmpFile, 'not-a-timestamp');
            expect(manager.shouldCheckForUpdate(tmpFile)).toBe(true);
        });

        // githubFetch

        describe('githubFetch Update Logic', () => {

            const originalFetch = global.fetch;

            afterEach(() => {
                global.fetch = originalFetch;
            });

            function mockFetchStatus(status) {
                global.fetch = jest.fn().mockResolvedValue({
                    status,
                    statusText: 'Mocked',
                    ok: status >= 200 && status < 300,
                    headers: { get: () => null },
                });
            }


            it('throws rate limit error on 403', async () => {
                mockFetchStatus(403);
                await expect(manager.githubFetch('https://example.com'))
                    .rejects.toThrow('rate limit');
            });

            it('throws not found error on 404', async () => {
                mockFetchStatus(404);
                await expect(manager.githubFetch('https://example.com'))
                    .rejects.toThrow('Not found');
            });

            it('throws generic error on 500', async () => {
                mockFetchStatus(500);
                await expect(manager.githubFetch('https://example.com'))
                    .rejects.toThrow('GitHub API error 500');
            });

            it('resolves on 200', async () => {
                mockFetchStatus(200);
                await expect(manager.githubFetch('https://example.com'))
                    .resolves.toBeDefined();
            });
        });
    });
});