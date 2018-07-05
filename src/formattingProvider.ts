'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 

export class OpenCLDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {
        let filename = document.fileName;
        let result: vscode.TextEdit[] = [];
        return result;
    }

}		
