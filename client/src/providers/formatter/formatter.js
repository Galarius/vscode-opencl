const vscode = require('vscode')
const cp = require('child_process')
const path = require('path')
const kill = require('tree-kill')

import { exists, scanParentFolders } from '../../modules/utils'
import { isCppExtensionInstalled } from '../../modules/dependencies'
import { getClangBinaryPath, getClangArgumentList } from './clang/formatter'

const STR_CPP_EXTENSION_NOT_INSTALLED_ERROR = "[OpenCL Formatter] Extension 'ms-vscode.cpptools' is required to run 'clang-format' utility. Edit 'opencl.formatting.name' in Preferences to use custom formatter or specify an absolute path to 'clang-format'."
const STR_FAILED_TO_FIND_FORMATTER = "[OpenCL Formatter] Failed to find default 'clang-format' binary in 'ms-vscode.cpptools' extension."
const STR_FORMATTER_PROCESS_FAILED = '[OpenCL Formatter] Failed to format document. Check the console in dev tools to find errors when formatting.'
const STR_FORMATTER_NOT_FOUND = '[OpenCL Formatter] Failed to find formatter. Check the console in dev tools.'

class OpenCLDocumentFormattingEditProvider {

    async provideDocumentFormattingEdits(document, options, token) {
        // opencl settings
        let app = vscode.workspace.getConfiguration().get('opencl.formatting.name', 'clang-format')
        app = app.replace(/["]/g,"").trim()
        const config = await scanParentFolders(path.dirname(document.fileName), '.clang-format')
        const configExists = typeof config !== 'undefined'
        if (configExists)
            console.info(`[OpenCL Formatter] Configuration file '.clang-format' is found at ${config}.`)
        const args = await getClangArgumentList(configExists)

        if (app && app !== 'clang-format' && app !== 'clang-format.exe') {
            // Try to run non-default 'clang-format' formatter
            return this.format({app, args, config}, {document, token})
        }

        // Default 'clang-format' (shipped with ms-vscode.cpptools)
        if (!isCppExtensionInstalled()) {
            console.error(`[OpenCL Formatter] Failed to detect C++ extension`)
            vscode.window.showErrorMessage(STR_CPP_EXTENSION_NOT_INSTALLED_ERROR)
            return Promise.reject()
        }

        app = getClangBinaryPath()
        const binExists = await exists(app)

        if (!binExists) {
            console.error(`[OpenCL Formatter] Failed to detect 'clang-format' binary`)
            vscode.window.showErrorMessage(STR_FAILED_TO_FIND_FORMATTER)
            return Promise.reject()
        }

        return this.format({ app, args, config }, { document, token })
    }

    format(cmd, editor) {
        return runner(cmd, editor).then(
            (edits) => edits,
            (err) => {
                console.error(`${err}`)
                
                if(err.code === 'ENOENT')
                    vscode.window.showErrorMessage(STR_FORMATTER_NOT_FOUND)
                else     
                    vscode.window.showErrorMessage(STR_FORMATTER_PROCESS_FAILED)

                return Promise.reject()
            }
        )
    }
}

const runner = ({ app, args, config }, { document, token }) => {
    console.log(`[OpenCL Formatter] Running ${app} with arguments: ${args}...`)
    return new Promise((resolve, reject) => {
        let stdout = ''
        let stderr = ''

        const cwd = path.dirname(config ? config : document.fileName)
        const p = cp.spawn(app, args, { cwd })

        token.onCancellationRequested(() => !p.killed && killTree(p.pid))

        p.stdout.setEncoding('utf-8')
        p.stderr.setEncoding('utf-8')
        p.stdout.on('data', (data) => (stdout += data))
        p.stderr.on('data', (data) => (stderr += data))

        p.on('error', err => {
            if (err)
                return reject(err)
        })

        p.on('close', code => {

            if (code !== 0) {
                console.error(`[OpenCL Formatter] Process finished with code ${code}`)
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
            p.stdin.end(document.getText(), 'utf-8');
    })
}

const killTree = (processId) => {
    kill(processId, (err) => {
        if (err) {
            console.log('Failed to kill process tree: ' + err);
        }
    });
};

export { OpenCLDocumentFormattingEditProvider }