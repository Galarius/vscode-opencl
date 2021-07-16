#pragma once

#include <memory>
#include <string>
#include <boost/json.hpp>

namespace vscode::opencl {

struct Source
{
    std::string uri;
    std::string text;
};

struct IDiagnostics
{
    virtual void SetBuildOptions(const boost::json::array& options) = 0;
    virtual boost::json::array Get(const Source& source) = 0;
};

std::shared_ptr<IDiagnostics> CreateDiagnostics();

} // namespace vscode::opencl
