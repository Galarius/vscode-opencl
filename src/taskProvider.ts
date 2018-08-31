'use strict'

import * as path from 'path';
import * as vscode from 'vscode'

import * as cmd from './cmd'
import * as os from "os";

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

    kernelName(filePath: string): string
    {
        return filePath.substring(filePath.lastIndexOf(path.sep) + 1);
    }

    commandName(): string
    {
        let command: string;
        if(os.platform() == "darwin") {
            command = '/System/Library/Frameworks/OpenCL.framework/Libraries/openclc';
        } else {
            const archs64 = ['arm64', 'ppc64', 'x64'];
            if(archs64.find(a => a == os.arch())) {
                command = 'ioc64';
            } else {
                command = 'ioc32';
            }
        }
        return command;
    }

    argsForCommandName(command: string, task: string, filePath: string): string[]
    {
        let fName = this.kernelName(filePath);
        if(os.platform() == "darwin") {
            // ToDo: typical args for 'compile' and for 'build'.
            return [
                '-emit-llvm',
                '-c',
                `-o ${fName}.bc`,
                `"${filePath}"`
            ]
        } else {
            if(task == 'compile') {
                return [
                    '-cmd=compile',
                    `-input="${filePath}"`
                ]
            } else {
                return [
                    '-cmd=build',
                    `-input="${filePath}"`,
                    `-ir="${fName}"`
                ]
            }
        }
    }

    taskCompileDefinition(filePath: string, label: string): KernelTaskDefinition
    {
        let command = this.commandName();
        let args = this.argsForCommandName(command, 'compile', filePath);
        label = 'opencl: custom '.concat(label);
        let defCompile: KernelTaskDefinition = {
            label: label,
            type: 'shell',
            task: `compile`,
            command: command,
            args: args
        };
        return defCompile;
    }

    taskBuildDefinition(filePath: string, fName: string, label: string): KernelTaskDefinition
    {
        let command = this.commandName();
        let args = this.argsForCommandName(command, 'build', filePath);
        label = 'opencl: custom '.concat(label);
        let defBuild: KernelTaskDefinition = {
            label: `${label}`,
            type: 'shell',
            task: `build`,
            command: command,
            args: args
        };
        return defBuild;
    }

    /*
        `$ioc` matcher handles messages like this:
        ------------------------------------------

        C:/project/kernel.cl:48:34: error: used type 'float' where floating point type is not allowed

        `$openclc` matcher handles messages like this:
        ----------------------------------------------

        /Users/galarius/Documents/Projects/Languages/Node.js/vscode-opencl/test/kernel.cl:42:8: error:
            use of undeclared identifier 'NULL'

        See definition in package.json ("problemMatchers").
    */
    buildTask(definition: KernelTaskDefinition, name: string) : vscode.Task {
        let args = [definition.command].concat(definition.args);
        let command = cmd.buildCommand(args);
        let defaultProblemMatcher: string;
        if(os.platform() == "darwin") {
            defaultProblemMatcher = "$openclc";
        } else {
            defaultProblemMatcher = "$ioc"
        }
        let task = new vscode.Task(definition, name, 'opencl', new vscode.ShellExecution(command), defaultProblemMatcher);
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
            let fName = this.kernelName(file.fsPath);
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
