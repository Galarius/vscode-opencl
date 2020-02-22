import { VS_STYLE, getClangFormatStyle, getClangFallbackStyle, getClangBinaryPath, getClangArgumentList } from './formatter'
const vscode = require("../../../../__mocks__/vscode")

describe('Clang Formatter Tests', () => {

    test('Should return Visual Studio style if specified in C_Cpp.clang_format_style', () => {
        const spyGet = jest.fn(() => 'Visual Studio')
        jest.spyOn(vscode.workspace, 'getConfiguration').mockReturnValue({ get: spyGet })

        const style = getClangFormatStyle('LLVM')

        expect(spyGet).toHaveBeenCalledWith('C_Cpp.clang_format_style', 'LLVM')
        expect(style).toBe(VS_STYLE)
    })
    test('Should return another style if config C_Cpp.clang_format_style returns it', () => {
        const spyGet = jest.fn(() => 'Google')
        jest.spyOn(vscode.workspace, 'getConfiguration').mockReturnValue({ get: spyGet })

        const style = getClangFormatStyle('Mozilla')

        expect(spyGet).toHaveBeenCalledWith('C_Cpp.clang_format_style', 'Mozilla')
        expect(style).toBe('Google')
    })

    test('Should return valid fallback style from config C_Cpp.clang_format_style', () => {
        const spyGet = jest.fn(() => 'WebKit')
        jest.spyOn(vscode.workspace, 'getConfiguration').mockReturnValue({ get: spyGet })

        const style = getClangFallbackStyle('LLVM')

        expect(spyGet).toHaveBeenCalledWith('C_Cpp.clang_format_fallbackStyle', 'LLVM')
        expect(style).toBe('WebKit')
    })

    test('Should return default fallback style if there is no config C_Cpp.clang_format_style', () => {
        const spyGet = jest.fn(() => 'LLVM')
        jest.spyOn(vscode.workspace, 'getConfiguration').mockReturnValue({ get: spyGet })

        const style = getClangFallbackStyle('LLVM')

        expect(spyGet).toHaveBeenCalledWith('C_Cpp.clang_format_fallbackStyle', 'LLVM')
        expect(style).toBe('LLVM')
    })

    test('Should return LLVM fallback style if there is no config C_Cpp.clang_format_style and default fallback style is invalid', () => {
        const spyGet = jest.fn(() => 'Visual Studio')
        jest.spyOn(vscode.workspace, 'getConfiguration').mockReturnValue({ get: spyGet })

        const style = getClangFallbackStyle('Visual Studio')

        expect(spyGet).toHaveBeenCalledWith('C_Cpp.clang_format_fallbackStyle', 'Visual Studio')
        expect(style).toBe('LLVM')
    })
})