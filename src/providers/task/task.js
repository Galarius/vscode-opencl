const vscode = require('vscode')
const cp = require('child_process')
const path = require('path')
const os = require('os')

import { generateDefaultOpenCLCTasks, buildTask as buildOpenclcTask } from './compiler/openclc'
import { generateDefaultIOCTasks, buildTask as buildIOCTask } from './compiler/ioc'

const generateDefaultTasksForKernel = (kernelPath, deviceDetector) => {
    if(os.platform() == "darwin")   // macOS & openclc
        return generateDefaultOpenCLCTasks(kernelPath, deviceDetector);
    else                            // Windows, Linux & ioc32/64
        return generateDefaultIOCTasks(kernelPath, deviceDetector);
}

// @return <Promise<vscode.Task[]>
const getOpenCLTasks = async (deviceDetector) => {
    let tasks = []
    let workspaces = vscode.workspace.workspaceFolders
    if(typeof workspaces === 'undefined') {
        return []
    }

    // Find all *.cl and *.ocl files in the workspace
    let clFiles  = await vscode.workspace.findFiles('**/*.cl')
    let oclFiles = await vscode.workspace.findFiles('**/*.ocl')
    let files = clFiles.concat(oclFiles)
    if(files.length === 0) {
        return []
    }

    // Provide tasks for each kernel file
    for(const file of files) {
        tasks = tasks.concat(generateDefaultTasksForKernel(file.fsPath, deviceDetector))
    }

    return tasks
}

const buildTask = (description) => {
    if(os.platform() == "darwin")   // macOS & openclc
        return buildOpenclcTask(description);
    else                            // Windows, Linux & ioc32/64
        return buildIOCTask(description)
}

export {
    getOpenCLTasks,
    buildTask
}