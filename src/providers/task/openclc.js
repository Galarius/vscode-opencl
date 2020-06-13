const vscode = require('vscode')
import { getKernelName, getJointCommand } from './common'

const ARCHS = ['i386', 'x86_64', 'gpu_32', 'gpu_64']

const getTaskDefinition = ({taskName, arch, kernelPath, outputPath}) => {
    return {
        label: 'opencl: custom '.concat(taskName),
        type: 'opencl',
        command: '/System/Library/Frameworks/OpenCL.framework/Libraries/openclc',
        args: [
            '-emit-llvm',
            '-c',
            `-arch`,
            arch,
            kernelPath,
            `-o ${outputPath}`
        ]
    }
}

const buildTask = ({taskName, definition}) => {
    let args = [definition.command].concat(definition.args)    // command + args 
    let commandLine = getJointCommand(args)                   // command line 
    /*
            `$opencl.common` matcher handles messages like this:
            /Users/galarius/Documents/Projects/Languages/Node.js/vscode-opencl/test/kernel.cl:42:8: error:
                use of undeclared identifier 'NULL'
            See definition in package.json ("problemMatchers").
        */
    let task = new vscode.Task(
        definition, 
        vscode.TaskScope.Workspace, 
        taskName, 
        'opencl', 
        new vscode.ShellExecution(commandLine), 
        [
            "$opencl.common", 
            "$opencl.openclc"
        ])
    task.group = vscode.TaskGroup.Build
    return task
}

// Default tasks for a given kernel
// Requirements: 
//  - OpenCL.framework
//  - macOS
// @return <vscode.Task[]>
const generateDefaultOpenCLCTasks = (kernelPath) => {
    let tasks = []
    const name = getKernelName(kernelPath)        // kernel file name
    for(const arch of ARCHS) {
        let taskName = `build [${name}] {${arch}}`
        const outputPath = `${name}.${arch}.bc`
        const definition = getTaskDefinition({taskName, arch, kernelPath, outputPath})
        const task = buildTask({taskName, definition})
        tasks.push(task)
    }
    return tasks
}

export {
    generateDefaultOpenCLCTasks
    , // for testing
    getTaskDefinition
}