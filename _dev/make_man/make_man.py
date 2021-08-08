#!/usr/bin/env python3

"""
    Helper script to provide OpenCL Runtime hover documentation 
    in markdown format that is supported by vscode.
"""

__author__ = 'Ilya Shoshin (Galarius)'

import os
import re
import sys
import getopt

TMP_FILE = '.tmp.md'
DOWNLOAD_DIR = 'html'
RESULT_DIR   = 'md'
MAN_DIR      = os.path.join('..', '..', 'man', 'opencl_2_1')
MAN_DESC_DIR = os.path.join(MAN_DIR, 'description')
MAN_SIG_DIR  = os.path.join(MAN_DIR, 'signature')
OPENCL_MAN_TS = os.path.join('..', '..', 'client', 'src', 'providers', 'hover', 'openclMan.ts')
GRID2PHP_TBL = './grid2php'


BASE_LINK = 'http://man.opencl.org/'
OPENCL_MAN = [
# OpenCL Runtime
## Query Platform Info
'clGetPlatformIDs', 'clGetPlatformInfo',
## Query Devices
'clGetDeviceIDs', 'clGetDeviceInfo',
## Partition a Device
'clCreateSubDevices', 'clReleaseDevice', 'clRetainDevice',
## Contexts
'clCreateContext', 'clCreateContextFromType', 'clGetContextInfo', 'clReleaseContext', 'clRetainContext',
## Runtime APIs
### Command Queues
'clCreateCommandQueueWithProperties', 'clGetCommandQueueInfo', 'clReleaseCommandQueue', 'clRetainCommandQueue', 'clSetDefaultDeviceCommandQueue',
### Buffer Objects
'clCreateBuffer','clCreateSubBuffer','clEnqueueReadBuffer','clEnqueueWriteBuffer','clEnqueueReadBufferRect','clEnqueueWriteBufferRect','clEnqueueCopyBuffer','clEnqueueCopyBufferRect','clEnqueueFillBuffer','clEnqueueMapBuffer',
### Image Objects
'clCreateImage','clEnqueueReadImage','clEnqueueWriteImage','clEnqueueCopyImage','clEnqueueCopyImageToBuffer','clEnqueueCopyBufferToImage','clEnqueueFillImage','clEnqueueMapImage','clGetImageInfo','clGetSupportedImageFormats','cl_image_desc','cl_image_format',
### Memory Objects
'clEnqueueUnmapMemObject','clEnqueueMigrateMemObjects','clGetMemObjectInfo','clRetainMemObject','clReleaseMemObject','clSetMemObjectDestructorCallback',
### Sampler Objects
'clCreateSamplerWithProperties','clReleaseSampler','clRetainSampler','clGetSamplerInfo',
### Program Objects
'clBuildProgram','clCompileProgram','clCreateProgramWithSource','clCreateProgramWithBinary','clCreateProgramWithBuiltInKernels','clCreateProgramWithIL','clGetProgramBuildInfo','clGetProgramInfo','clLinkProgram','clReleaseProgram','clRetainProgram','clUnloadPlatformCompiler',
### Kernel Objects
'clCloneKernel','clCreateKernel','clCreateKernelsInProgram','clGetKernelInfo','clGetKernelArgInfo','clGetKernelSubGroupInfo','clGetKernelWorkGroupInfo','clReleaseKernel','clRetainKernel','clSetKernelArg','clSetKernelArgSVMPointer','clSetKernelExecInfo',
### Executing Kernels
'clEnqueueNDRangeKernel','clEnqueueNativeKernel',
### Event Objects
'clCreateUserEvent','clGetEventInfo','clReleaseEvent','clRetainEvent','clSetEventCallback','clSetUserEventStatus','clWaitForEvents',
### Markers, Barriers, and Waiting
'clEnqueueBarrierWithWaitList','clEnqueueMarkerWithWaitList',
### Profiling Operations on Memory Objects and Kernels
'clGetDeviceAndHostTimer','clGetEventProfilingInfo','clGetHostTimer',
### Flush and Finish
'clFlush','clFinish',
### Pipes
'clCreatePipe','clGetPipeInfo',
### Shared Virtual Memory (SVM)
'clSVMAlloc','clSVMFree','clEnqueueSVMFree','clEnqueueSVMMap','clEnqueueSVMMemcpy','clEnqueueSVMMemFill','clEnqueueSVMMigrateMem','clEnqueueSVMUnmap',

# OpenCL Compiler
## Math Built-In Functions
    ['acos', 'acosh', 'acospi'], 
    ['asin', 'asinh', 'asinpi'], 
    ['atan', 'atan2', 'atanh', 'atanpi', 'atan2pi'], 
    'cbrt', 'ceil', 'copysign', 
    ['cos', 'cosh', 'cospi', 'half_cos', 'native_cos'], 
    ['erf', 'erfc'],
    ['exp', 'exp2', 'exp10', 'expm1', 
    'half_exp', 'half_exp2', 'half_exp10',
    'native_exp', 'native_exp2', 'native_exp10'], 
    'fabs', 'fdim', 'floor', 'fma', 'fmax', 'fmin', 'fmod', 'fract', 'frexp', 'hypot', 'ilogb', 'ldexp',
    ['lgamma', 'lgamma_r'],
    ['log', 'log2', 'log10', 'log1p', 'logb',
    'half_log', 'half_log2', 'half_log10',
    'native_log', 'native_log2', 'native_log10'], 
    'mad', 
    ['mag', 'maxmag', 'minmag'], 
    'modf', 'nan', 'nextafter', 
    ['pow', 'pown', 'powr', 'half_powr', 'native_powr'],
    'remainder', 'remquo', 'rint', 'rootn', 'round', 
    ['sin', 'sincos', 'sinh', 'sinpi', 'half_sin', 'native_sin'], 
    ['sqrt', 'rsqrt' ],
    ['tan', 'tanh'],
    ['divide', 'half_divide', 'native_divide'],
    ['recip', 'half_recip', 'native_recip'],
## Async Copy and Prefetch Functions
    'async_work_group_copy', 'async_work_group_strided_copy', 'wait_group_events', 'prefetch',
## Atomic Functions
    'atomic_init','atomic_work_item_fence',
    ['atomic_store', 'atomic_store_explicit', 'atomic_exchange', 'atomic_exchange_explicit'],
    ['atomic_compare_exchange', 'atomic_compare_exchange_strong','atomic_compare_exchange_strong_explicit', 'atomic_compare_exchange_weak','atomic_compare_exchange_weak_explicit'],
    ['atomic_fetch_key','atomic_fetch_key_explicit'],
    ['atomic_flag_test_and_set','atomic_flag_test_and_set_explicit'],
    ['atomic_flag_clear','atomic_flag_clear_explicit'],
## Common Built-In Functions
    ['clamp_common', 'clamp'],
    'degrees',
    ['commonMax', 'max'],
    ['commonMin', 'min'],
    'mix', 'radians', 'sign', 'smoothstep', 'step',
]

def print_usage(name):
    print("""{0} <command>
    Commands:
        * -h - show this help message
        * -d - download html documentation
        * -c - convert to markdown
        * -u - update `opencl for vscode` files
    Requirements:
        * wget
        * pandoc
        * grid2php
""".format(name))

def get_signature(file):
    sig_lines = []
    in_sig = False
    with open(file, 'r') as f:
        for _ in range(2):
            next(f)
        for line in f:
            if in_sig:
                if line.startswith('##'):
                    break
                elif line == '\n':
                    continue
                else:
                    sig_lines.append(line)
            elif line == '\n':
               in_sig = True
    return ''.join(sig_lines)

def get_description(file):
    desc_lines = []
    keep = False
    prev = ''
    with open(file, 'r') as f:
        for line in f:
            if not keep and (line.startswith('-----') or line.startswith('##')):
                keep = True
                desc_lines.insert(0, prev)
            if keep:
                desc_lines.append(line)
            prev = line

    return ''.join(desc_lines)

def get_brief(file):
    brief_lines = []
    with open(file, 'r') as f:
        next(f)
        for line in f:
            if len(brief_lines) == 0 and line == "\n":
                continue
            if len(brief_lines) > 0 and line == "\n":
                break
            brief_lines.append(line.rstrip())
    return ' '.join(brief_lines)

def get_openclman_ts_item(func, variation = ''):
    if len(variation) == 0:
        variation = func
    print('Generating brief for {}...'.format(variation))
    md = os.path.join(RESULT_DIR, func + '.md')
    brief = get_brief(md)
    item = [
        "%s:\t{" % (variation),
        "\t\tbrief: '{}',".format(brief.rstrip()),
        "\t\tsignature: path.join(MAN_SIG,'{}.txt'),".format(func),
        "\t\tdescription: path.join(MAN_DESC,'{}.md'),".format(func),
        "\t\treference: '{}{}.html',".format(BASE_LINK, func),
        "\t},\n"
    ]
    return item

def generate_openclman_ts():
    lines = []
    header = """/* !!! THIS FILE IS GENERATED WITH `make_man.py` SCRIPT !!!! */

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
"""
    footer = "};"
    lines.append(header)
    for obj in OPENCL_MAN:
        item = []
        if(type(obj) == list):
            general_func = obj[0] # like 'cos'
            for func in obj:      # other functions (e.g. 'cosh' or 'cospi') has the same documentation as general one ('cos') 
                item = get_openclman_ts_item(general_func, func)
                lines.append('\n'.join(item))
        else:
            item = get_openclman_ts_item(obj)
            lines.append('\n'.join(item))
    last = lines[-1]
    last = last[:-2]
    last += '\n'
    lines[-1] = last
    lines.append(footer)
    return ''.join(lines)

def main():
    try:
       opts, args = getopt.getopt(sys.argv[1:], "hdcu")
    except getopt.GetoptError:
        print_usage(sys.argv[0])
        sys.exit(1)

    if not len(opts):
        print_usage(sys.argv[0])
        sys.exit(1)

    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)

    if not os.path.exists(RESULT_DIR):
        os.makedirs(RESULT_DIR)

    cwd = os.path.dirname(sys.argv[0])

    for opt, arg in opts:
        if opt == '-h':
            print_usage(sys.argv[0])
            sys.exit(0)
        elif opt == '-d':
            for func in OPENCL_MAN:
                if type(func) == list:
                    func = func[0]
                fname = func + '.html'
                url = BASE_LINK + fname
                dst = os.path.join(DOWNLOAD_DIR, fname)
                if os.path.exists(dst):
                    print('File {} exists'.format(fname))
                else:
                    print('Downloading {} with `wget`...'.format(func))
                    os.system('wget --directory-prefix={} {}'.format(DOWNLOAD_DIR, url))
        elif opt == '-c':
            tmp = os.path.join(RESULT_DIR, TMP_FILE) 
            for func in OPENCL_MAN:
                if type(func) == list:
                    func = func[0]
                converter = os.path.join(cwd, GRID2PHP_TBL)
                if not os.path.exists(converter):
                    print("Failed to find {} ", converter)
                    exit(1)
                src = os.path.join(DOWNLOAD_DIR, func + '.html')
                dst = os.path.join(RESULT_DIR, func + '.md')
                if os.path.exists(dst):
                    print('File {} already converted'.format(func + '.html'))
                else:
                    print('Converting {} with `pandoc`...'.format(func))
                    os.system('pandoc -f html -t markdown_strict+grid_tables {} > {}'.format(src, tmp))
                    # In some file may occur the following:
                    # -   
                    #
                    #   some text    
                    print('Converting {} with `grid2php`...'.format(func))
                    os.system('{} {} {}'.format(converter, tmp, dst))
                    os.remove(tmp)
        elif opt == '-u':
            for func in OPENCL_MAN:
                if type(func) == list:
                    func = func[0]
                md = os.path.join(cwd, RESULT_DIR, func + '.md')
                dst_sig = os.path.join(MAN_SIG_DIR, func + '.txt')
                dst_desc = os.path.join(MAN_DESC_DIR, func + '.md')
                
                if not func.startswith('cl_'):
                    print('Creating file with {} signature...'.format(func))
                    # get signature from file
                    sig = get_signature(md)
                    with open(dst_sig, 'w') as f:
                        f.write(sig)
                
                print('Creating file with {} description...'.format(func))
                # get description from file
                desc = get_description(md)
                with open(dst_desc, 'w') as f:
                    f.write(desc)

            print('Generating openclMan.ts file...')
            content = generate_openclman_ts()
            with open(OPENCL_MAN_TS, 'w') as f:
                f.write(content)                
        else:
            print('Unregognised option {}'.format(opt))
    print('Done!')
    
if __name__ == "__main__":
    main()
    