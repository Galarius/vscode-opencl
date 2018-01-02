
template<typename T>
void highlight()
{  }

void highlighting_test()
{
	// storage.type.opencl.c
	highlight<half>();
	// storage.type.opencl.c
	highlight<ptrdiff_t>();
	highlight<uchar>();
	highlight<ulong>();
	// storage.type.opencl.c.vector2
	highlight<char2>();
	highlight<short2>();
	highlight<int2>();
	highlight<long2>();
	highlight<float2>();
	highlight<double2>();
	highlight<half2>();
	// storage.type.opencl.c.vector2
	highlight<uchar2>();
	highlight<ushort2>();
	highlight<uint2>();
	highlight<ulong2>();
	// storage.type.opencl.c.vector3
	highlight<char3>();
	highlight<short3>();
	highlight<int3>();
	highlight<long3>();
	highlight<float3>();
	highlight<double3>();
	highlight<half3>();
	// storage.type.opencl.c.vector3
	highlight<uchar3>();
	highlight<ushort3>();
	highlight<uint3>();
	highlight<ulong3>();
	// storage.type.opencl.c.vector4
	highlight<char4>();
	highlight<short4>();
	highlight<int4>();
	highlight<long4>();
	highlight<float4>();
	highlight<double4>();
	highlight<half4>();
	// storage.type.opencl.c.vector4
	highlight<uchar4>();
	highlight<ushort4>();
	highlight<uint4>();
	highlight<ulong4>();
	// storage.type.opencl.c.vector8
	highlight<char8>();
	highlight<short8>();
	highlight<int8>();
	highlight<long8>();
	highlight<float8>();
	highlight<double8>();
	highlight<half8>();
	// storage.type.opencl.c.vector8
	highlight<uchar8>();
	highlight<ushort8>();
	highlight<uint8>();
	highlight<ulong8>();
	// storage.type.opencl.c.vector16
	highlight<char16>();
	highlight<short16>();
	highlight<int16>();
	highlight<long16>();
	highlight<float16>();
	highlight<double16>();
	highlight<half16>();
	// storage.type.opencl.c.vector16
	highlight<uchar16>();
	highlight<ushort16>();
	highlight<uint16>();
	highlight<ulong16>();
	// storage.type.opencl.c.image
	highlight<image2d_t>();
	highlight<image3d_t>();
	highlight<sampler_t>();
	highlight<sampler_t>();
	// storage.qualifier.opencl.c.address.space
	highlight<__global>();	highlight<global>();
	highlight<__local>();	highlight<local>();
	highlight<__constant>();highlight<constant>();
	highlight<__private>();	highlight<private>();
	// storage.qualifier.opencl.c.function
	highlight<__kernel>();	highlight<kernel>();
	// storage.qualifier.opencl.c.access
	highlight<__read_only>();	highlight<read_only>();
	highlight<__write_only>();	highlight<write_only>();
	highlight<__read_write>();	highlight<read_write>();
	// storage.qualifier.opencl.cpp
	highlight<uniform>();
	// storage.type.opencl.cpp
	highlight<complex>();
	highlight<imaginary>();
	highlight<quad>(); highlight<quad2>(); highlight<quad3>();
	highlight<quad4>();highlight<quad8>(); highlight<quad16>();
	highlight<float2x2>(); highlight<float2x3>(); highlight<float2x4>();
	highlight<float2x8>(); highlight<float2x16>(); highlight<float3x2>();
	highlight<float3x3>(); highlight<float3x4>(); highlight<float3x8>(); highlight<float3x16>();
	highlight<float4x2>(); highlight<float4x3>(); highlight<float4x4>();
	highlight<float4x8>(); highlight<float4x16>(); highlight<float8x2>();
	highlight<float8x3>(); highlight<float8x4>(); highlight<float8x8>(); highlight<float8x16>();
	highlight<float16x2>(); highlight<float16x3>(); highlight<float16x4>();
	highlight<float16x8>(); highlight<float16x16>();
	highlight<double2x2>(); highlight<double2x3>(); highlight<double2x4>();
	highlight<double2x8>(); highlight<double2x16>();
	highlight<double3x2>(); highlight<double3x3>(); highlight<double3x4>();
	highlight<double3x8>(); highlight<double3x16>();
	highlight<double4x2>(); highlight<double4x3>();
	highlight<double4x4>(); highlight<double4x8>(); highlight<double4x16>();
	highlight<double8x2>(); highlight<double8x3>();
	highlight<double8x4>(); highlight<double8x8>(); highlight<double8x16>();
	highlight<double16x2>(); highlight<double16x3>();
	highlight<double16x4>(); highlight<double16x8>(); highlight<double16x16>();
	// storage.type.opencl.cpp.image
	highlight<image2d>();
	highlight<image3d>();
	highlight<image2d_array>();
	highlight<image1d>();
	highlight<image1d_buffer>();
	highlight<image1d_array>();
	highlight<image2d_depth>();
	highlight<image2d_array_depth>();
	highlight<sampler>();
	highlight<queue>();
	highlight<ndrange>();
	highlight<event>();
	highlight<pipe>();
	highlight<program_pipe>();
	highlight<reserve_id>();
	highlight<mem_type>();
	highlight<mem_type_local>();
	highlight<mem_type_global>();
	highlight<mem_type_image>();
	// storage.type.opencl.cpp.atomic
	highlight<atomic_int>();
	highlight<atomic_uint>();
	highlight<atomic_long>();
	highlight<atomic_ulong>();
	highlight<atomic_float>();
	highlight<atomic_double>();
	highlight<atomic_intptr_t>();
	highlight<atomic_uintptr_t>();
	highlight<atomic_size_t>();
	highlight<atomic_ptrdiff_t>();
	highlight<atomic_flag>();
}