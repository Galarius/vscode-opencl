'use strict';

import * as vscode from 'vscode'; 
import * as cmd from './cmd';

function isAvailable(): Promise<boolean> {
    let command = cmd.buildCommand(['astyler', '--version'])
    return cmd.execute(command).then(function(output) {
        let version = output.toString()
        return version.startsWith('Artistic Style Version')
    }, (error: any) => {
        console.error(error);
        vscode.window.showErrorMessage(error);
        return false
    });
}

export class OpenCLDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] {        
        
        isAvailable().then(function(output) {
            let filename = document.fileName
            let command = cmd.buildCommand(['astyle', '-n', filename])
            cmd.execute(command)
        }, (error: any) => {
            let err = "Artistic Style is not available at PATH!";
            console.error(err);
            vscode.window.showErrorMessage("Error: " + err);
        });

        let result: vscode.TextEdit[] = []
        return result
    }
}		
