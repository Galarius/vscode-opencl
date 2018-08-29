'use strict'

import * as path from 'path';
import * as vscode from 'vscode'

import * as cmd from './cmd'

interface KernelTaskDefinition extends vscode.TaskDefinition {
    task: string;
    command: string;
    args: Array<string>;
}


export class OpenCLTaskProvider implements vscode.TaskProvider {
    provideTasks(token?: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> {
        return this.getTasks();
    }

    resolveTask(task: vscode.Task, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.Task> {
        return undefined;
    }

    taskCompileDefinition(filePath: string): KernelTaskDefinition
    {
        let defCompile: KernelTaskDefinition = {
            type: 'opencl',
            command: 'ioc64',
            task: `compile`,
            args: [
                '-cmd=compile',
                `-input="${filePath}"`
            ]
        };
        return defCompile;
    }

    taskBuildDefinition(filePath: string): KernelTaskDefinition
    {
        let fName = filePath.substring(filePath.lastIndexOf(path.sep) + 1);
        let defBuild: KernelTaskDefinition = {
            type: 'opencl',
            command: 'ioc64',
            task: `build`,
            args: [
                '-cmd=build',
                '-input="filePath"',
                `-ir="${fName}"`
            ]
        };
        return defBuild;
    }

    buildTask(definition: KernelTaskDefinition, name: string) : vscode.Task {
        let args = [definition.command].concat(definition.args);
        let command = cmd.buildCommand(args);
        let task = new vscode.Task(definition, name, 'opencl', new vscode.ShellExecution(command));
        task.group = vscode.TaskGroup.Build;
        return task;
    }

    getTasks(): Thenable<vscode.Task[]> {

        return vscode.workspace.findFiles('**/*.cl').then( (files) => {

            let result: vscode.Task[] = [];
            if(!files.length) {
                return result;
            }

            let paths : string[] = [];
            for (const file of files) {
                paths.push(file.fsPath);
            }

            let pickOptions: vscode.QuickPickOptions = {
                placeHolder: "Select the kernel file..."
            };

            return vscode.window.showQuickPick(paths, pickOptions).then(item => {
                let defCompile: KernelTaskDefinition = this.taskCompileDefinition(item);
                let defBuild: KernelTaskDefinition = this.taskBuildDefinition(item);
    
                let compileTask = this.buildTask(defCompile, 'compile');
                let buildTask = this.buildTask(defBuild, 'build');
    
                result.push(compileTask);
                result.push(buildTask);    

                return result;
            });
        });
    }
}		
