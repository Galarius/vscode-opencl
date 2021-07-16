//
//  lsp.h
//  opencl-language-server
//
//  Created by is on 7/16/21.
//

#pragma once

#include <memory>

namespace vscode::opencl {

struct ILSPServer
{
    virtual void Run() = 0;
};

std::shared_ptr<ILSPServer> CreateLSPServer();

} // namespace vscode::opencl
