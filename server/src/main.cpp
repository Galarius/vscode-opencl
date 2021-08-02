//
//  main.cpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/14/21.
//

#include <iostream>

#include "lsp.hpp"

#define __glogger_implementation__ // define this only once
#include <glogger.hpp>

#pragma warning(push, 0)
#include <boost/json/src.hpp>
#pragma warning(pop)

#ifndef VERSION
#error version is required
#endif

#if defined(WIN32)    
#include <stdio.h>
#include <fcntl.h>
#include <io.h>
#endif

using namespace vscode::opencl;

bool isArgOption(char** begin, char** end, const char* option);
char* getArgOption(char** begin, char** end, const char* option);

int main(int argc, char* argv[])
{
    if(isArgOption(argv, argv + argc, "--version"))
    {
        std::cout << VERSION << std::endl;
        exit(0);
    }
    
    const bool shouldLogTofile = isArgOption(argv, argv + argc, "--enable-file-tracing");
    char* filename = getArgOption(argv, argv + argc, "--filename");
    char* levelStr = getArgOption(argv, argv + argc, "--level");
    GLogger::Level level = GLogger::Level::None;
    if (levelStr)
        level = static_cast<GLogger::Level>(std::atoi(levelStr));

    if (shouldLogTofile)
    {
        GLogger::instance().SetOutputMode(GLogger::Output::File);
        GLogger::instance().SetLogFilename(filename ? filename : "opencl-language-server.log");
        GLogger::instance().SetMinLevel(GLogger::Output::File, level);
    }

    
#if defined(WIN32)
    // to handle CRLF
    if (_setmode(_fileno(stdin), _O_BINARY) == -1)
        GLogError("Cannot set stdin mode to _O_BINARY");
    if (_setmode(_fileno(stdout), _O_BINARY) == -1)
        GLogError("Cannot set stdout mode to _O_BINARY");
#endif

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
