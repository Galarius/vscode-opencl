import { getTaskDefinition } from '../../../../src/providers/task/compiler/openclc'

describe('Task Provider OPENCLC Tests', () => {
    test('Test task definition creation', () => {
        expect(getTaskDefinition({
            taskName: 'x86_64 task',
            arch: 'x86_64',
            kernelPath: '~/Documents/Project/kernel.cl',
            outputPath: 'kernel.x86_64.bc'
        })).toMatchObject({
            label: 'opencl: custom x86_64 task',
            type: 'opencl',
            command: '/System/Library/Frameworks/OpenCL.framework/Libraries/openclc',
            args: [
                '-emit-llvm',
                '-c',
                `-arch`,
                'x86_64',
                '~/Documents/Project/kernel.cl',
                '-o kernel.x86_64.bc'
            ]
        })
    })
})