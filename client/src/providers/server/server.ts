'use strict';

import * as vscode from 'vscode';
import {
    Executable,
    LanguageClient,
    LanguageClientOptions,
    RevealOutputChannelOn,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

import { LanguageServerManager } from './manager';

async function CreateLanguageClient(
    selector: vscode.DocumentFilter, 
    channel: vscode.OutputChannel, 
    manager: LanguageServerManager
): Promise<LanguageClient | undefined> {
    if (!manager.serverPath) {
        channel.appendLine("[Error] Failed to create OpenCL Language Server client");
        return undefined;
    }
    
    let args = manager.getLaunchArgs();
    let run: Executable = { command: manager.serverPath, args: args, transport: TransportKind.stdio }
    let debug: Executable = { command: manager.debugPath ? manager.debugPath : manager.serverPath, args: args, transport: TransportKind.stdio }
    let serverOptions: ServerOptions = { run: run, debug: debug }
    let scheme= selector.scheme ? selector.scheme : 'file';
    let language = selector.language ? selector.language : 'opencl';
    let configuration = vscode.workspace.getConfiguration('OpenCL.server', null)
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{scheme: scheme, language: language}],
        outputChannel: channel,
        outputChannelName: 'OpenCL Language Server',
        traceOutputChannel: channel,
        revealOutputChannelOn: RevealOutputChannelOn.Never,
        initializationOptions: {
            configuration: {
                buildOptions: configuration.get('buildOptions', []),
                deviceID: configuration.get('deviceID', 0),
                maxNumberOfProblems: configuration.get('maxNumberOfProblems', 127)
            }
        },
        initializationFailedHandler: error => {
            channel.appendLine(`Failed to initialize language server due to ${error && error.path}`);
            return true;
        }
    };

    return new LanguageClient(
        'opencl',
        'OpenCL Language Server',
        serverOptions,
        clientOptions
    );
}

export { CreateLanguageClient }