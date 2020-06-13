const path = require('path')
const vscode = require('vscode')
const cp = require('child_process')
const os = require('os')

import { EXTENSION_ID, SAMPLE_NAME } from '../../../modules/constants' 
import { getCompiler as getIOCCompiler, IOC_ARCHS } from '../compiler/ioc'
import { getCompiler as getOpenclcCompiler, OPENCLC_ARCHS } from '../compiler/openclc'
import { resolve } from 'url'

const LOG_PREFIX = '[OpenCL Device Detector]'
const STR_COMPILER_NOT_FOUND = `${LOG_PREFIX} Failed to find compiler. Check the console in dev tools.`
const STR_COMPILER_PROCESS_FAILED = `${LOG_PREFIX} Failed to detect OpenCL device. Check the console in dev tools to find detailes.`

const getSampleDir = () => {
    const extPath = vscode.extensions.getExtension(EXTENSION_ID).extensionPath
    return path.join(extPath, 'scripts')
}

const getSupportedArchs = () => {
    if(os.platform() == "darwin")   // macOS & openclc
        return OPENCLC_ARCHS
    else                            // Windows, Linux & ioc32/64
        return IOC_ARCHS
}

const getCompilerName = () => {
    if(os.platform() == "darwin")   // macOS & openclc
        return getOpenclcCompiler()
    else                            // Windows, Linux & ioc32/64
        return getIOCCompiler()
}

const buildArgs = (arch) => {
    if(os.platform() == "darwin") {
        return [
            '-emit-llvm',
            '-c',
            `-arch`,
            arch,
            SAMPLE_NAME
        ]
    } else {
        return [
            '-cmd=compile',
            `-device=${arch}`,
            `-input=${SAMPLE_NAME}`
        ]
    }
}

class OpenCLDeviceDetector {
    constructor() {
        this._devices = { }
        const archs = getSupportedArchs()
        for(const arch of archs) {
            this._devices = {...this._devices, [arch]: false}
        }
    }

    isAnyDeviceSupported() {
        return Object.values(this._devices).some( (d) => d )
    }

    isDeviceSupported(device) {
        return this._devices[device]
    }

    async detect() {
        const archs = getSupportedArchs()
        for(const arch of archs) {
            const app = getCompilerName()
            const kernelDir = getSampleDir()
            const args = buildArgs(arch)
            console.log(`${LOG_PREFIX} Detecting ${arch} device...`)
            const detected = await this._detect({ app, args, cwd: kernelDir })
            console.log(`${LOG_PREFIX} ${detected ? 'Detected' : 'Not detected'} ${arch} device.`)
            this._devices[arch] = detected
        }
    }

    async _detect(cmd) {
        return runner(cmd).then(
            (result) => {
                return result
            },
            (err) => {
                console.error(`${err}`)
                if(err.code === 'ENOENT')
                    vscode.window.showErrorMessage(STR_COMPILER_NOT_FOUND)
                else     
                    vscode.window.showErrorMessage(STR_COMPILER_PROCESS_FAILED)
                return false
            }
        )
    }
}

const runner = ({ app, args, cwd }) => {
    console.log(`[OpenCL Device Detector] Running ${app} with arguments: ${args}...`)
    return new Promise((resolve, reject) => {
        let stdout = ''
        const p = cp.spawn(app, args, { cwd })
        p.stdout.setEncoding('utf-8')
        p.stdout.on('data', (data) => (stdout += data))
        p.on('error', err => {
            if (err)
                return reject(err)
        })
        p.on('close', code => {
            if (code !== 0) {
                console.log(stdout)
                console.log(`Process finished with code ${code}`)
                return resolve(false)
            }
            return resolve(true)
        })
    })
}

export {
    OpenCLDeviceDetector
}