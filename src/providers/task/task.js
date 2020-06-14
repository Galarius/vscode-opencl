const vscode = require('vscode')
const os = require('os')

import { generateDefaultOpenCLCTasks, buildTask as buildOpenclcTask } from './compiler/openclc'
import { generateDefaultIOCTasks, buildTask as buildIOCTask } from './compiler/ioc'

const LOG_PREFIX = '[OpenCL Task Provider]'

const generateDefaultTasksForKernel = (kernelPath, deviceDetector) => {
    if(os.platform() == "darwin") {     // macOS & openclc
        console.log(`${LOG_PREFIX} Generating openclc tasks...`)
        return generateDefaultOpenCLCTasks(kernelPath, deviceDetector)
    } else {                            // Windows, Linux & ioc32/64
        console.log(`${LOG_PREFIX} Generating ioc tasks...`)
        return generateDefaultIOCTasks(kernelPath, deviceDetector)
    }
}

/** 
 * @returns  {Promise<vscode.Task[]}
 */
const getOpenCLTasks = async (deviceDetector) => {
    let tasks = []
    let workspaces = vscode.workspace.workspaceFolders
    if(typeof workspaces === 'undefined') {
        console.warn(`${LOG_PREFIX} At least one workspace folder is required`)
        return []
    }

    // Find all *.cl and *.ocl files in the workspace
    let clFiles  = await vscode.workspace.findFiles('**/*.cl')
    let oclFiles = await vscode.workspace.findFiles('**/*.ocl')
    let files = clFiles.concat(oclFiles)
    if(files.length === 0) {
        console.warn(`${LOG_PREFIX} Failed to find kernel files (*.cl, *.ocl) in workspace folders.`)
        return []
    }

    // Provide tasks for each kernel file
    for(const file of files)
        tasks = tasks.concat(generateDefaultTasksForKernel(file.fsPath, deviceDetector))

    return tasks
}

const buildTask = (description) => {
    if(os.platform() == "darwin") {     // macOS & openclc
        console.log(`${LOG_PREFIX} Building openclc task...`)
        return buildOpenclcTask(description)
    } else {                            // Windows, Linux & ioc32/64
        console.log(`${LOG_PREFIX} Building ioc task...`)
        return buildIOCTask(description)
    }
}

export {
    getOpenCLTasks,
    buildTask
}