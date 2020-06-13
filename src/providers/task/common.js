const path = require('path')

const getKernelName = (filePath) => {
    let name = filePath.substring(filePath.lastIndexOf(path.sep) + 1)
    let idx = name.lastIndexOf('.')
    return idx != -1           ? 
           name.substr(0, idx) :
           name
}

const getJointCommand = (args) => {
    let command = ""
    for (let arg of args) {
        command += arg + " "
    }
    command = command.slice(0, -1)
    return command
}

export {
    getKernelName,
    getJointCommand
}