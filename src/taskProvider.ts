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
                `-input="${filePath}"`,
                `-ir="${fName}"`
            ]
        };
        return defBuild;
    }

    buildTask(definition: KernelTaskDefinition, name: string) : vscode.Task {
        let args = [definition.command].concat(definition.args);
        let command = cmd.buildCommand(args);
        /*
            `$ioc` matcher handles messages like this:
            C:/project/kernel.cl:48:34: error: used type 'float' where floating point type is not allowed
        */
        let task = new vscode.Task(definition, name, 'opencl', new vscode.ShellExecution(command), "$ioc");
        task.group = vscode.TaskGroup.Build;
        return task;
    }

    async getTasks(): Promise<vscode.Task[]> 
    {
        let result: vscode.Task[] = [];

        let workspaceRoot = vscode.workspace.rootPath;
        if(!workspaceRoot) {
            return result;
        }
        
        // Find all *.cl and *.ocl files in the workspace
        let clFiles = await vscode.workspace.findFiles('**/*.cl');
        let oclFiles = await vscode.workspace.findFiles('**/*.ocl');
        let files = clFiles.concat(oclFiles);
        if(!files.length) {
            return result;
        }
        
        for(const file of files)
        {
            let fName = file.fsPath.substring(file.fsPath.lastIndexOf(path.sep) + 1);

            let defCompile: KernelTaskDefinition = this.taskCompileDefinition(file.fsPath);
            let defBuild: KernelTaskDefinition = this.taskBuildDefinition(file.fsPath);

            let compileTask = this.buildTask(defCompile, `compile [${fName}]`);
            let buildTask = this.buildTask(defBuild, `build [${fName}]`);

            result.push(compileTask);
            result.push(buildTask);    
        }

        return result;
    }
}		
