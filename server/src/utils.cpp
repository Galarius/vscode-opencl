//
//  utils.cpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/21/21.
//

#include "utils.hpp"
#include <filesystem.hpp>

#include <functional>
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
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) { return !std::isspace(ch); }));
    s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) { return !std::isspace(ch); }).base(), s.end());
}

std::vector<std::string> SplitString(const std::string& str, const std::string& pattern)
{
    std::vector<std::string> result;
    const std::regex re(pattern);
    std::sregex_token_iterator iter(str.begin(), str.end(), re, -1);
    for (std::sregex_token_iterator end; iter != end; ++iter)
        result.push_back(iter->str());
    return result;
}

namespace path {

std::string Basename(const std::string& pathname)
{
    return std::filesystem::path(pathname).filename().string();
}

std::string Dirname(const std::string& pathname)
{
    return std::filesystem::path(pathname).parent_path().string();
}
} // namespace path

} // namespace vscode::opencl::utils