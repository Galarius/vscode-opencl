import { getKernelName, getJointCommand } from '../../../src/providers/task/common'

describe('Task Provider Common Tests', () => {
    test('Should return kernel name without extension', () => {
        expect(getKernelName('C:\\Users\\user\\Documents\\Project\\kernel.cl', '\\')).toBe('kernel')
        expect(getKernelName('C:\\Users\\user\\Documents\\Project\\kernel.ocl', '\\')).toBe('kernel')
    })

    test('Should return kernel name without extension on macOS', () => {
        expect(getKernelName('/Users/user/Documents/Project/kernel.cl', '/')).toBe('kernel')
    })

    test('Should return kernel name if there is no extension', () => {
        expect(getKernelName('C:\\Users\\user\\Documents\\Project\\kernel', '\\')).toBe('kernel')
    })

    test('Get command line from array', () => {
        expect(getJointCommand([
            'ioc64',
            '-cmd=compile',
            '-device=gpu',
            '-input="C:\\Users\\user\\Documents\\Project\\kernel.cl"'
        ])).toMatch('ioc64 -cmd=compile -device=gpu -input="C:\\Users\\user\\Documents\\Project\\kernel.cl')
    })  
})