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

int main(int argc, const char* argv[])
{
    GLogger::instance().SetOutputMode(GLogger::Output::File);
    GLogger::instance().SetLogFilename("opencl-language-server.log");
    GLogger::instance().SetMinLevel(GLogger::Output::File, GLogger::Level::Trace);

    auto server = CreateLSPServer();
    server->Run();

    return 0;
}
