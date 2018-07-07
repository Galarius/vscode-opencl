'use strict'

import * as vscode from 'vscode'
import * as cmd from './cmd'

export class OpenCLDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    
    public provideDocumentFormattingEdits(document: vscode.TextDocument, 
        options: vscode.FormattingOptions, 
        token: vscode.CancellationToken): vscode.TextEdit[] {        
        
        let filename = document.fileName
        let app  : string = vscode.workspace.getConfiguration().get('opencl.formatting.name')
        let args : Array<string> = vscode.workspace.getConfiguration().get('opencl.formatting.args')

        args.forEach((item, index) => {
            args[index] = item.replace("${workspaceRoot}", vscode.workspace.rootPath);
        });

        args.push(filename)
        args = [app].concat(args)
        let command = cmd.buildCommand(args)

        cmd.execute(command).then(function(output) {
            console.info(output.toString())
        });

        let result: vscode.TextEdit[] = []
        return result
    }
}		
