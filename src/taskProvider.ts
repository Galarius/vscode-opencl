'use strict'

import * as path from 'path';
import * as vscode from 'vscode'

import * as cmd from './cmd'
import * as os from "os";

interface KernelTaskDefinition extends vscode.TaskDefinition {
    label: string;
    command: string;
    args: Array<string>;
}


function kernelName(filePath: string): string {
    let name = filePath.substring(filePath.lastIndexOf(path.sep) + 1);
    let oclIdx = name.lastIndexOf('.ocl');
    let clIdx = name.lastIndexOf('.cl');
    if(oclIdx != -1) {
        name = name.substring(0, oclIdx);
    }
    if(clIdx != -1) {
        name = name.substring(0, clIdx);
    }
    return name;
}

// Default tasks for a given kernel
// Requirements: 
//  - Intel OpenCL SDK
//  - Windows, Linux
function generateDefaultIOCTasks(kernelPath: string): vscode.Task[] {
    let tasks : vscode.Task[] = [];
    let fName = kernelName(kernelPath);    // kernel file name
    let command: string;                        // offline compiler name
    const archs64 = ['arm64', 'ppc64', 'x64'];  // 64-bit arch identifiers
    // select an appropriate compiler name
    if(archs64.find(a => a == os.arch())) {
        command = 'ioc64';
    } else {
        command = 'ioc32';
    }
    // 'compile-only' task
    let taskName = `compile [${fName}]`;
    let definition: KernelTaskDefinition = {
        label: 'opencl: custom '.concat(taskName),
        type: 'opencl',
        command: command,
        args: [
            '-cmd=compile',
            `-input="${kernelPath}"`
        ]
    };
    let args = [definition.command].concat(definition.args);    // command + args 
    let commandLine = cmd.buildCommand(args);                   // command line 
    /*
        `$opencl.common` matcher handles messages like this:
        C:/project/kernel.cl:48:34: error: used type 'float' where floating point type is not allowed
        See definition in package.json ("problemMatchers").
    */
    let task = new vscode.Task(definition, vscode.TaskScope.Workspace, taskName, 'opencl', new vscode.ShellExecution(commandLine), "$opencl.common");
    task.group = vscode.TaskGroup.Build;
    tasks.push(task);
    // 'build' tasks
    const standarts = ['ir', 'spir32', 'spir64', 'spirv32', 'spirv64']
    for(const std of standarts) {
        let taskName = `build [${fName}] {${std}}`;
        let definition: KernelTaskDefinition = {
            label: 'opencl: custom '.concat(taskName),
            type: 'opencl',
            command: command,
            args: [
                '-cmd=build',
                `-input="${kernelPath}"`,
                `-${std}=${fName}.${std}`
            ]
        };
        let args = [definition.command].concat(definition.args);
        let commandLine = cmd.buildCommand(args);
        let task = new vscode.Task(definition, vscode.TaskScope.Workspace, taskName, 'opencl', 
                                    new vscode.ShellExecution(commandLine), 
                                    "$opencl.common");
        task.group = vscode.TaskGroup.Build;
        tasks.push(task);
    }
    return tasks;
}

// Default tasks for a given kernel
// Requirements: 
//  - OpenCL.framework
//  - macOS
function generateDefaultOpenCLCTasks(kernelPath: string): vscode.Task[] {
    let tasks : vscode.Task[] = [];
    let fName = kernelName(kernelPath);
    const archs = ['i386', 'x86_64', 'gpu_32', 'gpu_64']
    for(const arch of archs) {
        let taskName = `build [${fName}] {${arch}}`;
        let definition: KernelTaskDefinition = {
            label: 'opencl: custom '.concat(taskName),
            type: 'opencl',
            command: '/System/Library/Frameworks/OpenCL.framework/Libraries/openclc',
            args: [
                '-emit-llvm',
                '-c',
                `-arch`,
                arch,
                kernelPath,
                `-o ${fName}.${arch}.bc`
            ]
        };
        let args = [definition.command].concat(definition.args);
        let commandLine = cmd.buildCommand(args);
        /*
            `$opencl.common` matcher handles messages like this:
            /Users/galarius/Documents/Projects/Languages/Node.js/vscode-opencl/test/kernel.cl:42:8: error:
                use of undeclared identifier 'NULL'
            See definition in package.json ("problemMatchers").
        */
        let task = new vscode.Task(definition, vscode.TaskScope.Workspace, taskName, 'opencl', 
                                    new vscode.ShellExecution(commandLine), 
                                    ["$opencl.common", "$opencl.openclc"]);
        task.group = vscode.TaskGroup.Build;
        tasks.push(task);
    }
    return tasks;
}

function generateDefaultTasksForKernel(kernelPath: string): vscode.Task[]
{
    if(os.platform() == "darwin")   // macOS & openclc
        return generateDefaultOpenCLCTasks(kernelPath);
    else                            // Windows, Linux & ioc32/64
        return generateDefaultIOCTasks(kernelPath);
}

export async function  getOpenCLTasks(): Promise<vscode.Task[]> 
{
    let tasks: vscode.Task[] = [];

    let workspaceRoot = vscode.workspace.rootPath;
    if(!workspaceRoot) {
        return tasks;
    }
    
    // Find all *.cl and *.ocl files in the workspace
    let clFiles  = await vscode.workspace.findFiles('**/*.cl');
    let oclFiles = await vscode.workspace.findFiles('**/*.ocl');
    let files = clFiles.concat(oclFiles);
    if(!files.length) {
        return tasks;
    }
    
    // Provide tasks for each kernel file
    for(const file of files) {
        tasks = tasks.concat(generateDefaultTasksForKernel(file.fsPath));
    }

    return tasks;
}		
