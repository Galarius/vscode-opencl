'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import * as opencl from "./providers/completion/opencl";
import * as oclinfo from "./commands/oclinfo";
import * as formatter from "./providers/formatter";
import * as os from 'os';

import { workspace, ExtensionContext } from 'vscode';
import { Trace } from 'vscode-jsonrpc';


import {
  LanguageClient,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

import { OpenCLCompletionItemProvider } from './providers/completion/completion';
import { OpenCLHoverProvider } from './providers/hover/hover';
import { getOpenCLTasks, buildTask, OpenCLDeviceDetector } from './providers/task';

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  var serverModule = ''
  var debugServerModule = ''
  if(os.platform() == "darwin") { 
    serverModule = context.asAbsolutePath(path.join('bin', 'darwin', 'opencl-language-server'));
    debugServerModule = context.asAbsolutePath(path.join('server', 'build', 'bin', 'Debug', 'opencl-language-server'));
  } else {
    // todo: add for win and linux
  }

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    command: process.env.VSCODE_DEBUG_MODE === 'true' ? debugServerModule : serverModule,
		transport: TransportKind.stdio,
  }; 

  // Options to control the language client
  let output: vscode.OutputChannel = vscode.window.createOutputChannel('OpenCL Language Server')
  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'opencl' }],
    synchronize: {
      fileEvents: [
      workspace.createFileSystemWatcher('**/*.cl'),
      workspace.createFileSystemWatcher('**/*.cl')
    ]},
    outputChannel: output,
    outputChannelName: 'OpenCL Language Server',
    traceOutputChannel: output,
    revealOutputChannelOn: RevealOutputChannelOn.Never,
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

  // Commands
  let openclInfo = vscode.commands.registerCommand('opencl.info', () => {
      oclinfo.oclinfoDumpAll();
  });
  context.subscriptions.push(openclInfo);

  // Completion
  let completionProvider = new OpenCLCompletionItemProvider();
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(opencl.OPECL_LANGUAGE_ID, completionProvider));

  // Signature Helper
  let signatureHelpProvider = new OpenCLHoverProvider();
  context.subscriptions.push(vscode.languages.registerHoverProvider(opencl.OPECL_LANGUAGE_ID, signatureHelpProvider));
  context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "c", scheme: "file" }, signatureHelpProvider));
  context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "cpp", scheme: "file" }, signatureHelpProvider));

  // Formating
  let formattingProvider = new formatter.OpenCLDocumentFormattingEditProvider();
  context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(opencl.OPECL_LANGUAGE_ID, formattingProvider));

  // Tasks
  let workspaces = vscode.workspace.workspaceFolders;
  if(!workspaces) {
      return
  }
  let openclPromise: Thenable<vscode.Task[]> | undefined = undefined;
  const deviceDetector = new OpenCLDeviceDetector()
  for(const workspace of workspaces) {
      let clPattern = path.join(workspace.uri.fsPath, '**/*.cl');
      let oclPattern = path.join(workspace.uri.fsPath, '**/*.ocl');
      let clFileWatcher = vscode.workspace.createFileSystemWatcher(clPattern);
      let oclFileWatcher = vscode.workspace.createFileSystemWatcher(oclPattern);
      clFileWatcher.onDidCreate(() => openclPromise = undefined);
      clFileWatcher.onDidDelete(() => openclPromise = undefined);
      oclFileWatcher.onDidCreate(() => openclPromise = undefined);
      oclFileWatcher.onDidDelete(() => openclPromise = undefined);
  }
  context.subscriptions.push(vscode.tasks.registerTaskProvider(opencl.OPECL_LANGUAGE_ID.language, { 
      provideTasks: async () => {
          if (!openclPromise) {
              await deviceDetector.detect()
              if(deviceDetector.isAnyDeviceSupported()) {
                  openclPromise = getOpenCLTasks(deviceDetector);
              } else {
                  vscode.window.showErrorMessage('There are no supported opencl devices')
              }
          }
          return openclPromise;
      },
      resolveTask: async (_task: vscode.Task) => {
          const definition = _task.definition;
          if (definition) {
              const prefix = 'opencl: '
              if(_task.name.indexOf(prefix) != -1) {
                  const taskName = _task.name.substr(prefix.length);
                  return buildTask({taskName, definition})
              }
          }
          return undefined;
      }
  }));

  output.appendLine("OpenCL Language Server started")
  let disposable = client.start();
  context.subscriptions.push(disposable);
}
