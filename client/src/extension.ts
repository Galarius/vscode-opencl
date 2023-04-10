'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import * as oclinfo from "./commands/oclinfo";
import * as formatter from "./providers/formatter";
import { LanguageClient } from 'vscode-languageclient/node';

import { OPECL_LANGUAGE_ID } from './modules/common'
import { OpenCLCompletionItemProvider } from './providers/completion/completion';
import { OpenCLHoverProvider } from './providers/hover/hover';
import { getOpenCLTasks, buildTask, OpenCLDeviceDetector } from './providers/task';
import { CreateLanguageServer } from "./providers/server/server";
import { OpenCLDevicesProvider, OpenCLDeviceTreeItem } from "./providers/view/devices";

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
    // Completion
    let completionProvider = new OpenCLCompletionItemProvider();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(OPECL_LANGUAGE_ID, completionProvider));

    // Signature Helper
    let signatureHelpProvider = new OpenCLHoverProvider();
    context.subscriptions.push(vscode.languages.registerHoverProvider(OPECL_LANGUAGE_ID, signatureHelpProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "c", scheme: "file" }, signatureHelpProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "cpp", scheme: "file" }, signatureHelpProvider));

    // Formating
    let formattingProvider = new formatter.OpenCLDocumentFormattingEditProvider();
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(OPECL_LANGUAGE_ID, formattingProvider));

    // Tasks
    let workspaces = vscode.workspace.workspaceFolders;
    if (!workspaces) {
        return
    }
    let openclPromise: Thenable<vscode.Task[]> | undefined = undefined;
    const deviceDetector = new OpenCLDeviceDetector()
    deviceDetector.detect().then(function () {
        let devSupported = deviceDetector.isAnyDeviceSupported()
        console.log(`[OpenCL] Device detector finished. Is supported: ${devSupported}`);
    });
    for (const workspace of workspaces) {
        let clPattern = path.join(workspace.uri.fsPath, '**/*.cl');
        let oclPattern = path.join(workspace.uri.fsPath, '**/*.ocl');
        let clFileWatcher = vscode.workspace.createFileSystemWatcher(clPattern);
        let oclFileWatcher = vscode.workspace.createFileSystemWatcher(oclPattern);
        clFileWatcher.onDidCreate(() => openclPromise = undefined);
        clFileWatcher.onDidDelete(() => openclPromise = undefined);
        oclFileWatcher.onDidCreate(() => openclPromise = undefined);
        oclFileWatcher.onDidDelete(() => openclPromise = undefined);
    }
    context.subscriptions.push(vscode.tasks.registerTaskProvider(OPECL_LANGUAGE_ID.language, {
        provideTasks: async () => {
            if (!openclPromise) {
                console.log('[OpenCL] Building opencl tasks...')
                if (deviceDetector.isAnyDeviceSupported()) {
                    openclPromise = getOpenCLTasks(deviceDetector);
                } else {
                    console.warn('[OpenCL] No supported opencl devices')
                }
            }
            return openclPromise;
        },
        resolveTask: async (_task: vscode.Task) => {
            const definition = _task.definition;
            if (definition) {
                const prefix = 'opencl: '
                if (_task.name.indexOf(prefix) != -1) {
                    const taskName = _task.name.substr(prefix.length);
                    console.log(`[OpenCL] Resolving task ${taskName}...`)
                    return buildTask({ taskName, definition })
                }
            }
            return undefined;
        }
    }));

    // Tree View
    const nodeDependenciesProvider = new OpenCLDevicesProvider(context.extensionUri);
    vscode.window.registerTreeDataProvider('opencl-devices-explorer', nodeDependenciesProvider);

    // Commands
    let openclInfo = vscode.commands.registerCommand('opencl.info', () => {
        oclinfo.oclinfoDumpAll(context.extensionUri);
    });
    context.subscriptions.push(openclInfo);

    let openclSelect = vscode.commands.registerCommand('opencl.select', async (node: OpenCLDeviceTreeItem) => {
        if (typeof node === 'undefined') {
            let format_label = (label, identifier) => `${label} [${identifier}]`
            let devices = nodeDependenciesProvider.getDevices()
            let choices = devices.map(val => (format_label(val.label, val.identifier)))
            const result = await vscode.window.showQuickPick(choices, {
                onDidSelectItem: item => {
                    let device = devices.find(obj => format_label(obj.label, obj.identifier) === item)
                    const configuration = vscode.workspace.getConfiguration()
                    configuration.update('OpenCL.server.deviceID', device.identifier, vscode.ConfigurationTarget.Workspace, true)
                }
            });
        } else {
            const configuration = vscode.workspace.getConfiguration()
            configuration.update('OpenCL.server.deviceID', node.identifier, vscode.ConfigurationTarget.Workspace, true)
            vscode.window.showInformationMessage(`Use OpenCL device '${node.label}' for diagnostics.`)
        }
    });
    context.subscriptions.push(openclSelect);

    let toogleExplorerView = vscode.commands.registerCommand('opencl.toggle-explorer-view', () => {
        const configuration = vscode.workspace.getConfiguration()
        let isLocalized = vscode.workspace.getConfiguration().get('OpenCL.explorer.localizedProperties', true)
        configuration.update('OpenCL.explorer.localizedProperties', !isLocalized, vscode.ConfigurationTarget.Workspace, true)
        nodeDependenciesProvider.refresh()
    });
    context.subscriptions.push(toogleExplorerView);

    // Language Server
    if (vscode.workspace.getConfiguration().get('OpenCL.server.enable', true)) {
        let output: vscode.OutputChannel = vscode.window.createOutputChannel('OpenCL Language Server')
        let client = CreateLanguageServer(OPECL_LANGUAGE_ID, output, context.extensionUri)
        if (typeof client === 'undefined') {
            return
        }
        client.onDidChangeState((e) => {
            // Stopped = 1, Starting = 3, Running = 2
            output.appendLine(`State changed: ${e.oldState} -> ${e.newState}`)
        })
        client.start();
    }
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
