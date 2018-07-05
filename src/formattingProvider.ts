'use strict';

import * as vscode from 'vscode'; 
import * as cmd from './cmd';

export class OpenCLDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {
        let filename = document.fileName;

        let command = cmd.buildCommand(['astyle', "-n", filename])
        cmd.execute(command).then(function(output){
        });

        let result: vscode.TextEdit[] = [];
        return result;
    }

}		
