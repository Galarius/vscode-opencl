'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as os from "os";
var exec = require('child-process-promise').exec;

export function execute(command: string): Promise<Buffer> {
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

export function buildCommand(args: Array<string>): string {
    let command = "";
    for (let arg of args) {
        command += arg + " ";
    }
    command = command.slice(0, -1)
    return command;
}