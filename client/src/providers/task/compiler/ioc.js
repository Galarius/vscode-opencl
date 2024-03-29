const vscode = require('vscode')
const path = require('path')
const os = require('os')
import { getKernelName, getJointCommand} from '../common'

const IOC_ARCHS = Object.freeze(['cpu', 'gpu', 'fpga_fast_emu'])
const IOC_STANDARDS = Object.freeze(['ir', 'llvm', 'spirv32', 'spirv64'])
const LOG_PREFIX = '[OpenCL IOC Task Provider]'

const getCompiler = () => {
    const archs64 = ['arm64', 'ppc64', 'x64'];  // 64-bit arch identifiers
    // select an appropriate compiler name
    if(archs64.find(a => a == os.arch())) {
        return 'ioc64'
    } else {
        return 'ioc32'
    }
}

const getCompileTaskDefinition = ({taskName, command}, {arch, kernelPath}) => {
    return {
        label: 'opencl: custom '.concat(taskName),
        type: 'opencl',
        command: command,
        args: [
            '-cmd=compile',
            `-device=${arch}`,
            `-input="${kernelPath}"`
        ]
    }
}

const getBuildTaskDefinition = ({taskName, command}, {arch, kernelPath, outputPath, std}) => {
    return {
        label: 'opencl: custom '.concat(taskName),
        type: 'opencl',
        command: command,
        args: [
            '-cmd=build',
            `-device=${arch}`,
            `-input="${kernelPath}"`,
            `-${std}="${outputPath}"`
        ]
    }
}

const buildTask = ({taskName, definition}) => {
    let args = [definition.command].concat(definition.args)    // command + args 
    let commandLine = getJointCommand(args)                    // command line 
    /*
        `$opencl.common` matcher handles messages like this:
        C:/project/kernel.cl:48:34: error: used type 'float' where floating point type is not allowed
        See definition in package.json ("problemMatchers").
    */
    let task = new vscode.Task(
        definition, 
        vscode.TaskScope.Workspace, 
        taskName, 
        'opencl', 
        new vscode.ShellExecution(commandLine), 
        "$opencl.common")
    task.group = vscode.TaskGroup.Build
    return task
}

// Default tasks for a given kernel
// Requirements: 
//  - Intel OpenCL SDK
//  - Windows, Linux
// @return <vscode.Task[]>
const generateDefaultIOCTasks = (kernelPath, deviceDetector) => {
    let tasks = []
    const name = getKernelName(kernelPath)        // kernel file name
    const command = getCompiler()
   
    // 'compile-only' task
    for(const arch of IOC_ARCHS) {
        if(!deviceDetector.isDeviceSupported(arch)) {
            console.log(`${LOG_PREFIX} [CompileTask] Skip '${arch}' because it is not supported`)
            continue
        }
        const taskName = `compile [${name}] {${arch}}`
        const definition = getCompileTaskDefinition({taskName, command}, {arch, kernelPath})
        const task = buildTask({taskName, definition})
        tasks.push(task)
    }
    // 'build' tasks
    for(const arch of IOC_ARCHS) {
        if(!deviceDetector.isDeviceSupported(arch)) {
            console.log(`${LOG_PREFIX} [BuildTask] Skip '${arch}' because it is not supported`)
            continue
        }

        for(const std of IOC_STANDARDS) {
            if(std === 'llvm' && arch !== 'gpu')
                continue
            const taskName = `build [${name}] {${arch}} [${std}]`
            const outputPath = path.join('${workspaceFolder}', `${name}.${std}`)
            const definition = getBuildTaskDefinition({taskName, command}, 
                              {arch, kernelPath, outputPath, std})
            const task = buildTask({taskName, definition})
            tasks.push(task)
        }
    }
    return tasks
}

export {
    generateDefaultIOCTasks,
    getCompiler,
    buildTask
    , // consts
    IOC_ARCHS
    , // for testing
    getCompileTaskDefinition,
    getBuildTaskDefinition
}