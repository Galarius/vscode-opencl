//
//  lsp.cpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/16/21.
//

#include "lsp.hpp"
#include "utils.hpp"
#include "jsonrpc.hpp"
#include "diagnostics.hpp"

#include <glogger.hpp>

#include <queue>

using namespace boost;

namespace vscode::opencl {

constexpr char TracePrefix[] = "#lsp ";

struct Capabilities
{
    bool hasConfigurationCapability = false;
    bool supportDidChangeConfiguration = false;
};

class LSPServer
    : public ILSPServer
    , public std::enable_shared_from_this<LSPServer>
{
public:
    LSPServer() : m_diagnostics(CreateDiagnostics()) {}

    void Run();

private:
    void BuildDiagnosticsRespond(const std::string& uri, const std::string& content);
    void GetConfiguration();
    void OnInitialize(const json::object& data);
    void OnInitialized(const json::object& data);
    void OnTextOpen(const json::object& data);
    void OnTextChanged(const json::object& data);
    void OnConfiguration(const json::object& data);
    void OnRespond(const json::object& data);
    void OnShutdown(const json::object& data);
    void OnExit();

private:
    JsonRPC m_jrpc;
    std::shared_ptr<IDiagnostics> m_diagnostics;
    std::queue<json::object> m_outQueue;
    Capabilities m_capabilities;
    std::queue<std::pair<std::string, std::string>> m_requests;
    bool m_shutdown = false;
};

void LSPServer::GetConfiguration()
{
    if (!m_capabilities.hasConfigurationCapability)
    {
        GLogDebug(TracePrefix, "Does not have configuration capability");
        return;
    }
    GLogDebug(TracePrefix, "Make configuration request");
    json::object buildOptions({{"section", "OpenCL.server.buildOptions"}});
    json::object maxNumberOfProblems({{"section", "OpenCL.server.maxNumberOfProblems"}});
    const auto requestId = utils::GenerateId();
    m_requests.push(std::make_pair("workspace/configuration", requestId));
    // clang-format off
    m_outQueue.push(json::object(
        {
            {"id", requestId},
            {"method", "workspace/configuration"},
            {"params", {
                {"items", json::array({buildOptions, maxNumberOfProblems})}
            }}
        }
    ));
    // clang-format on
}


void LSPServer::OnInitialize(const json::object& data)
{
    GLogDebug(TracePrefix, "Received 'initialize' request");
    try
    {
        // clang-format off
        m_capabilities.hasConfigurationCapability = data.at("params").as_object()
                                                        .at("capabilities").as_object()
                                                        .at("workspace").as_object()
                                                        .at("configuration").as_bool();
        m_capabilities.supportDidChangeConfiguration = data.at("params").as_object()
                                                           .at("capabilities").as_object()
                                                           .at("workspace").as_object()
                                                           .at("didChangeConfiguration").as_object()
                                                           .at("dynamicRegistration").as_bool();
        auto buildOptions = data.at("params").as_object()
                                .at("initializationOptions").as_object()
                                .at("configuration").as_object()
                                .at("buildOptions").as_array();
        auto maxNumberOfProblems = data.at("params").as_object()
                                .at("initializationOptions").as_object()
                                .at("configuration").as_object()
                                .at("maxNumberOfProblems").as_int64();
        // clang-format on
        m_diagnostics->SetBuildOptions(buildOptions);
        m_diagnostics->SetMaxProblemsCount(static_cast<int>(maxNumberOfProblems));
    }
    catch (std::exception& err)
    {
        GLogError(TracePrefix, "Failed to parse initialize parameters: ", err.what());
    }

    // clang-format off
    json::object capabilities({
        {"textDocumentSync",
         {
             {"openClose", true},
             {"change", 1}, // TextDocumentSyncKind.Full
             {"willSave", false},
             {"willSaveWaitUntil", false},
             {"save", {{"includeText", false}}},
         }},
    });
    m_outQueue.push(json::object(
        {
            {"id", data.at("id")},
            {"result", {
                {"capabilities", capabilities}
                
            }}
        }
    ));
    // clang-format on
}

void LSPServer::OnInitialized(const json::object& data)
{
    GLogDebug(TracePrefix, "Received 'initialized' message");
    if (!m_capabilities.supportDidChangeConfiguration)
    {
        GLogDebug(TracePrefix, "Does not support didChangeConfiguration registration");
        return;
    }

    // clang-format off
    json::array registrations({{
        {"id", utils::GenerateId()},
        {"method", "workspace/didChangeConfiguration"},
    }});
    json::array params({{
        {"registrations", registrations},
    }});
    m_outQueue.push(json::object(
        {
            {"id", utils::GenerateId()},
            {"method", "client/registerCapability"},
            {"params", params}
        }
    ));
    // clang-format on
}

void LSPServer::BuildDiagnosticsRespond(const std::string& uri, const std::string& content)
{
    try
    {
        // clang-format off
        const auto filePath = utils::UriToPath(uri);
        GLogDebug("Converted uri '", uri, "' to path '", filePath, "'");
        
        json::array diags = m_diagnostics->Get({filePath, content});
        m_outQueue.push(json::object({
            {"method", "textDocument/publishDiagnostics"},
            {"params", {
            {"uri", uri},
            {"diagnostics", diags},
            }}
        }));
        // clang-format on
    }
    catch (std::exception& err)
    {
        auto msg = std::string("Failed to get diagnostics") + err.what();
        GLogError(TracePrefix, msg);
        m_jrpc.WriteError(JsonRPC::ErrorCode::InternalError, msg);
    }
}

void LSPServer::OnTextOpen(const json::object& data)
{
    GLogDebug(TracePrefix, "Received 'textOpen' message");
    // clang-format off
    std::string srcUri {
        data.at("params").as_object()
            .at("textDocument").as_object()
            .at("uri").as_string()
    };
    std::string content {
        data.at("params").as_object()
            .at("textDocument").as_object()
            .at("text").as_string()
    };
    // clang-format on
    BuildDiagnosticsRespond(srcUri, content);
}

void LSPServer::OnTextChanged(const json::object& data)
{
    GLogDebug(TracePrefix, "Received 'textChanged' message");
    // clang-format off
    std::string srcUri {
        data.at("params").as_object()
            .at("textDocument").as_object()
            .at("uri").as_string()
    };
    std::string content {
        data.at("params").as_object()
            .at("contentChanges").as_array()
            .at(0).as_object()
            .at("text").as_string()
    };
    // clang-format on
    BuildDiagnosticsRespond(srcUri, content);
}

void LSPServer::OnConfiguration(const json::object& data)
{
    GLogDebug(TracePrefix, "Received 'configuration' respond");
    auto result = data.at("result").as_array();
    if (result.empty())
    {
        GLogWarn(TracePrefix, "Empty result");
        return;
    }

    if (result.size() != 2)
    {
        GLogWarn(TracePrefix, "Unexpected result items count");
        return;
    }

    try
    {
        auto buildOptions = result.at(0).as_array();
        auto maxProblemsCount = result.at(1).as_int64();
        m_diagnostics->SetBuildOptions(buildOptions);
        m_diagnostics->SetMaxProblemsCount(static_cast<int>(maxProblemsCount));
    }
    catch (std::exception& err)
    {
        GLogError(TracePrefix, "Failed to update settings", err.what());
    }
}

void LSPServer::OnRespond(const json::object& data)
{
    GLogDebug(TracePrefix, "Received client respond");
    const auto id = data.at("id").as_string();
    if (!m_requests.empty())
    {
        auto request = m_requests.front();
        if (id == request.second && request.first == "workspace/configuration")
            OnConfiguration(data);
        m_requests.pop();
    }
}

void LSPServer::OnShutdown(const json::object& data)
{
    GLogDebug(TracePrefix, "Received 'shutdown' request");
    m_outQueue.push(json::object({{"id", data.at("id")}, {"result", nullptr}}));
    m_shutdown = true;
}

void LSPServer::OnExit()
{
    GLogDebug(TracePrefix, "Received 'exit', after 'shutdown': ", m_shutdown ? "yes" : "no");
    if (m_shutdown)
        exit(EXIT_SUCCESS);
    else
        exit(EXIT_FAILURE);
}

void LSPServer::Run()
{
    GLogInfo("Setting up...");
    auto self = this->shared_from_this();
    // clang-format off
    // Register handlers for methods
    m_jrpc.RegisterMethodCallback("initialize", [self](const json::object& request)
    {
        self->OnInitialize(request);
    });
    m_jrpc.RegisterMethodCallback("initialized", [self](const json::object& request)
    {
        self->OnInitialized(request);
    });
    m_jrpc.RegisterMethodCallback("shutdown", [self](const json::object& request)
    {
        self->OnShutdown(request);
    });
    m_jrpc.RegisterMethodCallback("exit", [self](const json::object&)
    {
        self->OnExit();
    });
    m_jrpc.RegisterMethodCallback("textDocument/didOpen", [self](const json::object& request)
    {
        self->OnTextOpen(request);
    });
    m_jrpc.RegisterMethodCallback("textDocument/didChange", [self](const json::object& request)
    {
        self->OnTextChanged(request);
    });
    m_jrpc.RegisterMethodCallback("workspace/didChangeConfiguration", [self](const json::object& request)
    {
        self->GetConfiguration();
    });
    // Register handler for client responds
    m_jrpc.RegisterInputCallback([self](const json::object& respond)
    {
        self->OnRespond(respond);
    });
    // Register handler for message delivery
    m_jrpc.RegisterOutputCallback([](const std::string& message)
    {
        #if defined(WIN32)
            printf_s("%s", message.c_str());
            fflush(stdout);
        #else
            std::cout << message << std::flush;
        #endif    
    });
    // clang-format off
    
    GLogInfo("Listening...");
    char c;
    while (std::cin.get(c))
    {
        m_jrpc.Consume(c);
        if (m_jrpc.IsReady())
        {
            m_jrpc.Reset();
            while (!m_outQueue.empty())
            {
                auto data = m_outQueue.front();
                m_jrpc.Write(data);
                m_outQueue.pop();
            }
        }
    }
//#endif
}

std::shared_ptr<ILSPServer> CreateLSPServer()
{
    return std::shared_ptr<ILSPServer>(new LSPServer());
}

} // namespace vscode::opencl
