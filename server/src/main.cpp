//
//  main.cpp
//  opencl-language-server
//
//  Created by is on 7/14/21.
//

#include <iostream>

#include "lsp.hpp"

#define __glogger_implementation__ // define this only once
#include <glogger.hpp>
#include <boost/json/src.hpp>

using namespace vscode::opencl;

bool isArgOption(char** begin, char** end, const char* option);
char* getArgOption(char** begin, char** end, const char* option);

int main(int argc, char* argv[])
{
    const bool shouldLogTofile = isArgOption(argv, argv + argc, "--enable-file-tracing");
    char* filename = getArgOption(argv, argv + argc, "--filename");
    char* levelStr = getArgOption(argv, argv + argc, "--level");
    GLogger::Level level = GLogger::Level::None;
    if (levelStr)
        level = static_cast<GLogger::Level>(std::atoi(levelStr));

    if (shouldLogTofile)
    {
        GLogger::instance().SetOutputMode(GLogger::Output::File);
        GLogger::instance().SetLogFilename(filename ?: "opencl-language-server.log");
        GLogger::instance().SetMinLevel(GLogger::Output::File, level);
    }

    auto server = CreateLSPServer();
    server->Run();

    return 0;
}

bool isArgOption(char** begin, char** end, const char* option)
{
    const char* optr = 0;
    char* bptr = 0;

    for (; begin != end; ++begin)
    {
        optr = option;
        bptr = *begin;

        for (; *bptr == *optr; ++bptr, ++optr)
        {
            if (*bptr == '\0')
            {
                return true;
            }
        }
    }

    return false;
}

char* getArgOption(char** begin, char** end, const char* option)
{
    const char* optr = 0;
    char* bptr = 0;

    for (; begin != end; ++begin)
    {
        optr = option;
        bptr = *begin;

        for (; *bptr == *optr; ++bptr, ++optr)
        {
            if (*bptr == '\0')
            {
                if (bptr != *end && ++bptr != *end)
                {
                    return bptr;
                }
            }
        }
    }

    return 0;
}
