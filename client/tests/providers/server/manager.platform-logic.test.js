const os = require('os');

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
        }
    };

    beforeEach(() => {
        manager = new LanguageServerManager(mockContext, mockChannel);
    });


    // Platform & Asset Logic

    describe('LanguageServerManager Platform Logic', () => {

        // getBinaryName

        it('returns .exe on win32', () => {
            expect(manager.getBinaryName('win32')).toBe('opencl-language-server.exe');
        });

        it('returns plain name on darwin', () => {
            expect(manager.getBinaryName('darwin')).toBe('opencl-language-server');
        });

        it('returns plain name on linux', () => {
            expect(manager.getBinaryName('linux')).toBe('opencl-language-server');
        });

        // getAssetName

        it('returns tar.gz for darwin/arm64', () => {
            expect(manager.getAssetName('darwin', 'arm64'))
                .toBe('opencl-language-server-darwin-arm64.tar.gz');
        });

        it('returns tar.gz for darwin/x64 mapped to x86_64', () => {
            expect(manager.getAssetName('darwin', 'x64'))
                .toBe('opencl-language-server-darwin-x86_64.tar.gz');
        });

        it('returns tar.gz for linux/x64', () => {
            expect(manager.getAssetName('linux', 'x64'))
                .toBe('opencl-language-server-linux-x86_64.tar.gz');
        });

        it('returns zip for win32/x64', () => {
            expect(manager.getAssetName('win32', 'x64'))
                .toBe('opencl-language-server-win32-x86_64.zip');
        });

        it('throws for unsupported architecture', () => {
            expect(() => manager.getAssetName('linux', 'ia32'))
                .toThrow('Unsupported platform/architecture: linux/ia32');
        });

        it('throws for unsupported platform', () => {
            expect(() => manager.getAssetName('freebsd', 'x64'))
                .toThrow('Unsupported platform/architecture: freebsd/x64');
        });
    });

    // findAsset
    
    describe('findAsset', () => {

        let expectedAssetName

        beforeEach(() => {
            expectedAssetName = manager.getAssetName(os.platform(), os.arch());
        });

        function makeRelease(assets) {
            return { tag_name: '0.7.1', assets };
        }

        function makeAsset(name, digest = 'sha256:abc123') {
            return { name, browser_download_url: `https://example.com/${name}`, digest };
        }

        it('returns the matching asset when it exists and has a digest', () => {
            const asset = makeAsset(expectedAssetName);
            expect(manager.findAsset(makeRelease([asset]))).toBe(asset);
        });

        it('throws when no asset matches the expected name', () => {
            expect(() => manager.findAsset(makeRelease([makeAsset('other-binary.tar.gz')])))
                .toThrow(`Asset ${expectedAssetName} not found in release.`);
        });

        it('throws when the assets array is empty', () => {
            expect(() => manager.findAsset(makeRelease([])))
                .toThrow(`Asset ${expectedAssetName} not found in release.`);
        });

        it('throws when the matching asset has a null digest', () => {
            expect(() => manager.findAsset(makeRelease([makeAsset(expectedAssetName, null)])))
                .toThrow(`No digest for asset ${expectedAssetName}`);
        });

        it('throws when the matching asset has an empty string digest', () => {
            // empty string is falsy - same code branch as null
            expect(() => manager.findAsset(makeRelease([makeAsset(expectedAssetName, '')])))
                .toThrow(`No digest for asset ${expectedAssetName}`);
        });

        it('picks the correct asset when multiple assets are present', () => {
            const target = makeAsset(expectedAssetName);
            const release = makeRelease([
                makeAsset('opencl-language-server-linux-arm64.tar.gz'),
                target,
                makeAsset('opencl-language-server-win32-x86_64.zip'),
            ]);
            expect(manager.findAsset(release)).toBe(target);
        });
    });
});