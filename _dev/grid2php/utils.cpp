/**
 * @file utils.cpp
 * @date 22.06.17
 * @author galarius
 * @copyright Copyright © 2017 galarius. All rights reserved.
 */

#include "utils.hpp"

#include <locale>         // std::locale, std::toupper
#include <vector>

namespace ext
{
    namespace internal
    {
        char to_lower(char c)
        {
            static std::locale loc;

            if(std::isupper(c, loc))
                return std::tolower(c, loc);
            else
                return c;
        };
    }

    bool StartsWith(const std::string &s, const std::string &prefix, bool caseSensitive)
    {
        if(caseSensitive) 
        {
            return (s.size() >= prefix.size()) &&
               equal(prefix.begin(), prefix.end(), s.begin());
        }

        // case insensitive
        std::string prefix_lower_case;
        std::string s_lower_case;
        std::transform(prefix.begin(), prefix.end(), std::back_inserter(prefix_lower_case), internal::to_lower);
        std::transform(s.begin(), s.end(), std::back_inserter(s_lower_case), internal::to_lower);
        return (s_lower_case.size() >= prefix_lower_case.size()) &&
                equal(prefix_lower_case.begin(), prefix_lower_case.end(), s_lower_case.begin());
    }

    std::vector<std::string> Split(const std::string &text, std::string sep)
    {
        std::vector<std::string> tokens;
        std::size_t start = 0, end = 0;

        while((end = text.find(sep, start)) != std::string::npos) {
            tokens.push_back(text.substr(start, end - start));
            start = end + 1;
        }

        tokens.push_back(text.substr(start));
        return tokens;
    }
}