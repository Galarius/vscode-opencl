'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as opencl from "./opencl";
import * as oclinfo from "./oclinfo";

import { OpenCLCompletionItemProvider } from './completionProvider';

export async function activate(context: vscode.ExtensionContext) {

    let openclInfo = vscode.commands.registerCommand('opencl.info', () => {
        oclinfo.oclinfoDumpAll();
    });
    context.subscriptions.push(openclInfo);
    
    let completionProvider = new OpenCLCompletionItemProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(opencl.OPECL_LANGUAGE_ID, completionProvider));
}