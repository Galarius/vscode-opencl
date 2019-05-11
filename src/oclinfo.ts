'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as os from "os";
var exec = require('child-process-promise').exec;

import * as cmd from './cmd';

function findOclInfoPath(): string {
    let extPath = vscode.extensions.getExtension("galarius.vscode-opencl").extensionPath
    switch (os.platform()) {
        case "win32":
            return path.join(extPath, "bin", "win32", "oclinfo.exe");
        case "darwin":
            return path.join(extPath, "bin", "darwin", "oclinfo");
        case "linux":
            return path.join(extPath, "bin", "linux", "clinfo");
        default:
            return "";
    }
}

export function oclinfoDumpAll() {
    let oclinfoPath = findOclInfoPath();
    if(oclinfoPath) {
        let command = cmd.buildCommand([oclinfoPath, "-pds"])
        cmd.execute(command).then(function(output){
            vscode.workspace.openTextDocument({language: 'text'}).then((doc: vscode.TextDocument) => {
                vscode.window.showTextDocument(doc, 1, false).then(e => {
                    e.edit(edit => {
                        edit.insert(new vscode.Position(0, 0), output.toString("utf-8"));
                    });
                });
            }, (error: any) => {
                console.error(error);
                vscode.window.showErrorMessage(error);
            });
        });
    } else {
        let error = "Not available for your OS!";
        console.error(error);
        vscode.window.showErrorMessage("Error: " + error);
    }
}
