'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import * as oclinfo from "./commands/oclinfo";
import * as formatter from "./providers/formatter";
import { LanguageClient } from 'vscode-languageclient/node';

import { OPECL_LANGUAGE_ID } from './modules/common'
import { OpenCLCompletionItemProvider } from './providers/completion/completion';
import { OpenCLHoverProvider } from './providers/hover/hover';
import { getOpenCLTasks, buildTask, OpenCLDeviceDetector } from './providers/task';
import { createLanguageServer } from "./providers/server/server";
import { Trace } from 'vscode-languageclient';

export function activate(context: vscode.ExtensionContext) {

    // Commands
    let openclInfo = vscode.commands.registerCommand('opencl.info', () => {
        oclinfo.oclinfoDumpAll();
    });
    context.subscriptions.push(openclInfo);

    // Completion
    let completionProvider = new OpenCLCompletionItemProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(OPECL_LANGUAGE_ID, completionProvider));

    // Signature Helper
    let signatureHelpProvider = new OpenCLHoverProvider();
    context.subscriptions.push(vscode.languages.registerHoverProvider(OPECL_LANGUAGE_ID, signatureHelpProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "c", scheme: "file" }, signatureHelpProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "cpp", scheme: "file" }, signatureHelpProvider));

    // Formating
    let formattingProvider = new formatter.OpenCLDocumentFormattingEditProvider();
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(OPECL_LANGUAGE_ID, formattingProvider));

    // Tasks
    let workspaces = vscode.workspace.workspaceFolders;
    if (!workspaces) {
        return
    }
    let openclPromise: Thenable<vscode.Task[]> | undefined = undefined;
    const deviceDetector = new OpenCLDeviceDetector()
    deviceDetector.detect().then(function () {
        let devSupported = deviceDetector.isAnyDeviceSupported()
        console.log(`[OpenCL] Device detector finished. Is supported: ${devSupported}`);
    });
    for (const workspace of workspaces) {
        let clPattern = path.join(workspace.uri.fsPath, '**/*.cl');
        let oclPattern = path.join(workspace.uri.fsPath, '**/*.ocl');
        let clFileWatcher = vscode.workspace.createFileSystemWatcher(clPattern);
        let oclFileWatcher = vscode.workspace.createFileSystemWatcher(oclPattern);
        clFileWatcher.onDidCreate(() => openclPromise = undefined);
        clFileWatcher.onDidDelete(() => openclPromise = undefined);
        oclFileWatcher.onDidCreate(() => openclPromise = undefined);
        oclFileWatcher.onDidDelete(() => openclPromise = undefined);
    }
    context.subscriptions.push(vscode.tasks.registerTaskProvider(OPECL_LANGUAGE_ID.language, {
        provideTasks: async () => {
            if (!openclPromise) {
                console.log('[OpenCL] Building opencl tasks...')
                if (deviceDetector.isAnyDeviceSupported()) {
                    openclPromise = getOpenCLTasks(deviceDetector);
                } else {
                    console.warn('[OpenCL] No supported opencl devices')
                }
            }
            return openclPromise;
        },
        resolveTask: async (_task: vscode.Task) => {
            const definition = _task.definition;
            if (definition) {
                const prefix = 'opencl: '
                if (_task.name.indexOf(prefix) != -1) {
                    const taskName = _task.name.substr(prefix.length);
                    console.log(`[OpenCL] Resolving task ${taskName}...`)
                    return buildTask({ taskName, definition })
                }
            }
            return undefined;
        }
    }));

    // Language Server
    if (vscode.workspace.getConfiguration().get('OpenCL.server.enable', true)) {
        let output: vscode.OutputChannel = vscode.window.createOutputChannel('OpenCL Language Server')
        let client = createLanguageServer(OPECL_LANGUAGE_ID, output, context.extensionUri)
        client.trace = Trace.Verbose;
        client.onDidChangeState((e) => {
            // Stopped = 1, Starting = 3, Running = 2
            output.appendLine(`State changed: ${e.oldState} -> ${e.newState}`)
        })
        client.start();
    }
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
