const vscode = require('vscode')

const { spawn } = require('promisify-child-process')

import { exists, killTree } from '../../modules/utils'
import { isCppExtensionInstalled } from '../../modules/dependencies'
import { getClangBinaryPath, getClangArgumentList } from './clang/formatter'

const STR_CPP_EXTENSION_NOT_INSTALLED_ERROR = "Extension 'ms-vscode.cpptools' is required to run default formatter. Edit 'opencl.formatting.name' in Preferences to use custom formatter."
const STR_FAILED_TO_FIND_FORMATTER = "Failed to find default 'clang-format' binary in 'ms-vscode.cpptools' extension."


class OpenCLDocumentFormattingEditProvider {

    constructor() {
        this.channel = vscode.window.createOutputChannel('OpenCL Formatting')
    }

    async provideDocumentFormattingEdits(document, options, token) {

        // opencl settings
        const app  = vscode.workspace.getConfiguration().get('opencl.formatting.name', '')
        let args = vscode.workspace.getConfiguration().get('opencl.formatting.options', [])

        if(app)
            return this.runFormatter(app, args, document, token)

        // Default 'clang-format' (shipped with ms-vscode.cpptools)
        if(!isCppExtensionInstalled()) {
            vscode.window.showErrorMessage(STR_CPP_EXTENSION_NOT_INSTALLED_ERROR)
            return []
        }

        const clangFormat = getClangBinaryPath()
        const binExists = await exists(clangFormat)

        if(!binExists) {
            vscode.window.showErrorMessage(STR_FAILED_TO_FIND_FORMATTER)
            return []
        }
            
        args = getClangArgumentList()
        return this.runFormatter(clangFormat, args, document, token)
    }

    getOutputChannel() {
        return this.channel
    }

    async runFormatter(app, args, document, token) {
        const p = spawn(app, args, {encoding: 'utf8'})
        token.onCancellationRequested(() => !p.killed && killTree(p.pid))
        if (p.pid)
            p.stdin.end(document.getText())
        const { stdout, stderr } = await p
        
        console.log(`Spawn process stderr: ${stderr}`)

        const fileStart = new vscode.Position(0, 0)
        const fileEnd = document.lineAt(document.lineCount - 1).range.end
        const textEdits = [
            new vscode.TextEdit(new vscode.Range(fileStart, fileEnd), stdout.toString())
        ]

        return textEdits
    }
}		

export { OpenCLDocumentFormattingEditProvider }