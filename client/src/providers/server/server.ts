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
        let arch = os.arch()
        if(arch == "x64" || arch == "arm64") {
            return vscode.Uri.joinPath(extensionUri, path.join('bin', 'linux', arch, 'opencl-language-server')).fsPath;
        }
    } else if(platform == "win32") {
        return vscode.Uri.joinPath(extensionUri, path.join('bin', 'win32', 'opencl-language-server.exe')).fsPath;
    }
    return undefined
}

function GetLanguageServerDebugPath(extensionUri: vscode.Uri): string | undefined {
    return process.env.OPENCL_LANGUAGE_SERVER
}

function CreateLanguageServer(selector: vscode.DocumentFilter, output: vscode.OutputChannel, extensionUri: vscode.Uri): LanguageClient {    
    var serverPath = GetLanguageServerPath(extensionUri)
    if(!serverPath ) { 
        output.appendLine("OpenCL Language Server is not available for platform: " + os.platform() + ", arch: " + os.arch())
        return undefined
    }
    var debugServerPath = GetLanguageServerDebugPath(extensionUri)
    let debugConfiguration = vscode.workspace.getConfiguration('OpenCL.server.debug', null)
    let enableFileLogging = debugConfiguration.get('enableFileLogging', false)
    let logFileName = debugConfiguration.get('logFileName', 'opencl-language-server.log')
    let logLevel = debugConfiguration.get('logLevel', 0)
    let args: Array<any> = []
    if(enableFileLogging)
    {
        args.push('--enable-file-logging')
        args.push('--log-file')
        args.push(logFileName)
        args.push('--log-level')
        args.push(logLevel)
    }

    const serverOptions: ServerOptions = {
        run:{command:serverPath,args:args,transport:TransportKind.stdio},
        debug:{command:debugServerPath,args:args,transport:TransportKind.stdio}
    }

    let configuration = vscode.workspace.getConfiguration('OpenCL.server', null)
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{scheme: selector.scheme, language: selector.language}],
        outputChannel: output,
        outputChannelName: 'OpenCL Language Server',
        traceOutputChannel: output,
        revealOutputChannelOn: RevealOutputChannelOn.Never,
        initializationOptions: {
            configuration: {
                buildOptions: configuration.get('buildOptions', []),
                deviceID: configuration.get('deviceID', 0),
                maxNumberOfProblems: configuration.get('maxNumberOfProblems', 127)
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