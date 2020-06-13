'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import * as opencl from "./opencl";
import * as oclinfo from "./oclinfo";
import * as formatter from "./providers/formatter";

import { OpenCLCompletionItemProvider } from './completionProvider';
import { OpenCLHoverProvider } from './hoverProvider';
import { getOpenCLTasks, buildTask, OpenCLDeviceDetector } from './providers/task';

export async function activate(context: vscode.ExtensionContext) {

    // Commands
    let openclInfo = vscode.commands.registerCommand('opencl.info', () => {
        oclinfo.oclinfoDumpAll();
    });
    context.subscriptions.push(openclInfo);
    
    // Completion
    let completionProvider = new OpenCLCompletionItemProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(opencl.OPECL_LANGUAGE_ID, completionProvider));

    // Signature Helper
    let signatureHelpProvider = new OpenCLHoverProvider();
    context.subscriptions.push(vscode.languages.registerHoverProvider(opencl.OPECL_LANGUAGE_ID, signatureHelpProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "c", scheme: "file" }, signatureHelpProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "cpp", scheme: "file" }, signatureHelpProvider));

    // Formating
    let formattingProvider = new formatter.OpenCLDocumentFormattingEditProvider();
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(opencl.OPECL_LANGUAGE_ID, formattingProvider));

    // Tasks
    let workspaces = vscode.workspace.workspaceFolders;
    if(!workspaces) {
        return
    }
    let openclPromise: Thenable<vscode.Task[]> | undefined = undefined;
    const deviceDetector = new OpenCLDeviceDetector()
    for(const workspace of workspaces) {
        let clPattern = path.join(workspace.uri.fsPath, '**/*.cl');
        let oclPattern = path.join(workspace.uri.fsPath, '**/*.ocl');
        let clFileWatcher = vscode.workspace.createFileSystemWatcher(clPattern);
        let oclFileWatcher = vscode.workspace.createFileSystemWatcher(oclPattern);
        clFileWatcher.onDidCreate(() => openclPromise = undefined);
        clFileWatcher.onDidDelete(() => openclPromise = undefined);
        oclFileWatcher.onDidCreate(() => openclPromise = undefined);
        oclFileWatcher.onDidDelete(() => openclPromise = undefined);
    }
    context.subscriptions.push(vscode.tasks.registerTaskProvider(opencl.OPECL_LANGUAGE_ID.language, { 
        provideTasks: async () => {
            if (!openclPromise) {
                await deviceDetector.detect()
                if(deviceDetector.isAnyDeviceSupported()) {
                    openclPromise = getOpenCLTasks(deviceDetector);
                } else {
                    vscode.window.showErrorMessage('There are no supported opencl devices')
                }
            }
            return openclPromise;
        },
        resolveTask: async (_task: vscode.Task) => {
            const definition = _task.definition;
            if (definition) {
                const prefix = 'opencl: '
                if(_task.name.indexOf(prefix) != -1) {
                    const taskName = _task.name.substr(prefix.length);
                    return buildTask({taskName, definition})
                }
            }
            return undefined;
        }
    }));

   
}
