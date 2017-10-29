'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from "os";

var exec = require('child-process-promise').exec;

import * as opencl from "./opencl";

import { OpenCLCompletionItemProvider } from './completionProvider';

function execute(command: string): Promise<Buffer> {
    return exec(command, {
        cwd: vscode.workspace.rootPath
    }).then(function(result): Buffer {
        return result.stdout;
    }).fail(function(error) {
        console.error("Error: " + error);
        vscode.window.showErrorMessage("Error: " + error);
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

export async function activate(context: vscode.ExtensionContext) {

    let openclInfo = vscode.commands.registerCommand('opencl.info', () => {
        let oclinfoPath = findOclInfoPath();
        let command = buildCommand([oclinfoPath, "-pds"])
        execute(command).then(function(output){
            console.log(output);
            let filePath = path.join(vscode.workspace.rootPath, "oclinfo.txt");
            fs.writeFileSync(filePath, output);
            var openPath = vscode.Uri.file(filePath);
            vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc);
            }, (error: any) => {
                console.error(error);
            });
        });
    });
    context.subscriptions.push(openclInfo);

    let completionProvider = new OpenCLCompletionItemProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(opencl.OPECL_LANGUAGE_ID, completionProvider));
}