//
//  utils.hpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/20/21.
//

#pragma once

#include <sstream>
#include <random>
#include <string>

namespace vscode::opencl::utils {

std::string GenerateId()
{
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 255);
    std::string identifier;
    std::stringstream hex;
    for (auto i = 0; i < 16; ++i) {
        const auto rc = dis(gen);
        hex << std::hex << rc;
        auto str = hex.str();
        identifier.append(str.length() < 2 ? '0' + str : str);
        hex.str(std::string());
    }
    return identifier;
}

}
