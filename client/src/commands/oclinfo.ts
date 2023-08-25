'use strict';

import * as vscode from 'vscode';
import * as os from "os";

import { GetLanguageServerPath, GetLanguageServerDebugPath } from '../providers/server/server';
import { isDebugMode } from '../modules/debug';

import * as cmd from './cmd';

export function oclinfoDumpAll(extensionUri: vscode.Uri) {

    var serverPath = ''
		
    if(isDebugMode()) {
        serverPath = GetLanguageServerDebugPath(extensionUri)
    } else {
        serverPath = GetLanguageServerPath(extensionUri)
    }
    if(!serverPath) {  
        let error = "OpenCL Language Server is not available for platform: " + os.platform();
        console.error(error);
        vscode.window.showErrorMessage("Error: " + error);
    }
    let command = cmd.buildCommand([serverPath, "clinfo"])
    cmd.execute(command).then((output) => {
        let clinfoDict = JSON.parse(output.toString("utf-8"));
        vscode.workspace.openTextDocument({language: 'json'}).then((doc: vscode.TextDocument) => {
            vscode.window.showTextDocument(doc, 1, false).then(e => {
                e.edit(edit => {
                    edit.insert(new vscode.Position(0, 0), JSON.stringify(clinfoDict, null, 2));
                });
            });
        }, (error: any) => {
            console.error(error);
            vscode.window.showErrorMessage(error);
        });
    }).catch(function(error) {
        console.error(error);
        vscode.window.showErrorMessage(error);
    });
}
