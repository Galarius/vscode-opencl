'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import {
    LanguageClient,
    LanguageClientOptions,
    RevealOutputChannelOn,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

function GetLanguageServerPath(extensionUri: vscode.Uri): string | undefined {
    let platform = os.platform()
    if(platform == "darwin") { 
        return vscode.Uri.joinPath(extensionUri, path.join('bin', 'darwin', 'opencl-language-server')).fsPath;
    } else if(platform == "linux") {
        return vscode.Uri.joinPath(extensionUri, path.join('bin', 'linux', 'opencl-language-server')).fsPath;
    } else if(platform == "win32") {
        return vscode.Uri.joinPath(extensionUri, path.join('bin', 'win32', 'opencl-language-server.exe')).fsPath;
    }
    return undefined
}

function GetLanguageServerDebugPath(extensionUri: vscode.Uri): string | undefined {
    let platform = os.platform()
    if(platform == "darwin") { 
        return vscode.Uri.joinPath(extensionUri, path.join('server', 'build', 'bin', 'Debug', 'opencl-language-server')).fsPath;
    } else if(platform == "linux") {
        return vscode.Uri.joinPath(extensionUri, path.join('server', 'build', 'bin', 'opencl-language-server')).fsPath;
    } else if(platform == "win32") {
        return vscode.Uri.joinPath(extensionUri, path.join('server', 'build', 'bin', 'Debug', 'opencl-language-server.exe')).fsPath;
    }
    return undefined
}

function CreateLanguageServer(selector: vscode.DocumentFilter, output: vscode.OutputChannel, extensionUri: vscode.Uri): LanguageClient {    
    var serverPath = GetLanguageServerPath(extensionUri)
    if(!serverPath ) { 
        output.appendLine("OpenCL Language Server is not available for platform: " + os.platform())
        return
    }
    var debugServerPath = GetLanguageServerDebugPath(extensionUri)
    let enableFileLogging = vscode.workspace.getConfiguration().get('OpenCL.server.debug.enableFileLogging', false)
    let logFileName = vscode.workspace.getConfiguration().get('OpenCL.server.debug.logFileName', 'opencl-language-server.log')
    let logLevel = vscode.workspace.getConfiguration().get('OpenCL.server.debug.logLevel', 0)
    let args: Array<any> = []
    if(enableFileLogging)
    {
        args.push('--enable-file-tracing')
        args.push('--filename')
        args.push(logFileName)
        args.push('--level')
        args.push(logLevel)
    }

    const serverOptions: ServerOptions = {
        run:{command:serverPath,args:args,transport:TransportKind.stdio},
        debug:{command:debugServerPath,args:args,transport:TransportKind.stdio}
    }

    let clientOptions: LanguageClientOptions = {
        documentSelector: [{scheme: selector.scheme, language: selector.language}],
        outputChannel: output,
        outputChannelName: 'OpenCL Language Server',
        traceOutputChannel: output,
        revealOutputChannelOn: RevealOutputChannelOn.Never,
        initializationOptions: {
            configuration: {
                buildOptions: vscode.workspace.getConfiguration().get('OpenCL.server.buildOptions', []),
                deviceID: vscode.workspace.getConfiguration().get('OpenCL.server.deviceID', 0),
                maxNumberOfProblems: vscode.workspace.getConfiguration().get('OpenCL.server.maxNumberOfProblems', 100)
            }
        },
        initializationFailedHandler: error => {
            output.appendLine(`Failed to initialize language server due to ${error && error.path}`);
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

export { CreateLanguageServer, GetLanguageServerPath, GetLanguageServerDebugPath}