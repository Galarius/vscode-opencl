//...
std::string platform_name(cl_platform_id id)
{
    std::string result;
    size_t size = 0;
    clGetPlatformInfo(id, CL_PLATFORM_NAME, 0, nullptr, &size);
    result.resize(size);
    clGetPlatformInfo(id, CL_PLATFORM_NAME, size, 
                        const_cast<char *>(result.data()), nullptr);
    return result;
}