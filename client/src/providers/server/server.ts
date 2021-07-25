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

const createAndStartLanguageServer = (context) => {
    var serverModule = ''
    var debugServerModule = ''
    if(os.platform() == "darwin") { 
        serverModule = context.asAbsolutePath(path.join('bin', 'darwin', 'opencl-language-server'));
        debugServerModule = context.asAbsolutePath(path.join('server', 'build', 'bin', 'Debug', 'opencl-language-server'));
    } else {
        // todo: add for win and linux
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
        command: process.env.VSCODE_DEBUG_MODE === 'true' ? debugServerModule : serverModule,
        args: args,
            transport: TransportKind.stdio,
    }; 

    
    let output: vscode.OutputChannel = vscode.window.createOutputChannel('OpenCL Language Server')
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'opencl' }],
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

    // Create the language client and start the client.
    let client = new LanguageClient(
        'opencl',
        'OpenCL Language Server',
        serverOptions,
        clientOptions
    );
    //client.trace = Trace.Verbose;

    output.appendLine("OpenCL Language Server started")
    let disposable = client.start();
    context.subscriptions.push(disposable);
}

export { createAndStartLanguageServer }