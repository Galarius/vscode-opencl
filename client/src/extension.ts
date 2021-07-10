'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import * as opencl from "./providers/completion/opencl";
import * as oclinfo from "./commands/oclinfo";
import * as formatter from "./providers/formatter";

import { workspace, ExtensionContext } from 'vscode';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

import { OpenCLCompletionItemProvider } from './providers/completion/completion';
import { OpenCLHoverProvider } from './providers/hover/hover';
import { getOpenCLTasks, buildTask, OpenCLDeviceDetector } from './providers/task';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [{ scheme: 'file', language: 'opencl' }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
    }
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'languageServerExample',
    'Language Server Example',
    serverOptions,
    clientOptions
  );

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

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
