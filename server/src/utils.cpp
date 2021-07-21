//
//  utils.cpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/21/21.
//

#include <utils.hpp>

#include <sstream>
#include <random>
#include <regex>

namespace vscode::opencl::utils {

std::string GenerateId()
{
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 255);
    std::string identifier;
    std::stringstream hex;
    for (auto i = 0; i < 16; ++i)
    {
        const auto rc = dis(gen);
        hex << std::hex << rc;
        auto str = hex.str();
        identifier.append(str.length() < 2 ? '0' + str : str);
        hex.str(std::string());
    }
    return identifier;
}

void Trim(std::string& s)
{
#ifdef _WIN32
    bool if_ascii = std::all_of(s.begin(), s.end(), [](char c) { return c >= -1 && c < 255; });
    if (if_ascii)
#endif
    {
        // ltrim
        s.erase(s.begin(), find_if(s.begin(), s.end(), std::not_fn(::isspace)));
        // rtrim
        s.erase(find_if(s.rbegin(), s.rend(), std::not_fn(::isspace)).base(), s.end());
    }
}

std::vector<std::string> SplitString(const std::string& str, const std::string& pattern)
{
    std::vector<std::string> result;
    const std::regex re(pattern);
    std::sregex_token_iterator iter(str.begin(), str.end(), re, -1);
    for (std::sregex_token_iterator end; iter != end; ++iter)
    {
        result.push_back(iter->str());
    }
    return result;
}

namespace path {

#ifdef _WIN32
inline char separator()
{
    return '\\';
}
#else
inline char separator()
{
    return '/';
}
#endif


std::string Basename(const std::string& pathname)
{
    return std::string(
        std::find_if(pathname.rbegin(), pathname.rend(), [](char ch) { return ch == separator(); }).base(),
        pathname.end());
}

std::string Dirname(const std::string& pathname)
{
    return std::string(
        pathname.begin(),
        (std::find_if(pathname.rbegin(), pathname.rend(), [](char ch) { return ch == separator(); }) + 1).base());
}
} // namespace path

} // namespace vscode::opencl::utils