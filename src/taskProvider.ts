'use strict'

import * as path from 'path';
import * as vscode from 'vscode'

import * as cmd from './cmd'

interface KernelTaskDefinition extends vscode.TaskDefinition {
    label: string;
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

    taskCompileDefinition(filePath: string, label: string): KernelTaskDefinition
    {
        label = 'opencl: custom '.concat(label);
        let defCompile: KernelTaskDefinition = {
            label: `${label}`,
            type: 'shell',
            task: `compile`,
            command: 'ioc64',
            args: [
                '-cmd=compile',
                `-input="${filePath}"`
            ],
            // ToDo: args for openclc
            "osx": {
                command: '/System/Library/Frameworks/OpenCL.framework/Libraries/openclc',
                args: [
                    `"${filePath}"`
                ],
            }
        };
        return defCompile;
    }

    taskBuildDefinition(filePath: string, fName: string, label: string): KernelTaskDefinition
    {
        label = 'opencl: custom '.concat(label);
        let defBuild: KernelTaskDefinition = {
            label: `${label}`,
            type: 'shell',
            task: `build`,
            command: 'ioc64',
            args: [
                '-cmd=build',
                `-input="${filePath}"`,
                `-ir="${fName}"`
            ],
            // ToDo: args for openclc
            "osx": {
                command: '/System/Library/Frameworks/OpenCL.framework/Libraries/openclc',
                args: [
                    `"${filePath}"`
                ],
            }
        };
        return defBuild;
    }

    buildTask(definition: KernelTaskDefinition, name: string) : vscode.Task {
        let args = [definition.command].concat(definition.args);
        let command = cmd.buildCommand(args);
        /*
            `$ioc` matcher handles messages like this:

            C:/project/kernel.cl:48:34: error: used type 'float' where floating point type is not allowed

            See definition in package.json ("problemMatchers").

            ToDo: problem matcher for openclc (macOS)
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
        
        // Provide build & compile task for each kernel file
        for(const file of files)
        {
            let fName = file.fsPath.substring(file.fsPath.lastIndexOf(path.sep) + 1);
            let compileName = `compile [${fName}]`;
            let buildName = `build [${fName}]`;

            let defCompile: KernelTaskDefinition = this.taskCompileDefinition(file.fsPath, compileName);
            let defBuild:   KernelTaskDefinition = this.taskBuildDefinition(file.fsPath, fName, buildName);

            let compileTask = this.buildTask(defCompile, compileName);
            let buildTask = this.buildTask(defBuild, buildName);

            result.push(compileTask);
            result.push(buildTask);    
        }

        return result;
    }
}		
