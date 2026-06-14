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


    // Versioning Helpers

    describe('LanguageServerManager Versioning', () => {

        // parseVersion

        it('parses a standard semver string', () => {
            expect(manager.parseVersion('1.2.3')).toEqual([1, 2, 3]);
        });

        it('strips a leading v prefix', () => {
            expect(manager.parseVersion('v0.7.1')).toEqual([0, 7, 1]);
        });

        it('defaults missing patch to 0', () => {
            expect(manager.parseVersion('1.2')).toEqual([1, 2, 0]);
        });

        it('handles 0.0.0', () => {
            expect(manager.parseVersion('0.0.0')).toEqual([0, 0, 0]);
        });

        it('handles empty', () => {
            expect(manager.parseVersion('')).toEqual([0, 0, 0]);
        });

        it('handles invalid 1', () => {
            expect(manager.parseVersion('a.b.c')).toEqual([0, 0, 0]);
        });

        it('handles invalid 2', () => {
            expect(manager.parseVersion('1.2.c')).toEqual([1, 2, 0]);
        });

        it('handles invalid 3', () => {
            expect(manager.parseVersion('version')).toEqual([0, 0, 0]);
        });

        // versionLt

        it('returns true when major is less', () => {
            expect(manager.versionLt('0.9.9', '1.0.0')).toBe(true);
        });

        it('returns true when minor is less', () => {
            expect(manager.versionLt('0.7.9', '0.8.0')).toBe(true);
        });

        it('returns true when patch is less', () => {
            expect(manager.versionLt('0.7.1', '0.7.2')).toBe(true);
        });

        it('returns false for equal versions', () => {
            expect(manager.versionLt('0.7.1', '0.7.1')).toBe(false);
        });

        it('returns false when version is greater', () => {
            expect(manager.versionLt('1.0.0', '0.9.9')).toBe(false);
        });

        it('handles v-prefixed strings', () => {
            expect(manager.versionLt('v0.7.0', 'v0.7.1')).toBe(true);
        });

        // upperBound

        it('increments minor and resets patch', () => {
            expect(manager.upperBound('0.7.1')).toBe('0.8.0');
        });

        it('works when minor is 0', () => {
            expect(manager.upperBound('1.0.5')).toBe('1.1.0');
        });

        it('works for 1.2.1', () => {
            expect(manager.upperBound('1.2.1')).toBe('1.3.0');
        });

        it('does not increment major', () => {
            expect(manager.upperBound('2.9.3')).toBe('2.10.0');
        });

        // isCompatible

        it('accepts the pinned version itself', () => {
            expect(manager.isCompatible('0.7.1', '0.7.1')).toBe(true);
        });

        it('rejects a version above the ceiling', () => {
            expect(manager.isCompatible('0.9.0', '0.7.1')).toBe(false);
        });
    });
});