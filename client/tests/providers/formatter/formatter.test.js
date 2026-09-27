const cp = require('child_process')
const path = require('path')
const { EventEmitter } = require('events')
const { PassThrough } = require('stream')
const vscode = require('vscode')

import { OpenCLDocumentFormattingEditProvider } from '../../../src/providers/formatter/formatter'
import { exists, scanParentFolders } from '../../../src/modules/utils'
import { isCppExtensionInstalled } from '../../../src/modules/dependencies'
import { getClangBinaryPath } from '../../../src/providers/formatter/clang/formatter'

jest.mock('../../../src/modules/utils')
jest.mock('../../../src/modules/dependencies')
jest.mock('../../../src/providers/formatter/clang/formatter', () => ({
    ...jest.requireActual('../../../src/providers/formatter/clang/formatter'),
    getClangBinaryPath: jest.fn()
}))

describe('OpenCL formatter executable', () => {
    const source = '__kernel void test(){}'
    const formatted = '__kernel void test() {}\n'
    const directory = path.join(process.cwd(), 'fixtures')
    const bundled = path.join(directory, 'cpptools', 'LLVM', 'bin', 'clang-format')

    beforeEach(() => {
        exists.mockResolvedValue(true)
        scanParentFolders.mockResolvedValue(path.join(directory, '.clang-format'))
        isCppExtensionInstalled.mockReturnValue(true)
        getClangBinaryPath.mockReturnValue(bundled)
        vscode.Position = jest.fn(function (line, character) {
            this.line = line
            this.character = character
        })
        vscode.Range = jest.fn(function (start, end) {
            this.start = start
            this.end = end
        })
        vscode.TextEdit = jest.fn(function (range, newText) {
            this.range = range
            this.newText = newText
        })
    })

    afterEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
        delete vscode.Position
        delete vscode.Range
        delete vscode.TextEdit
    })

    test.each([
        ['custom executable', '/usr/bin/clang-format', '/usr/bin/clang-format'],
        ['bundled executable', 'clang-format', bundled]
    ])('runs the %s and returns formatted text', async (_name, setting, executable) => {
        vscode.workspace.getConfiguration.mockReturnValue({
            get: (key, fallback) => key === 'OpenCL.formatting.name' ? setting : fallback
        })
        const child = new EventEmitter()
        child.pid = 123
        child.stdout = new PassThrough()
        child.stderr = new PassThrough()
        child.stdin = {
            end: jest.fn(() => {
                child.stdout.emit('data', formatted)
                child.emit('close', 0)
            })
        }
        const spawn = jest.spyOn(cp, 'spawn').mockImplementation((app) => {
            // Preserve the real spawn API's rejection of an undefined executable.
            if (typeof app !== 'string') {
                throw new TypeError('The "file" argument must be of type string. Received undefined')
            }
            return child
        })
        const end = { line: 0, character: source.length }
        const document = {
            fileName: path.join(directory, 'test.cl'),
            lineCount: 1,
            getText: () => source,
            lineAt: () => ({ range: { end } })
        }
        const token = { onCancellationRequested: jest.fn() }

        const edits = await new OpenCLDocumentFormattingEditProvider()
            .provideDocumentFormattingEdits(document, {}, token)

        expect(spawn).toHaveBeenCalledWith(executable,
            ['-verbose', '-style=file', '-fallback-style=LLVM'], { cwd: directory })
        expect(child.stdin.end).toHaveBeenCalledWith(source, 'utf-8')
        expect(edits).toHaveLength(1)
        expect(edits[0].newText).toBe(formatted)
        expect(edits[0].range.start).toEqual({ line: 0, character: 0 })
        expect(edits[0].range.end).toEqual(end)
        expect(vscode.window.showErrorMessage).not.toHaveBeenCalled()
    })
})
