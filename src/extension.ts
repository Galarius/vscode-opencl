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
import { OpenCLTaskProvider } from './taskProvider';

export async function activate(context: vscode.ExtensionContext) {

    let openclInfo = vscode.commands.registerCommand('opencl.info', () => {
        oclinfo.oclinfoDumpAll();
    });
    context.subscriptions.push(openclInfo);
    
    let completionProvider = new OpenCLCompletionItemProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(opencl.OPECL_LANGUAGE_ID, completionProvider));

    let signatureHelpProvider = new OpenCLHoverProvider();
    context.subscriptions.push(vscode.languages.registerHoverProvider(opencl.OPECL_LANGUAGE_ID, signatureHelpProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "c", scheme: "file" }, signatureHelpProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "cpp", scheme: "file" }, signatureHelpProvider));

    let formattingEnabled = vscode.workspace.getConfiguration().get('opencl.formatting.enabled');
    if(formattingEnabled) {
        let formattingProvider = new OpenCLDocumentFormattingEditProvider();
        context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(opencl.OPECL_LANGUAGE_ID, formattingProvider));
    }

    let taskProvider = new OpenCLTaskProvider();
    context.subscriptions.push(vscode.tasks.registerTaskProvider(opencl.OPECL_LANGUAGE_ID.language, taskProvider));    
    
}