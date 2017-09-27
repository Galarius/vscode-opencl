'use strict';

import * as vscode from 'vscode';

export const OPECL_LANGUAGE_ID: vscode.DocumentFilter = { language: "opencl", scheme: "file" };

export const KEYWORDS: string[] = [
    // C
    "asm","__asm__","auto","bool","_Bool","char","_Complex","double","enum","float","_Imaginary","int","long","short","signed","struct","typedef","union","unsigned","void",
    // C++ 14
    "alignas","continue","friend","register","true","alignof","decltype","goto","reinterpret_cast","try","asm","default","if","return","typedef","auto","delete","inline","typeid","do","typename","break","sizeof","case","dynamic_cast","mutable","static","catch","else","namespace","static_assert","using","enum","new","static_cast","virtual","char16_t","explicit","noexcept","char32_t","export","nullptr","switch","volatile","class","extern","operator","template","wchar_t","const","false","private","this","while","constexpr","protected","thread_local","const_cast","for","public","throw",
    // OpenCL C
    "uchar","ushort","uint","ulong","half","size_t","ptrdiff_t","intptr_t","uintptr_t",
    "char2", "short2", "int2", "long2", "float2", "double2", "half2", "uchar2", "ushort2", "uint2", "ulong2", 
    "char3", "short3", "int3", "long3", "float3", "double3", "half3", "uchar3", "ushort3", "uint3", "ulong3", 
    "char4", "short4", "int4", "long4", "float4", "double4", "half4", "uchar4", "ushort4", "uint4", "ulong4", 
    "char8", "short8", "int8", "long8", "float8", "double8", "half8", "uchar8", "ushort8", "uint8", "ulong8", 
    "char16", "short16", "int16", "long16", "float16", "double16", "half16", "uchar16", "ushort16", "uint16", "ulong16",
    "image2d_t", "image3d_t", "sampler_t", "sampler_t",
    "__global","global","__local","local","__constant","constant","__private","private",
    "__kernel","kernel","__read_only","read_only","__write_only","write_only","__read_write","read_write",
    // OpenCL C++
    "uniform", "complex","imaginary","quad",
    "quad2","quad3","quad4","quad8","quad16","float2x2",
    "float2x3","float2x4","float2x8","float2x16","float3x2",
    "float3x3","float3x4","float3x8","float3x16","float4x2",
    "float4x3","float4x4","float4x8","float4x16","float8x2",
    "float8x3","float8x4","float8x8","float8x16","float16x2",
    "float16x3","float16x4","float16x8","float16x16","double2x2",
    "double2x3","double2x4","double2x8","double2x16","double3x2",
    "double3x3","double3x4","double3x8","double3x16","double4x2",
    "double4x3","double4x4","double4x8","double4x16","double8x2",
    "double8x3","double8x4","double8x8","double8x16",
    "double16x2","double16x3","double16x4","double16x8","double16x16",
    "image2d","image3d","image2d_array","image1d","image1d_buffer","image1d_array","image2d_depth","image2d_array_depth","sampler","queue","ndrange","event","pipe","program_pipe","reserve_id","mem_type","mem_type_local","mem_type_global","mem_type_image",
    "memory_order","memory_scope","atomic_flag",
    "atomic_int","atomic_uint","atomic_long","atomic_ulong","atomic_float","atomic_double","atomic_intptr_t","atomic_uintptr_t","atomic_size_t","atomic_ptrdiff_t"
];

export const FUNCTIONS: string[] = [
    //// OpenCL C Built-in
    // Work-Item Functions
    "get_work_dim", "get_global_size", "get_global_id", "get_local_size", "get_local_id", "get_num_groups", "get_group_id", "get_global_offset",
    // Math Functions
    "acos","acosh","acospi","asin","asinh","asinpi","atan","atan2","atanh","atanpi","atan2pi","cbrt","ceil","copysign","cos","cosh","cospi","erfc","erf","exp","exp2","exp10","expm1","fabs","fdim","floor","fma","fmax","fmod","fract","frexp","hypot","ilogb","ldexp","lgamma","log","log2","log10","log1p","logb","mad","maxmag","minmag","modf","nan","nextafter","pow","pown","powr","remainder","remquo","rint","rootn","round","rsqrt","sin","sincos","sinh","sinpi","sqrt","tan","tanh","tanpi","tgamma","trunc",
    // Math Functions with `half_` prefix
    "half_cos","half_divide","half_exp","half_exp2","half_exp10","half_log","half_log2","half_log10","half_powr","half_recip","half_rsqrt","half_sin","half_sqrt","half_tan",
    // Math Functions with native` prefix
    "native_cos","native_divide","native_exp","native_exp2","native_exp10","native_log","native_log2","native_log10","native_powr","native_recip","native_rsqrt","native_sin","native_sqrt","native_tan",
    // Integer Functions
    "abs","abs_diff","add_sat","hadd","rhadd","clamp","clz","mad_hi","mad_sat","max","min","mul_hi","rotate","sub_sat","upsample","mad24","mul24",
    // Common Functions
    "degrees","mix","radians","step","smoothstep","sign",
    // Geometric Functions
    "cross","dot","distance","length","normalize","fast_distance","fast_length","fast_normalize",
    // Relational Functions
    "isequal","isnotequal","isgreater","isgreaterequal","isless","islessequal","islessgreater","isfinite","isinf","isnan","isnormal","isordered","isunordered","signbit","any","all","bitselect","select",
    // Vector Data Load and Store Functions
    "vload_half","vstore_half","vstore_half_rte", "vstore_half_rtz", "vstore_half_rtp", "vstore_half_rtn",
    "vload2","vstore2","vload_half2","vstore_half2","vstore_half2_rte","vstore_half2_rtz","vstore_half2_rtp","vstore_half2_rtn","vloada_half2","vstorea_half2","vstorea_half2_rte","vstorea_half2_rtz","vstorea_half2_rtp","vstorea_half2_rtn",
    "vload3","vstore3","vload_half3","vstore_half3","vstore_half3_rte","vstore_half3_rtz","vstore_half3_rtp","vstore_half3_rtn","vloada_half3","vstorea_half3","vstorea_half3_rte","vstorea_half3_rtz","vstorea_half3_rtp","vstorea_half3_rtn",
    "vload4","vstore4","vload_half4","vstore_half4","vstore_half4_rte","vstore_half4_rtz","vstore_half4_rtp","vstore_half4_rtn","vloada_half4","vstorea_half4","vstorea_half4_rte","vstorea_half4_rtz","vstorea_half4_rtp","vstorea_half4_rtn",
    "vload8","vstore8","vload_half8","vstore_half8","vstore_half8_rte","vstore_half8_rtz","vstore_half8_rtp","vstore_half8_rtn","vloada_half8","vstorea_half8","vstorea_half8_rte","vstorea_half8_rtz","vstorea_half8_rtp","vstorea_half8_rtn",
    "vload16","vstore16","vload_half16","vstore_half16","vstore_half16_rte","vstore_half16_rtz","vstore_half16_rtp","vstore_half16_rtn","vloada_half16","vstorea_half16","vstorea_half16_rte","vstorea_half16_rtz","vstorea_half16_rtp","vstorea_half16_rtn",
    // Synchronization Functions
    "barrier", 
    // Explicit Memory Fence Functions
    "mem_fence","read_mem_fence","write_mem_fence",
    // Async Copies from Global to Local Memory, Local to Global Memory, and Prefetch
    "async_work_group_copy","async_work_group_copy","async_work_group_strided_copy","async_work_group_strided_copy","wait_group_events","prefetch",
    // Atomic Functions
    "atomic_add","atomic_sub","atomic_xchg","atomic_inc","atomic_dec","atomic_cmpxchg","atomic_min","atomic_max","atomic_and","atomic_or","atomic_xor",
    // Miscellaneous Vector Functions
    "vec_step","shuffle","shuffle2",
    // Image Read and Write Functions
    "CLK_NORMALIZED_COORDS_TRUE","CLK_NORMALIZED_COORDS_FALSE","CLK_ADDRESS_MIRRORED_REPEAT","CLK_ADDRESS_REPEAT","CLK_ADDRESS_CLAMP_TO_EDGE","CLK_ADDRESS_CLAMP","CLK_ADDRESS_NONE","CLK_FILTER_NEAREST","CLK_FILTER_LINEAR",
    "CL_A","CL_INTENSITY","CL_Rx","CL_RA","CL_RGx","CL_RGBx","CL_ARGB","CL_BGRA","CL_RGBA","CL_R","CL_RG","CL_RGB","CL_LUMINANCE",
    // Built-in Image Functions
    "read_imagef","read_imagei","read_imageui","write_imagef","write_imagei","write_imageui","get_image_width","get_image_height","get_image_depth","get_image_channel_data_type","get_image_channel_order","get_image_dim",
    ////
    //// OpenCL C++ Built-in
    ////
    // Math Functions
    "lgamma_r",
    // Address Space Qualifier Functions
    "get_mem_type",
    // Printf
    "printf",
    // Image
    "CLK_MIP_FILTER_NONE","CLK_MIP_FILTER_NEAREST","CLK_MIP_FILTER_LINEAR",
];

export const CONSTS: string[] = [
    //// OpenCL
    "MAXFLOAT", "HUGE_VALF", "INFINITY", "NAN",
    "M_E_F","M_LOG2E_F","M_LOG10E_F","M_LN2_F","M_LN10_F","M_PI_F","M_PI_2_F","M_PI_4_F","M_1_PI_F","M_2_PI_F","M_2_SQRTPI_F","M_SQRT2_F","M_SQRT1_2_F",
    //// OpenCL C++
    "HUGE_VAL"
];

export const MACROS: string[] = [
    //// OpenCL C
    "FLT_DIG","FLT_MANT_DIG","FLT_MAX_10_EXP","FLT_MAX_EXP","FLT_MIN_10_EXP","FLT_MIN_EXP","FLT_RADIX","FLT_MAX","FLT_MIN","FLT_EPSILON",
    "CHAR_BIT","CHAR_MAX","CHAR_MIN","INT_MAX","INT_MIN","LONG_MAX","LONG_MIN","SCHAR_MAX","SCHAR_MIN","SHRT_MAX","SHRT_MIN","UCHAR_MAX","USHRT_MAX","UINT_MAX","ULONG_MAX","SCHAR_MAX","SCHAR_MIN",
    //// OpenCL C++
    "DBL_DIG","DBL_MANT_DIG","DBL_MAX_10_EXP","DBL_MAX_EXP","DBL_MIN_10_EXP","DBL_MIN_EXP","DBL_MAX","DBL_MIN","DBL_EPSILSON",
    "M_E","M_LOG2E","M_LOG10E","M_LN2","M_LN10","M_PI","M_PI_2","M_PI_4","M_1_PI","M_2_PI","M_2_SQRTPI","M_SQRT2","M_SQRT1_2","HALF_DIG","HALF_MANT_DIG","HALF_MAX_10_EXP","HALF_MAX_EXP","HALF_MIN_10_EXP","HALF_MIN_EXP","HALF_RADIX","HALF_MAX","HALF_MIN","HALF_EPSILSON",
    "M_E_H","M_LOG2E_H","M_LOG10E_H","M_LN2_H","M_LN10_H","M_PI_H","M_PI_2_H","M_PI_4_H","M_1_PI_H","M_2_PI_H","M_2_SQRTPI_H","M_SQRT2_H","M_SQRT1_2_H"
];

export const ENUMS: string[] = [
    //// OpenCL C++
    // memory_order
    "memory_order_relaxed","memory_order_acquire","memory_order_release","memory_order_acq_rel","memory_order_seq_cst",
    // memory_scope
    "memory_scope_work_item","memory_scope_sub_group","memory_scope_work_group","memory_scope_device","memory_scope_all_svm_devices",
    // image_channel_order
    "a","r","rx","rg","rgx","ra","rgb","rgbx","rgba","argb","bgra","intensity","luminance","abgr","depth","srgb","srgbx","srgba","sbgra"
];