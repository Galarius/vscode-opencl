const path = require('path')
const vscode = require('vscode')

import { cppExtension } from '../../../modules/dependencies'

const VS_STYLE = '{UseTab: Never, IndentWidth: 4, BreakBeforeBraces: Allman, AllowShortIfStatementsOnASingleLine: false, IndentCaseLabels: false, ColumnLimit: 0}'

const getClangFormatStyle = defaultValue => {
    const style = vscode.workspace.getConfiguration().get('C_Cpp.clang_format_style', defaultValue)
    if(style === 'Visual Studio') 
        return VS_STYLE
    return style
}

const getClangFallbackStyle = defaultValue => {
    const style = vscode.workspace.getConfiguration().get('C_Cpp.clang_format_fallbackStyle', defaultValue)
    return ['Visual Studio', 'LLVM', 'Google', 'Chromium', 'Mozilla', 'WebKit'].includes(style) ? style : defaultValue
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

const getClangArgumentList = configExists => {
    const defaultStyle = configExists ? 'file' : 'Visual Studio'
    let style = getClangFormatStyle(defaultStyle)
    const fallbackStyle = getClangFallbackStyle('Visual Studio')
    
    if(style === 'file' && fallbackStyle === 'Visual Studio' && !configExists) {
        console.warn(`[OpenCL Formatter] Configuration 'C_Cpp.clang_format_style' is set to 'file', 'C_Cpp.clang_format_fallbackStyle' - to 'Visual Studio'. Configuration file '.clang-format' was not found in the file's directory or any of it's parent directories. Style 'Visual Studio' is not a built-in 'clang-format' style. Argument 'style' will be patched.`)
        return [
            '-verbose', 
            `-style=${VS_STYLE}`
        ]
    }

    return [
        '-verbose', 
        `-style=${style}`, 
        `-fallback-style=${fallbackStyle}`
    ]
}

export {
    getClangBinaryPath,
    getClangArgumentList
}