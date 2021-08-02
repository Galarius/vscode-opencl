//
//  utils.hpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/21/21.
//

#pragma once

#include <string>
#include <vector>

namespace vscode::opencl::utils {

std::string GenerateId();
void Trim(std::string& s);
std::vector<std::string> SplitString(const std::string& str, const std::string& pattern);
std::string UriToPath(const std::string& uri);

} // namespace vscode::opencl::utils