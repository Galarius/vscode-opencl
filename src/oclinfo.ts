'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as os from "os";
import * as fs from 'fs';
var exec = require('child-process-promise').exec;

function findOclInfoPath(): string {
    let extPath = vscode.extensions.getExtension("galarius.vscode-opencl").extensionPath
    switch (os.platform()) {
        case "win32":
            return path.join(extPath, "bin", "win32", "oclinfo.exe");
        case "darwin":
            return path.join(extPath, "bin", "darwin", "oclinfo");
        default:
            return "";
    }
}

function execute(command: string): Promise<Buffer> {
    return exec(command, {
        cwd: vscode.workspace.rootPath
    }).then(function(result): Buffer {
        return result.stdout;
    }).fail(function(error) {
        console.error("Error: " + error);
        vscode.window.showErrorMessage(error);
    }).progress(function(childProcess) {
        console.log("Command: " + command + " running...");
    });
}

function buildCommand(args: Array<string>): string {
    let command = "";
    for (let arg of args) {
        command += arg + " ";
    }
    command = command.slice(0, -1)
    return command;
}

export function oclinfoDumpAll() {
    let oclinfoPath = findOclInfoPath();
    if(oclinfoPath) {
        let command = buildCommand([oclinfoPath, "-pds"])
        execute(command).then(function(output){
            let filePath = path.join(vscode.workspace.rootPath, "oclinfo.txt");
            fs.writeFileSync(filePath, output);
            var openPath = vscode.Uri.file(filePath);
            vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc);
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