const vscode = require('vscode')
const cp = require('child_process')
const path = require('path')

import { exists, killTree } from '../../modules/utils'
import { isCppExtensionInstalled } from '../../modules/dependencies'
import { getClangBinaryPath, getClangArgumentList } from './clang/formatter'

const STR_CPP_EXTENSION_NOT_INSTALLED_ERROR = "[OpenCL Formatter] Extension 'ms-vscode.cpptools' is required to run 'clang-format' utility. Edit 'opencl.formatting.name' in Preferences to use custom formatter or specify an absolute path to 'clang-format'."
const STR_FAILED_TO_FIND_FORMATTER = "[OpenCL Formatter] Failed to find default 'clang-format' binary in 'ms-vscode.cpptools' extension."
const STR_FORMATTER_PROCESS_FAILED = '[OpenCL Formatter] Failed to format document. Check the console in dev tools to find errors when formatting.'

class OpenCLDocumentFormattingEditProvider {

    async provideDocumentFormattingEdits(document, options, token) {
        // opencl settings
        const app = vscode.workspace.getConfiguration().get('opencl.formatting.name', '')
        const clangFormatConfigDir = path.dirname(document.fileName)
        const clangFormatConfig = path.join(clangFormatConfigDir, '.clang-format')
        const clangFormatConfigExists = await exists(clangFormatConfig)
        console.info(`[OpenCL Formatter] Configuration file '.clang-format' is ${ clangFormatConfigExists ? 'found' : 'not found' } at ${clangFormatConfigDir}.`)
        const args = await getClangArgumentList(clangFormatConfigExists)

        if (app && app !== 'clang-format') {
            // Try to run non-default 'clang-format' formatter
            return this.format(app, args, document, token)
        }

        // Default 'clang-format' (shipped with ms-vscode.cpptools)
        if (!isCppExtensionInstalled()) {
            console.error(`[OpenCL Formatter] Failed to detect C++ extension`)
            vscode.window.showErrorMessage(STR_CPP_EXTENSION_NOT_INSTALLED_ERROR)
            return Promise.reject(STR_CPP_EXTENSION_NOT_INSTALLED_ERROR)
        }

        const clangFormat = getClangBinaryPath()
        const binExists = await exists(clangFormat)

        if (!binExists) {
            console.error(`[OpenCL Formatter] Failed to detect 'clang-format' binary`)
            vscode.window.showErrorMessage(STR_FAILED_TO_FIND_FORMATTER)
            return Promise.reject(STR_FAILED_TO_FIND_FORMATTER)
        }

        return this.format(clangFormat, args, document, token)
    }

    format(app, args, document, token) {
        return runner(app, args, document, token).then(
            (edits) => edits,
            (err) => {
                if (err) {
                    console.log(err)
                    vscode.window.showErrorMessage(STR_FORMATTER_PROCESS_FAILED)
                    return Promise.reject(STR_FORMATTER_PROCESS_FAILED)
                }
            }
        )
    }
}

const runner = (app, args, document, token) => {
    console.log(`[OpenCL Formatter] Running ${app} with arguments: ${args}...`)
    return new Promise((resolve, reject) => {
        let stdout = ''
        let stderr = ''

        const cwd = path.dirname(document.fileName)
        const p = cp.spawn(app, args,  { cwd })

        token.onCancellationRequested(() => !p.killed && killTree(p.pid))

        p.stdout.setEncoding('utf8')
        p.stdout.on('data', (data) => (stdout += data))
        p.stderr.on('data', (data) => (stderr += data))

        p.on('error', err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
        })

        p.on('close', code => {

            if (code !== 0) {
                console.log(`[OpenCL Formatter] Process closed with code ${code}`)
                return reject(stderr)
            }

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

export { OpenCLDocumentFormattingEditProvider }