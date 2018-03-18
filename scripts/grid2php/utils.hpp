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
#include <sstream>
#include <regex>

namespace ext
{
    /**
     Checks if string starts with provided prefix

     @param[in] str string to check
     @param[in] prefix prefix to test at the beginning of the str
     @return true if str starts with prefix
     */
    bool starts_with(const std::string &s, const std::string &prefix, bool case_sensitive = false);

    /**
     Split text into tokens

     @param text text to split
     @param sep separator
     @return tokens
     */
    std::vector<std::string> split(const std::string &text, std::string sep);
}

#endif /* utils_hpp */