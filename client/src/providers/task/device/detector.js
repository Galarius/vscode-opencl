const os = require('os')
const path = require('path')
const vscode = require('vscode')
const cp = require('child_process')

import { EXTENSION_ID, SAMPLE_NAME } from '../../../modules/constants' 
import { getCompiler as getIOCCompiler, IOC_ARCHS } from '../compiler/ioc'
import { getCompiler as getOpenclcCompiler, OPENCLC_ARCHS } from '../compiler/openclc'

const LOG_PREFIX = '[OpenCL Device Detector]'
const STR_COMPILER_NOT_FOUND = `${LOG_PREFIX} Failed to find compiler. Check the console in dev tools.`
const STR_COMPILER_PROCESS_FAILED = `${LOG_PREFIX} Failed to detect supported OpenCL devices. Check the console in dev tools.`

/**
 * @returns  {string}
 */
const getSampleDir = () => {
    const extPath = vscode.extensions.getExtension(EXTENSION_ID).extensionPath
    return path.join(extPath, 'scripts')
}
/**
 * @returns  {readonly string[]}
 */
const getSupportedArchs = () => {
    if(os.platform() == "darwin")   // macOS & openclc
        return OPENCLC_ARCHS
    else                            // Windows, Linux & ioc32/64
        return IOC_ARCHS
}
/**
 * @returns  {string}
 */
const getCompilerName = () => {
    if(os.platform() == "darwin")   // macOS & openclc
        return getOpenclcCompiler()
    else                            // Windows, Linux & ioc32/64
        return getIOCCompiler()
}
/**
 * @param  {string} arch
 * @returns  {string[]}
 */
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
/**
 * @param  {Object} cmd
 *   * param  {string} app
 *   * param  {Array} args
 *   * param  {string} cwd
 * @returns  {Promise<boolean>}
 */
const runner = ({ app, args, cwd }) => {
    console.log(`${LOG_PREFIX} Executing ${app} with arguments ${args}`)
    return new Promise((resolve, reject) => {
        let stdout = ''
        const p = cp.spawn(app, args, { cwd })
        p.stdout.setEncoding('utf-8')
        p.stdout.on('data', (data) => (stdout += data))
        p.on('error', err => {
            return reject(err)
        })
        p.on('close', code => {
            console.log(`${LOG_PREFIX} Output: ${stdout}`)
            if (code !== 0) {
                console.log(`${LOG_PREFIX} Process finished with code ${code}`)
                return resolve(false)
            }
            return resolve(true)
        })
    })
}
/**
 * @param  {Object} cmd
 * @returns {Promise<boolean>}
 */
const detector = async (cmd) => {
    return runner(cmd).then(
        result => result,
        (err) => {
            console.error(`${LOG_PREFIX} ${err}`)
            if(err.code === 'ENOENT')
                console.error(STR_COMPILER_NOT_FOUND);
            else  
                console.error(STR_COMPILER_PROCESS_FAILED);
            return false
        }
    )
}

class OpenCLDeviceDetector {
    constructor() {
        this._devices = { }
        const archs = getSupportedArchs()
        for(const arch of archs) {
            this._devices = {...this._devices, [arch]: false}
        }
    }

    /**
     * @returns  {boolean}
     */
    isAnyDeviceSupported() {
        return Object.values(this._devices).some( (d) => d )
    }
    /**
     * @param  {string} device
     * @returns  {boolean}
     */
    isDeviceSupported(device) {
        return this._devices[device]
    }
    /**
     * Detect supported OpenCL devices
     * 
     * @returns  {Promise<void>}
     */
    async detect() {
        const app = getCompilerName()
        const cwd = getSampleDir()
        const archs = getSupportedArchs()
        for(const arch of archs) {
            const args = buildArgs(arch)
            console.log(`${LOG_PREFIX} Checking if '${arch}' is supported...`)
            const detected = await detector({ app, args, cwd })
            console.log(`${LOG_PREFIX} '${arch}' is ${detected ? 'supported' : 'not supported'}.`)
            this._devices[arch] = detected
        }
    }
}

export {
    OpenCLDeviceDetector
}