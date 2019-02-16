'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import * as opencl from "./opencl";
import * as oclinfo from "./oclinfo";

import { OpenCLCompletionItemProvider } from './completionProvider';
import { OpenCLHoverProvider } from './hoverProvider';
import { OpenCLDocumentFormattingEditProvider } from './formattingProvider';
import { getOpenCLTasks } from './taskProvider';

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
    let formattingProvider = new OpenCLDocumentFormattingEditProvider();
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(opencl.OPECL_LANGUAGE_ID, formattingProvider));

    // Tasks
    let workspaceRoot = vscode.workspace.rootPath;
    if (!workspaceRoot) {
        return;
    }
    let openclPromise: Thenable<vscode.Task[]> | undefined = undefined;
    let clPattern = path.join(workspaceRoot, '**/*.cl');
    let oclPattern = path.join(workspaceRoot, '**/*.ocl');
    let clFileWatcher = vscode.workspace.createFileSystemWatcher(clPattern);
    let oclFileWatcher = vscode.workspace.createFileSystemWatcher(oclPattern);
    clFileWatcher.onDidCreate(() => openclPromise = undefined);
    clFileWatcher.onDidDelete(() => openclPromise = undefined);
    oclFileWatcher.onDidCreate(() => openclPromise = undefined);
    oclFileWatcher.onDidDelete(() => openclPromise = undefined);
    context.subscriptions.push(vscode.tasks.registerTaskProvider(opencl.OPECL_LANGUAGE_ID.language, { 
        provideTasks: () => {
            if (!openclPromise) {
                openclPromise = getOpenCLTasks();
            }
            return openclPromise;
        },
        resolveTask(_task: vscode.Task): vscode.Task | undefined {
            return undefined;
        }
	}));    
    
}