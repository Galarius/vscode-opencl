/*!
  \file
  \author Ilya Shoshin (Galarius)
*/

#include "diagnostics.hpp"

#include <iostream>
#include <stdexcept> // std::runtime_error, std::invalid_argument
#include <regex>
#include <filesystem>
#include <glogger.hpp>

#define __CL_ENABLE_EXCEPTIONS
#if defined(__APPLE__) || defined(__MACOSX)
    #include "opencl/cl.hpp"
#else
    #include <CL/cl.hpp>
#endif


using namespace boost;

namespace {

constexpr char TracePrefix[] = "#diagnostics ";

std::vector<std::string> SplitString(const std::string& str, const std::string& pattern)
{
    std::vector<std::string> result;
    const std::regex re(pattern);
    std::sregex_token_iterator iter(str.begin(), str.end(), re, -1);
    for (std::sregex_token_iterator end; iter != end; ++iter)
    {
        result.push_back(iter->str());
    }
    return result;
}

int ParseSeverity(const std::string& severity)
{
    if (severity == "error")
        return 1;
    else if (severity == "warning")
        return 2;
    else
        return -1;
}

// <program source>:13:5: warning: no previous prototype for function 'getChannel'
std::tuple<std::string, long, long, long, std::string> ParseOutput(const std::smatch& matches)
{
    std::string source = matches[1];
    const long line = std::stoi(matches[2]) - 1; // LSP assumes 0-indexed lines
    const long col = std::stoi(matches[3]);
    const int severity = ParseSeverity(matches[4]);
    // matches[5] - 'fatal'
    std::string message = matches[6];
    return std::make_tuple(std::move(source), line, col, severity, std::move(message));
}

struct OpenCLDevice
{
    size_t maxComputeUnits = 0;
    size_t maxClockFrequency = 0;
    std::string devName;
    std::string devVer;
    std::string drvVer;
};

} // namespace

namespace vscode::opencl {

class Diagnostics : public IDiagnostics
{
public:
    Diagnostics();
    boost::json::array Get(const Source& source);
    void SetBuildOptions(const boost::json::array& options);

private:
    boost::json::array BuildDiagnostics(const std::string& buildLog, const std::string& name);
    std::string BuildSource(const std::string& source, const std::string& dir) const;

private:
    bool m_isInitialized = false;
    cl::Device m_device;
    std::regex m_regex {"^(.*):(\\d+):(\\d+): ((fatal )?error|warning|Scholar): (.*)$"};
    std::string m_BuildOptions;
};

Diagnostics::Diagnostics()
{
    GLogTrace(TracePrefix, "Selecting OpenCL platform...");
    std::vector<cl::Platform> platforms;
    try
    {
        cl::Platform::get(&platforms);
    }
    catch (cl::Error& err)
    {
        GLogError(TracePrefix, "No OpenCL platforms were found", err.what(), " (", err.err(), ")");
    }

    cl::Platform platform = platforms.front();
    std::vector<cl::Device> devices;

    try
    {
        platform.getDevices(CL_DEVICE_TYPE_ALL, &devices);
    }
    catch (cl::Error& err)
    {
        GLogError(TracePrefix, "No OpenCL devices were found", err.what(), " (", err.err(), ")");
    }

    size_t powerIndex = 0, maxPowerIndex = 0;
    GLogTrace(TracePrefix, "Selecting OpenCL device (total:", devices.size(), ")...");
    std::vector<OpenCLDevice> devsData;
    devsData.reserve(devices.size());
    for (auto& device : devices)
    {
        OpenCLDevice data;
        try
        {
            device.getInfo(CL_DEVICE_MAX_COMPUTE_UNITS, &data.maxComputeUnits);
            device.getInfo(CL_DEVICE_MAX_CLOCK_FREQUENCY, &data.maxClockFrequency);
            device.getInfo(CL_DEVICE_NAME, &data.devName);
            device.getInfo(CL_DEVICE_VERSION, &data.devVer);
            device.getInfo(CL_DRIVER_VERSION, &data.drvVer);
            powerIndex = data.maxComputeUnits * data.maxClockFrequency;
            devsData.push_back(data);
        }
        catch (cl::Error& err)
        {
            GLogWarn(TracePrefix, "Failed to get info for a device", err.what(), " (", err.err(), ")");
            continue;
        }

        GLogDebug(
            TracePrefix,
            "Found device:\n",
            "Device name:",
            data.devName,
            "\n",
            "OpenCL version:",
            data.devVer,
            "\n",
            "Driver version:",
            data.drvVer,
            "\n",
            "Max compute units:",
            data.maxComputeUnits,
            "\n",
            "Max clock frequency:",
            data.maxClockFrequency,
            "\n");
        if (powerIndex > maxPowerIndex)
        {
            maxPowerIndex = powerIndex;
            m_device = device;
            GLogDebug(TracePrefix, "Selected OpenCL device: ", data.devName);
        }
    }
    m_isInitialized = true;
}

std::string Diagnostics::BuildSource(const std::string& source, const std::string& dir) const
{
    std::vector<cl::Device> ds {m_device};
    cl::Context context(ds, NULL, NULL, NULL);
    cl::Program program;
    std::string options = m_BuildOptions;
    if (!dir.empty())
        options += "-I " + dir;
    try
    {
        GLogDebug(TracePrefix, "Building program with otions: ", options);
        program = cl::Program(context, source, false);
        program.build(ds, options.c_str());
    }
    catch (cl::Error& err)
    {
        if (err.err() != CL_BUILD_PROGRAM_FAILURE)
        {
            GLogError(TracePrefix, "Failed to build program, error: ", err.what(), " (", err.err(), ")");
        }
    }

    std::string build_log;

    try
    {
        program.getBuildInfo(m_device, CL_PROGRAM_BUILD_LOG, &build_log);
    }
    catch (cl::Error& err)
    {
        GLogError(TracePrefix, "Failed get build info, error: ", err.what(), " (", err.err(), ")");
    }

    return build_log;
}

boost::json::array Diagnostics::BuildDiagnostics(const std::string& buildLog, const std::string& name)
{
    std::smatch matches;
    auto errorLines = SplitString(buildLog, "\n");
    json::array diagnostics;
    for (auto errLine : errorLines)
    {
        std::regex_search(errLine, matches, m_regex);
        if (matches.size() != 7)
            continue;

        auto [source, line, col, severity, message] = ParseOutput(matches);
        json::object diagnostic;
        json::object range {
            {"start",
             {
                 {"line", line},
                 {"character", col},
             }},
            {"end",
             {
                 {"line", line},
                 {"character", col},
             }},
        };
        diagnostic["source"] = name.empty() ? source : name;
        diagnostic["range"] = range;
        diagnostic["severity"] = severity;
        diagnostic["message"] = message;
        diagnostics.emplace_back(diagnostic);
    }
    return diagnostics;
}

boost::json::array Diagnostics::Get(const Source& source)
{
    if (!m_isInitialized)
        throw std::runtime_error("Failed to init OpenCL");

    std::string buildLog;
    std::string srcName;
    std::string kernelDir;

    if (!source.uri.empty())
    {
        srcName = std::filesystem::path(source.uri).filename();
        kernelDir = std::filesystem::path(source.uri).parent_path();
        const auto pos = kernelDir.find("file://");
        if (pos != std::string::npos)
            kernelDir.replace(pos, 7, "");
    }

    if (source.text.empty())
    {
        if (source.uri.empty())
            return json::array();

        std::ifstream srcFile(source.uri);
        if (srcFile.fail())
            GLogError("Failed to open file: ", source.uri);
        std::string text = std::string((std::istreambuf_iterator<char>(srcFile)), std::istreambuf_iterator<char>());
        srcFile.close();
        buildLog = BuildSource(text, kernelDir);
    }
    else
    {
        buildLog = BuildSource(source.text, kernelDir);
    }

    GLogTrace(TracePrefix, "BuildLog:\n", buildLog);

    return BuildDiagnostics(buildLog, srcName);
}

void Diagnostics::SetBuildOptions(const json::array& options)
{
    try
    {
        std::string args;
        for (auto option : options)
        {
            args.append(option.as_string());
            args.append(" ");
        }
        m_BuildOptions = std::move(args);
        GLogTrace(TracePrefix, "Set build options: ", m_BuildOptions);
    }
    catch (std::exception& e)
    {
        GLogError(TracePrefix, "Failed to parse build options, error", e.what());
    }
}

std::shared_ptr<IDiagnostics> CreateDiagnostics()
{
    return std::shared_ptr<IDiagnostics>(new Diagnostics());
}

} // namespace vscode::opencl
