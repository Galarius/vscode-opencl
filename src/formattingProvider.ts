'use strict';

import * as vscode from 'vscode'; 
import * as cmd from './cmd';
import * as os from "os";

function formattingAppName(): string {
    return vscode.workspace.getConfiguration().get('opencl.formatting.name');
}

export class OpenCLDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {        
        

        let filename = document.fileName
        let command = cmd.buildCommand([formattingAppName(), filename])

        cmd.execute(command).then(function(output) {
            
        }, (error: any) => {
            console.error(error);
            vscode.window.showErrorMessage(error);
        });

        let result: vscode.TextEdit[] = []
        return result
    }
}		
