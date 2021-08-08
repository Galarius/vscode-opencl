/**
 * @file utils.hpp
 * @date 03.06.17
 * @author galarius
 * @copyright Copyright © 2017 galarius. All rights reserved.
 * @brief String helpers
 */

#ifndef utils_hpp
#define utils_hpp

#include <string>
#include <vector>

namespace ext
{
    /**
     Checks if string starts with provided prefix

     @param[in] str string to check
     @param[in] prefix prefix to test at the beginning of the str
     @return true if str starts with prefix
     */
    bool StartsWith(const std::string &s, const std::string &prefix, bool caseSensitive = false);

    /**
     Split text into tokens
     */
    std::vector<std::string> Split(const std::string &text, std::string sep);
}

#endif /* utils_hpp */