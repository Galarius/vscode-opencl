'use strict';

import * as vscode from 'vscode';
var exec = require('child-process-promise').exec;

export function execute(command: string): Promise<Buffer> {
    console.log(`[OpenCL] Executing command: {command}`);
    return exec(command, {}).then(function(result): Buffer {
        return result.stdout;
    }).fail(function(error) {
        console.error(error);
        let msg = "[Error: " + error.code + "] " + error.stderr;
        vscode.window.showErrorMessage(msg)
        return error
    }).progress(function(childProcess) {
        console.log("Command: " + command + " running...");
    });
}
