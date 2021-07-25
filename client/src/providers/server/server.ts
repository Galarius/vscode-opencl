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

const createAndStartLanguageServer = (selector: vscode.DocumentFilter, context: vscode.ExtensionContext) => {
    
    var serverPath = ''
    var debugServerPath = ''
    let platform = os.platform()
    let output: vscode.OutputChannel = vscode.window.createOutputChannel('OpenCL Language Server')

    if(platform == "darwin") { 
        serverPath = context.asAbsolutePath(path.join('bin', 'darwin', 'opencl-language-server'));
        debugServerPath = context.asAbsolutePath(path.join('server', 'build', 'bin', 'Debug', 'opencl-language-server'));
    } else if(platform == "linux") {
        serverPath = context.asAbsolutePath(path.join('bin', 'linux', 'opencl-language-server'));
        debugServerPath = context.asAbsolutePath(path.join('server', 'build', 'bin', 'opencl-language-server'));
    } else if(platform == "win32") {
        serverPath = context.asAbsolutePath(path.join('bin', 'win32', 'opencl-language-server.exe'));
        debugServerPath = context.asAbsolutePath(path.join('server', 'build', 'bin', 'Debug', 'opencl-language-server'));
    } else {
        output.appendLine("OpenCL Language Server is not available for platform: " + platform)
        return
    }

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

    let serverOptions: ServerOptions = {
        command: process.env.VSCODE_DEBUG_MODE === 'true' ? debugServerPath : serverPath,
        args: args,
            transport: TransportKind.stdio,
    }; 

    let clientOptions: LanguageClientOptions = {
        documentSelector: [{scheme: selector.scheme, language: selector.language}],
        outputChannel: output,
        outputChannelName: 'OpenCL Language Server',
        traceOutputChannel: output,
        revealOutputChannelOn: RevealOutputChannelOn.Never,
        initializationOptions: {
        configuration: {
            buildOptions: vscode.workspace.getConfiguration().get('OpenCL.server.buildOptions', []),
            maxNumberOfProblems: vscode.workspace.getConfiguration().get('OpenCL.server.maxNumberOfProblems', 100)
        }
        },
        initializationFailedHandler: error => {
        output.appendLine(`Failed to initialize language server due to ${error && error.toString()}`);
        return true;
        },
    };

    // Create and start
    let client = new LanguageClient(
        'opencl',
        'OpenCL Language Server',
        serverOptions,
        clientOptions
    );

    output.appendLine("OpenCL Language Server started")
    let disposable = client.start();
    context.subscriptions.push(disposable);
}

export { createAndStartLanguageServer }