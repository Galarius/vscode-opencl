'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import * as formatter from "./providers/formatter";
import { LanguageClient, State } from 'vscode-languageclient/node';

import { OPECL_LANGUAGE_ID, CONFIG_OPECL_SERVER_PATH } from './modules/common'

import { OpenCLHoverProvider } from './providers/hover/hover';
import { getOpenCLTasks, buildTask, OpenCLDeviceDetector } from './providers/task';
import { CreateLanguageClient } from "./providers/server/server";
import { OpenCLDevicesProvider, OpenCLDeviceTreeItem } from "./providers/view/devices";
import { LanguageServerManager } from './providers/server/manager'

let client: LanguageClient | undefined;

function stateToString(state: State): string {
    const stateMap: { [key in State]?: string } = {
        [State.Stopped]: "Stopped",
        [State.Starting]: "Starting",
        [State.Running]: "Running"
    };
    return stateMap[state] || "Unknown";
}

async function showDevicePicker(provider: OpenCLDevicesProvider) {
    let format_label = (label: string, identifier: string) => `${label} [${identifier}]`
    let devices = provider.getDevices()
    let choices = devices.map(val => (format_label(val.label, val.identifier)))
    await vscode.window.showQuickPick(choices, {
        onDidSelectItem: item => {
            let device = devices.find(obj => format_label(obj.label, obj.identifier) === item)
            if (device) {
                let configuration = vscode.workspace.getConfiguration("OpenCL.server", null)
                configuration.update('deviceID', device.identifier, vscode.ConfigurationTarget.Workspace, true)
            }
        }
    });
}

/**
 *  Registers features that require invoking the language server directly
 * 
 * @param context 
 * @param serverPath 
 */
function registerLanguageServerBasedFeatures(context: vscode.ExtensionContext, manager: LanguageServerManager, channel: vscode.OutputChannel) {

    // Tree view
    const nodeDependenciesProvider = new OpenCLDevicesProvider(manager);
    vscode.window.registerTreeDataProvider('opencl-devices-explorer', nodeDependenciesProvider);

    // Commands
    let toogleExplorerView = vscode.commands.registerCommand('opencl.toggle-explorer-view', () => {
        let configuration = vscode.workspace.getConfiguration("OpenCL.explorer", null)
        let isLocalized = configuration.get('localizedProperties', true)
        configuration.update('localizedProperties', !isLocalized, vscode.ConfigurationTarget.Workspace, true)
        nodeDependenciesProvider.refresh()
    });
    context.subscriptions.push(toogleExplorerView);

    let openclInfo = vscode.commands.registerCommand('opencl.info', () => {
        manager.info().then((output) => {
            let clinfoDict = JSON.parse(output);
            vscode.workspace.openTextDocument({ language: 'json' }).then((doc: vscode.TextDocument) => {
                vscode.window.showTextDocument(doc, 1, false).then(e => {
                    e.edit(edit => {
                        edit.insert(new vscode.Position(0, 0), JSON.stringify(clinfoDict, null, 2));
                    });
                });
            }, (error: any) => {
                console.error(error);
                vscode.window.showErrorMessage(error);
            });
        }).catch(function (error) {
            console.error(error);
            vscode.window.showErrorMessage(error);
        });
    });
    context.subscriptions.push(openclInfo);

    let openclSelect = vscode.commands.registerCommand('opencl.select', async (node: OpenCLDeviceTreeItem) => {
        if (typeof node === 'undefined') {
            if (nodeDependenciesProvider.hasInfo()) {
                await showDevicePicker(nodeDependenciesProvider);
            } else {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    cancellable: true,
                    title: 'Loading OpenCL Info...'
                }, async (progress) => {
                    progress.report({ increment: 30 });
                    await Promise.resolve(nodeDependenciesProvider.getChildren());
                    progress.report({ increment: 100 });
                    showDevicePicker(nodeDependenciesProvider);
                });
            }
        } else {
            let configuration = vscode.workspace.getConfiguration("OpenCL.server")
            configuration.update('deviceID', node.identifier, vscode.ConfigurationTarget.Workspace, true)
            vscode.window.showInformationMessage(`Use OpenCL device '${node.label}' for diagnostics.`)
        }
    });
    context.subscriptions.push(openclSelect);

    let registerServer = vscode.commands.registerCommand('opencl.register-server', async () => {
        // Pick the binary
        const uris = await vscode.window.showOpenDialog({
            title: 'Select OpenCL Language Server Binary',
            openLabel: 'Register',
            canSelectMany: false,
            filters: os.platform() === 'win32'
                ? { 'Executable': ['exe'] }
                : { 'All files': ['*'] },
        });

        if (!uris || uris.length === 0) {
            return; // Cancelled
        }

        const serverPath = uris[0].fsPath;

        // Confirm before overwriting an existing registration
        const existing = vscode.workspace
            .getConfiguration()
            .get<string>(CONFIG_OPECL_SERVER_PATH);

        if (existing && existing !== serverPath) {
            const answer = await vscode.window.showWarningMessage(
                `A local server is already registered at:\n${existing}\n\nReplace it with the selected binary?`,
                { modal: true },
                'Replace',
            );
            if (answer !== 'Replace') {
                return;
            }
        }

        // Verify + save checksum + persist path
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'OpenCL: Registering local language server…',
                cancellable: false,
            },
            async (progress) => {
                try {
                    progress.report({ message: 'Computing checksum…' });
                    await manager.registerLocalServer(serverPath);

                    channel.appendLine(
                        `[OpenCL] Registered local language server at ${serverPath}`
                    );
                    vscode.window.showInformationMessage(
                        `OpenCL language server registered successfully. ` +
                        `Reload the window to apply the change.`,
                        'Reload Now',
                    ).then(action => {
                        if (action === 'Reload Now') {
                            vscode.commands.executeCommand('workbench.action.reloadWindow');
                        }
                    });
                } catch (err) {
                    channel.appendLine(`[OpenCL] Failed to register server: ${err}`);
                    vscode.window.showErrorMessage(
                        `Failed to register the OpenCL language server: ${(err as Error).message}`
                    );
                }
            }
        );
    });
    context.subscriptions.push(registerServer);

    let unregisterServer = vscode.commands.registerCommand('opencl.unregister-server', async () => {
        const existing = vscode.workspace
            .getConfiguration()
            .get<string>(CONFIG_OPECL_SERVER_PATH);

        if (existing) {
            // Confirm before clearing
            const answer = await vscode.window.showWarningMessage(
                `Unregister the local OpenCL language server?\n\n` +
                `Path: ${existing}\n\n` +
                `The binary file will not be deleted. ` +
                `The extension will revert to downloading the server automatically from GitHub.`,
                { modal: true },
                'Unregister',
            );

            if (answer !== 'Unregister') {
                return;
            }
        }

        try {
            await manager.unregisterLocalServer();

            channel.appendLine('[OpenCL] Unregistered local language server.');
            vscode.window.showInformationMessage(
                'Local OpenCL language server unregistered. ' +
                'Reload the window to apply the change.',
                'Reload Now',
            ).then(action => {
                if (action === 'Reload Now') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        } catch (err) {
            channel.appendLine(`[OpenCL] Failed to unregister server: ${err}`);
            vscode.window.showErrorMessage(
                `Failed to unregister the OpenCL language server: ${(err as Error).message}`
            );
        }
    });
    context.subscriptions.push(unregisterServer);

}

function registerFeatures(context: vscode.ExtensionContext) {
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

    let language: string = OPECL_LANGUAGE_ID.language ?? 'opencl';
    context.subscriptions.push(vscode.tasks.registerTaskProvider(language, {
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
}

function registerLanguageServer(client: LanguageClient, channel: vscode.OutputChannel) {
    let configuration = vscode.workspace.getConfiguration('OpenCL.server', null)
    if (configuration.get('enable', true)) {
        client.onDidChangeState((e) => {
            // Stopped = 1, Starting = 3, Running = 2
            channel.appendLine(`State changed: ${stateToString(e.oldState)} -> ${stateToString(e.newState)}`)
        })
        client.start();
    } else {
        channel.appendLine("OpenCL Language Server is disabled");
    }
}

export async function activate(context: vscode.ExtensionContext) {

    let channel = vscode.window.createOutputChannel('OpenCL Language Server');
    let manager = new LanguageServerManager(context, channel);

    try {
        await manager.discoverLanguageServer();
    } catch (err) {
        channel.appendLine(`OpenCL Language Server is not available: ${err}`)
        const choice = await vscode.window.showErrorMessage(
            `Failed to download OpenCL Language Server: ${err}`,
            'Retry',
        );
        if (choice === 'Retry') {
            await activate(context); // re-enter activate
            return;
        }
    }

    client = await CreateLanguageClient(
        OPECL_LANGUAGE_ID,
        channel,
        manager
    );

    if (!!client) {
        try {
            manager.checkServerPath();
            registerLanguageServer(client, channel);
        } catch (err) {
            vscode.window.showErrorMessage(
                `Failed to launch OpenCL Language Server: ${err}`,
            );
        }
    }

    registerLanguageServerBasedFeatures(context, manager, channel);
    registerFeatures(context);
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
