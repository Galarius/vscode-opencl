//
//  utils.cpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/21/21.
//

#include "utils.hpp"
#include <glogger.hpp>

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

// Limited file uri -> path converter
std::string UriToPath(const std::string& uri)
{
    try
    {
        std::string str = uri;
        auto pos = str.find("file://");
        if (pos != std::string::npos)
            str.replace(pos, 7, "");
        do
        {
            pos = str.find("%3A");
            if (pos != std::string::npos)
                str.replace(pos, 3, ":");
        } while (pos != std::string::npos);

        do
        {
            pos = str.find("%20");
            if (pos != std::string::npos)
                str.replace(pos, 3, " ");
        } while (pos != std::string::npos);

#if defined(WIN32)
        // remove first /
        if (str.rfind("/", 0) == 0)
        {
            str.replace(0, 1, "");
        }
#endif
        return str;
    }
    catch (std::exception& e)
    {
        GLogError("Failed to convert file uri to path: ", e.what());
    }
    return uri;
}

} // namespace vscode::opencl::utils