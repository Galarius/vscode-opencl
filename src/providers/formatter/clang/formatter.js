const path = require('path')
const vscode = require('vscode')

import { cppExtension } from '../../../modules/dependencies'

const getClangFormatStyle = defaultValue => {
    const style = vscode.workspace.getConfiguration().get('C_Cpp.clang_format_style', defaultValue)
    if(style === 'Visual Studio') 
        return '{UseTab: Never, IndentWidth: 4, BreakBeforeBraces: Allman, AllowShortIfStatementsOnASingleLine: false, IndentCaseLabels: false, ColumnLimit: 0}'
    return style
}

const getClangFallbackStyle = defaultValue => {
    const style = vscode.workspace.getConfiguration().get('C_Cpp.clang_format_fallbackStyle', defaultValue)
    return ['LLVM', 'Google', 'Chromium', 'Mozilla', 'WebKit'].includes(style) ? style : defaultValue
}

const getClangBinaryPath = () => {
    const extension = cppExtension()
    
    if(typeof extension === 'undefined')
        return undefined

    const baseDir = path.join(extension.extensionPath, 'LLVM', 'bin')
    if(process.platform == 'darwin') {
        return path.join(baseDir, 'clang-format.darwin')
    } else if(process.platform == 'win32') {
        return path.join(baseDir, 'clang-format.exe')
    }
    return path.join(baseDir, 'clang-format')
}

const getClangArgumentList = () => {
    const style = getClangFormatStyle('file')
    const fallbackStyle = getClangFallbackStyle('LLVM')
    return [
        '-verbose', 
        `-style=${style}`, 
        `-fallback-style=${fallbackStyle}`,
        '--assume-filename=kernel.cl'
    ]
}

export {
    getClangBinaryPath,
    getClangArgumentList
}