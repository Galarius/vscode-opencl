'use strict';

import * as vscode from 'vscode';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as cmd from '../../commands/cmd';
import * as tmp from '../../commands/tmp';

import * as l10nDefault from './l10n/default.json';

import { GetLanguageServerPath, GetLanguageServerDebugPath } from '../server/server';
import { OpenCLLanguageServerCLI } from '../server/cli';
import { isDebugMode } from '../../modules/debug';

export class OpenCLDevicesProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

	private clinfoDict: any;

	private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private extensionUri: vscode.Uri) {
	}

	hasInfo(): boolean {
		return !!(this.clinfoDict)
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	execute(serverPath: string): Promise<Buffer> {
		let tmpdir = tmp.mktmp()
		let logFilePath: string = null
		let cli = new OpenCLLanguageServerCLI(serverPath);
		if(tmpdir) {
			let logFilePath = path.join(tmpdir, 'clinfo.log');
			cli.setEnableFileLogging(true)
 			cli.setLogFile(logFilePath)
			cli.setLogLevel(0) 
		}
		cli.setSubcommand("clinfo");
		let command = cli.buildCommand();
		return new Promise((resolve, reject) => {
			cmd.execute(command).then((output) => {
				if(logFilePath) {
					fs.readFile(logFilePath, (err, data) => {
						if (err) {
							console.error("Failed to read clinfo's log file: {}", err)
						} else {
							console.log("[OpenCL] CLInfo log: {}", data.toString("utf8"));
						}
						if(tmpdir) { 
							tmp.rmtmp(tmpdir) 
						}
						resolve(output)
					});
				} else {
					resolve(output)
				}
			}).catch(function (reason) { 
				if(tmpdir) { 
					tmp.rmtmp(tmpdir) 
				}
				reject(reason) 
			});
		});
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
		var serverPath = ''

		if (isDebugMode()) {
			serverPath = GetLanguageServerDebugPath(this.extensionUri)
		} else {
			serverPath = GetLanguageServerPath(this.extensionUri)
		}
		if (!serverPath) {
			let error = "OpenCL Language Server is not available for platform: " + os.platform();
			console.error(error);
			vscode.window.showErrorMessage("Error: " + error);
			Promise.resolve([]);
		}
		if (element === undefined) {
			return new Promise((resolve, reject) => { 
				this.execute(serverPath).then( (output) => {
					this.clinfoDict = JSON.parse(output.toString("utf-8"));
					resolve(this.getPlatforms());
				}).catch( (reason) => { 
					reject(reason) 
				});
			});
		} else if (element instanceof OpenCLPlatformTreeItem) {
			let platform = element as OpenCLPlatformTreeItem
			return Promise.resolve(this.getPlatformProperties(platform.identifier));
		} else if (element instanceof OpenCLPlatformInfoTreeItem) {
			let property = element as OpenCLPlatformInfoTreeItem
			if (property.key === "DEVICES") {
				return Promise.resolve(this.getPlatformDevices(property.platformIdentifier));
			} else if (property.key === "CL_PLATFORM_EXTENSIONS") {
				return Promise.resolve(this.getPlatformExtension(property.platformIdentifier));
			}
		} else if (element instanceof OpenCLDeviceTreeItem) {
			let device = element as OpenCLDeviceTreeItem
			return Promise.resolve(this.getDeviceProperties(device.identifier, device.platformIdentifier));
		} else if (element instanceof OpenCLDeviceInfoTreeItem) {
			let property = element as OpenCLDeviceInfoTreeItem
			if (property.collapsibleState != vscode.TreeItemCollapsibleState.None) {
				var values = property.value as Array<any>
				var items: OpenCLDeviceInfoTreeItem[] = []
				for (let value of values) {
					items.push(new OpenCLDeviceInfoTreeItem(value, `${this.getDescriptionOrKey(value)}`, property.deviceIdentifier, property.platformIdentifier, vscode.TreeItemCollapsibleState.None))
				}
				return Promise.resolve(
					items.sort((a, b) => a.label.localeCompare(b.label))
				);
			}
		}
		return Promise.resolve([])
	}

	getDevices(): OpenCLDeviceTreeItem[] {
		if (!this.hasInfo()) {
			return []
		}
		let platforms = this.clinfoDict["PLATFORMS"]
		var items: OpenCLDeviceTreeItem[] = []
		for (const platform of platforms) {
			let devices = platform["DEVICES"]
			for (const device of devices) {
				items.push(new OpenCLDeviceTreeItem(device["CL_DEVICE_NAME"], device["DEVICE_ID"], platform["PLATFORM_ID"]));
			}
		}
		return items.sort((a, b) => a.label.localeCompare(b.label))
	}

	getPlatforms(): OpenCLPlatformTreeItem[] {
		if (!this.hasInfo()) {
			return []
		}
		let platforms = this.clinfoDict["PLATFORMS"]
		var items: OpenCLPlatformTreeItem[] = []
		for (let platform of platforms) {
			let name = platform["CL_PLATFORM_NAME"]
			let version = platform["CL_PLATFORM_VERSION"]
			let identifier = platform["PLATFORM_ID"]
			let label = `${this.getDescriptionOrKey(name)} ${version}`
			items.push(new OpenCLPlatformTreeItem(label, identifier));
		}
		return items.sort((a, b) => a.label.localeCompare(b.label))
	}

	getPlatformProperties(platformIdentifier: string): OpenCLPlatformInfoTreeItem[] {
		if (!this.hasInfo()) {
			return []
		}
		let platforms = this.clinfoDict["PLATFORMS"]
		let result = platforms.find(obj => obj["PLATFORM_ID"] === platformIdentifier);
		let name = this.getLocalizedPair('CL_PLATFORM_NAME', result["CL_PLATFORM_NAME"])
		let version = this.getLocalizedPair('CL_PLATFORM_VERSION', result["CL_PLATFORM_VERSION"])
		let vendor = this.getLocalizedPair('CL_PLATFORM_VENDOR', result["CL_PLATFORM_VENDOR"])
		let profile = this.getLocalizedPair('CL_PLATFORM_PROFILE', result["CL_PLATFORM_PROFILE"])
		return [
			new OpenCLPlatformInfoTreeItem('CL_PLATFORM_NAME', name, platformIdentifier, vscode.TreeItemCollapsibleState.None),
			new OpenCLPlatformInfoTreeItem('CL_PLATFORM_VENDOR', vendor, platformIdentifier, vscode.TreeItemCollapsibleState.None),
			new OpenCLPlatformInfoTreeItem('CL_PLATFORM_PROFILE', profile, platformIdentifier, vscode.TreeItemCollapsibleState.None),
			new OpenCLPlatformInfoTreeItem('CL_PLATFORM_VERSION', version, platformIdentifier, vscode.TreeItemCollapsibleState.None),
			new OpenCLPlatformInfoTreeItem('CL_PLATFORM_EXTENSIONS', this.getDescriptionOrKey('CL_PLATFORM_EXTENSIONS'), platformIdentifier, vscode.TreeItemCollapsibleState.Collapsed),
			new OpenCLPlatformInfoTreeItem('DEVICES', this.getDescriptionOrKey('DEVICES'), platformIdentifier, vscode.TreeItemCollapsibleState.Expanded)
		]
	}

	getPlatformExtension(platformIdentifier: string): OpenCLPlatformInfoTreeItem[] {
		if (!this.hasInfo()) {
			return []
		}
		let platforms = this.clinfoDict["PLATFORMS"]
		let result = platforms.find(obj => obj["PLATFORM_ID"] === platformIdentifier);
		let extensions = result["CL_PLATFORM_EXTENSIONS"]
		var items: OpenCLPlatformInfoTreeItem[] = []
		for (const extension of extensions) {
			items.push(new OpenCLPlatformInfoTreeItem('CL_PLATFORM_EXTENSIONS', extension, platformIdentifier, vscode.TreeItemCollapsibleState.None));
		}
		return items.sort((a, b) => a.label.localeCompare(b.label))
	}

	getPlatformDevices(platformIdentifier: string): OpenCLDeviceTreeItem[] {
		if (!this.hasInfo()) {
			return []
		}
		let platforms = this.clinfoDict["PLATFORMS"]
		let result = platforms.find(obj => obj["PLATFORM_ID"] === platformIdentifier);
		let devices = result["DEVICES"]
		if(devices) {
			var items: OpenCLDeviceTreeItem[] = []
			for (const device of devices) {
				items.push(new OpenCLDeviceTreeItem(device["CL_DEVICE_NAME"], device["DEVICE_ID"], platformIdentifier));
			}
			return items.sort((a, b) => a.label.localeCompare(b.label))
		}
		return []
	}

	getDeviceProperties(deviceIdentifier: string, platformIdentifier: string): OpenCLDeviceInfoTreeItem[] {
		if (!this.hasInfo()) {
			return []
		}
		let platforms = this.clinfoDict["PLATFORMS"]
		let platform = platforms.find(obj => obj["PLATFORM_ID"] === platformIdentifier);
		let devices = platform["DEVICES"]
		let device = devices.find(obj => obj["DEVICE_ID"] === deviceIdentifier);

		var items: OpenCLDeviceInfoTreeItem[] = []
		for (let key in device) {
			if (key === 'DEVICE_ID') {
				continue;
			}
			var title: string
			var state: vscode.TreeItemCollapsibleState
			if (device[key] instanceof Array) {
				let arr = device[key] as Array<string>
				if (arr.length > 0) {
					title = this.getDescriptionOrKey(key)
					state = vscode.TreeItemCollapsibleState.Collapsed
				} else {
					title = this.getLocalizedPair(key, this.getDescriptionOrKey('CL_NONE'))
					state = vscode.TreeItemCollapsibleState.None
				}
			} else {
				title = this.getLocalizedPair(key, device[key])
				state = vscode.TreeItemCollapsibleState.None
			}
			items.push(new OpenCLDeviceInfoTreeItem(key, title, deviceIdentifier, platformIdentifier, state, device[key]))
		}

		return items.sort((a, b) => a.label.localeCompare(b.label))
	}

	private getDescriptionOrKey(key: string): string {
		if (vscode.workspace.getConfiguration().get('OpenCL.explorer.localizedProperties', true)) {
			if (key in l10nDefault) {
				return l10nDefault[key]
			}
		}
		return key
	}

	private getLocalizedPair(key: string, value: string): string {
		return `${this.getDescriptionOrKey(key)}: ${this.getDescriptionOrKey(value)}`
	}
}

export class OpenCLPlatformTreeItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly identifier: string
	) {
		super(label, vscode.TreeItemCollapsibleState.Expanded);
		this.tooltip = `${this.label}`;
	}

	iconPath = new vscode.ThemeIcon("symbol-constructor")

	contextValue = 'opencl-platform';
}

export class OpenCLPlatformInfoTreeItem extends vscode.TreeItem {

	constructor(
		public readonly key: string,
		public readonly label: string,
		public readonly platformIdentifier: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}`;
	}
	contextValue = 'opencl-platform-info';
}

export class OpenCLDeviceTreeItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly identifier: string,
		public readonly platformIdentifier: string
	) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);
		this.tooltip = `${this.label}`;
	}

	iconPath = new vscode.ThemeIcon("symbol-function")

	contextValue = 'opencl-device';
}

export class OpenCLDeviceInfoTreeItem extends vscode.TreeItem {

	constructor(
		public readonly key: string,
		public readonly label: string,
		public readonly deviceIdentifier: string,
		public readonly platformIdentifier: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly value?: any,
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}`;
	}
	contextValue = 'opencl-device-info';
}