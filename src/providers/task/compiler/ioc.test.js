import { getCompileTaskDefinition, getBuildTaskDefinition } from './ioc'


describe('Task Provider IOC Tests', () => {
    test('Test compile task definition creation', () => {
        expect(getCompileTaskDefinition({
            taskName: 'compile cpu task',
            command: 'ioc64',
        },{
            arch: 'cpu',
            kernelPath: 'C:\\Users\\user\\Documents\\Project\\kernel.cl'
        })).toMatchObject({
            label: 'opencl: custom compile cpu task',
            type: 'opencl',
            command: 'ioc64',
            args: [
                '-cmd=compile',
                '-device=cpu',
                '-input="C:\\Users\\user\\Documents\\Project\\kernel.cl"'
            ]
        })
    })

    test('Test build task definition creation', () => {
        expect(getBuildTaskDefinition({
            taskName: 'build gpu task',
            command: 'ioc64',
        },{
            arch: 'gpu',
            kernelPath: 'C:\\Users\\user\\Documents\\Project\\kernel.cl',
            outputPath: 'C:\\Users\\user\\Documents\\Project\\kernel.spirv64',
            std: 'spirv64'
        })).toMatchObject({
            label: 'opencl: custom build gpu task',
            type: 'opencl',
            command: 'ioc64',
            args: [
                '-cmd=build',
                '-device=gpu',
                '-input="C:\\Users\\user\\Documents\\Project\\kernel.cl"',
                '-spirv64="C:\\Users\\user\\Documents\\Project\\kernel.spirv64"'
            ]
        })
    })
})