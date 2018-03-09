/* 
	OpenCL 2.1 Reference 
	http://man.opencl.org/
*/

import * as path from 'path';
import * as vscode from 'vscode';

export interface IEntry { brief: string, signature: string; description: string; reference: string }
export interface IEntries { [name: string]: IEntry; }

function openCLManFolder(): string {
    let extPath = vscode.extensions.getExtension('galarius.vscode-opencl').extensionPath
    return path.join(extPath, 'man', 'opencl_2_1');
}

var MAN_SIG = path.join(openCLManFolder(), 'signature')
var MAN_DESC = path.join(openCLManFolder(), 'description')

export var OpenCLSignatures: IEntries = {
	clCreateBuffer: {
		brief: 'Creates a buffer object.',
		signature: path.join(MAN_SIG,'clCreateBuffer.txt'),
		description: path.join(MAN_DESC,'clCreateBuffer.md'),
		reference: 'http://man.opencl.org/clCreateBuffer.html',
	},
	clCreateContext: {
		brief: '',
		signature: path.join(MAN_SIG,'clCreateContext.txt'),
		description: path.join(MAN_DESC,'clCreateContext.md'),
		reference: 'http://man.opencl.org/clCreateContext.html',
	},
	clCreateProgramWithSource: {
		brief: '',
		signature: path.join(MAN_SIG,'clCreateProgramWithSource.txt'),
		description: path.join(MAN_DESC,'clCreateProgramWithSource.md'),
		reference: 'http://man.opencl.org/clCreateProgramWithSource.html',
	},
	clBuildProgram: {
		brief: '',
		signature: path.join(MAN_SIG,'clBuildProgram.txt'),
		description: path.join(MAN_DESC,'clBuildProgram.md'),
		reference: 'http://man.opencl.org/clBuildProgram.html',
	},
	clGetProgramBuildInfo: {
		brief: '',
		signature: path.join(MAN_SIG,'clGetProgramBuildInfo.txt'),
		description: path.join(MAN_DESC,'clGetProgramBuildInfo.md'),
		reference: 'http://man.opencl.org/clGetProgramBuildInfo.html',
	},
	clGetEventProfilingInfo: {
		brief: '',
		signature: path.join(MAN_SIG,'clGetEventProfilingInfo.txt'),
		description: path.join(MAN_DESC,'clGetEventProfilingInfo.md'),
		reference: 'http://man.opencl.org/clGetEventProfilingInfo.html',
	},
	clCreateKernel: {
		brief: '',
		signature: path.join(MAN_SIG,'clCreateKernel.txt'),
		description: path.join(MAN_DESC,'clCreateKernel.md'),
		reference: 'http://man.opencl.org/clCreateKernel.html',
	},
	clGetDeviceInfo: {
		brief: '',
		signature: path.join(MAN_SIG,'clGetDeviceInfo.txt'),
		description: path.join(MAN_DESC,'clGetDeviceInfo.md'),
		reference: 'http://man.opencl.org/clGetDeviceInfo.html',
	},
	clCreateCommandQueue: {
		brief: '',
		signature: path.join(MAN_SIG,'clCreateCommandQueue.txt'),
		description: path.join(MAN_DESC,'clCreateCommandQueue.md'),
		reference: 'http://man.opencl.org/clCreateCommandQueue.html',
	},
	clSetKernelArg: {
		brief: '',
		signature: path.join(MAN_SIG,'clSetKernelArg.txt'),
		description: path.join(MAN_DESC,'clSetKernelArg.md'),
		reference: 'http://man.opencl.org/clSetKernelArg.html',
	},
	clEnqueueNDRangeKernel: {
		brief: '',
		signature: path.join(MAN_SIG,'clEnqueueNDRangeKernel.txt'),
		description: path.join(MAN_DESC,'clEnqueueNDRangeKernel.md'),
		reference: 'http://man.opencl.org/clEnqueueNDRangeKernel.html',
	},
	clEnqueueReadBuffer: {
		brief: '',
		signature: path.join(MAN_SIG,'clEnqueueReadBuffer.txt'),
		description: path.join(MAN_DESC,'clEnqueueReadBuffer.md'),
		reference: 'http://man.opencl.org/clEnqueueReadBuffer.html',
	},
	clGetPlatformInfo: {
		brief: '',
		signature: path.join(MAN_SIG,'clGetPlatformInfo.txt'),
		description: path.join(MAN_DESC,'clGetPlatformInfo.md'),
		reference: 'http://man.opencl.org/clGetPlatformInfo.html',
	},
	clGetDeviceIDs: {
		brief: '',
		signature: path.join(MAN_SIG,'clGetDeviceIDs.txt'),
		description: path.join(MAN_DESC,'clGetDeviceIDs.md'),
		reference: 'http://man.opencl.org/clGetDeviceIDs.html',
	},
	clGetPlatformIDs: {
		brief: '',
		signature: path.join(MAN_SIG,'clGetPlatformIDs.txt'),
		description: path.join(MAN_DESC,'clGetPlatformIDs.md'),
		reference: 'http://man.opencl.org/clGetPlatformIDs.html',
	}
};