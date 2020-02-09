const vscode = require('vscode')
const cp = require('child_process')

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
        const app = vscode.workspace.getConfiguration().get('opencl.formatting.name', '')
        let args = vscode.workspace.getConfiguration().get('opencl.formatting.options', [])

        if (app && app != 'clang-format')
            return this.runFormatter(app, args, document, token)

        // Default 'clang-format' (shipped with ms-vscode.cpptools)
        if (!isCppExtensionInstalled()) {
            vscode.window.showErrorMessage(STR_CPP_EXTENSION_NOT_INSTALLED_ERROR)
            return []
        }

        const clangFormat = getClangBinaryPath()
        const binExists = await exists(clangFormat)

        if (!binExists) {
            vscode.window.showErrorMessage(STR_FAILED_TO_FIND_FORMATTER)
            return []
        }

        args = await getClangArgumentList()

        return this.runFormatter(clangFormat, args, document, token).then(
            (edits) => edits,
            (err) => {
                if (err) {
                    console.log(err)
                    return Promise.reject('Check the console in dev tools to find errors when formatting.');
                }
            }
        )
    }

    getOutputChannel() {
        return this.channel
    }

    runFormatter(app, args, document, token) {
        console.log(`[Formatter] Running ${app} with arguments: ${args}...`)
        return new Promise((resolve, reject) => {
            let stdout = ''
            let stderr = ''
            const p = cp.spawn(app, args)
            token.onCancellationRequested(() => !p.killed && killTree(p.pid))
            p.stdout.setEncoding('utf8')
            p.stdout.on('data', (data) => (stdout += data))
            p.stderr.on('data', (data) => (stderr += data))

            p.on('error', err => {
                if (err)
                    return reject(err)
            })

            p.on('close', code => {

                if (code !== 0)
                    return reject(stderr)

                const fileStart = new vscode.Position(0, 0)
                const fileEnd = document.lineAt(document.lineCount - 1).range.end
                const textEdits = [
                    new vscode.TextEdit(new vscode.Range(fileStart, fileEnd), stdout)
                ]
                return resolve(textEdits)
            })

            if (p.pid)
                p.stdin.end(document.getText())
        })
    }
}

export { OpenCLDocumentFormattingEditProvider }