//
//  lsp.cpp
//  opencl-language-server
//
//  Created by is on 7/16/21.
//

#include "lsp.hpp"

#include "jsonrpc.hpp"
#include "diagnostics.hpp"

#include <glogger.hpp>

#include <queue>
#include <sstream>
#include <random>
#include <string>

using namespace boost;

namespace {

std::string GenerateId() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 255);
    std::string identifier;
    std::stringstream hex;
    for (auto i = 0; i < 16; ++i) {
        const auto rc = dis(gen);
        hex << std::hex << rc;
        auto str = hex.str();
        identifier.append(str.length() < 2 ? '0' + str : str);
        hex.str(std::string());
    }
    return identifier;
}

}

namespace vscode::opencl {

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
    void GetConfiguration();
    void OnInitialize(const json::object& data);
    void OnInitialized(const json::object& data);
    void OnTextOpen(const json::object& data);
    void OnTextChanged(const json::object& data);
    void OnConfiguration(const json::object& data);
    void OnTraceConfiguration(const json::object& data);

private:
    JsonRPC m_jrpc;
    std::shared_ptr<IDiagnostics> m_diagnostics;
    std::queue<json::object> m_outQueue;
    Capabilities m_capabilities;
    std::queue<std::pair<std::string, std::string>> m_requests;
};

#pragma mark -

void LSPServer::GetConfiguration()
{
    if(!m_capabilities.hasConfigurationCapability)
        return;

    json::object item({
        {
            {"section", "OpenCL.server.buildOptions"}
        }
    });
    const auto requestId = GenerateId();
    m_requests.push(std::make_pair("workspace/configuration", requestId));
    m_outQueue.push(json::object({
        {
            {"id", requestId},
            {"method", "workspace/configuration"},
            {"params", {
                {"items", json::array({item})}
            }}
        }
    }));
}


void LSPServer::OnInitialize(const json::object& data)
{
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
                            .at("build_options").as_array();
    m_diagnostics->SetBuildOptions(buildOptions);
    
    json::object capabilities({
        {"textDocumentSync", {
              {"openClose", true},
              {"change", 1}, // TextDocumentSyncKind.Full
              {"willSave", false},
              {"willSaveWaitUntil", false},
              {"save", {{"includeText", false}}},
        }},
    });
    m_outQueue.push(json::object({{{"id", data.at("id")}, {"result", {{"capabilities", capabilities}}}}}));
}

void LSPServer::OnInitialized(const json::object& data)
{
    if(!m_capabilities.supportDidChangeConfiguration)
        return;
    json::array registrations({
        {
            {"id", GenerateId()},
            {"method", "workspace/didChangeConfiguration"},
        }
    });
    json::array params ({
        {
            {"registrations", registrations},
        }
    });
    m_outQueue.push(json::object({
        {
            {"id", GenerateId()},
            {"method", "client/registerCapability"},
            {"params", params}
        }
    }));
}

void LSPServer::OnTextOpen(const json::object& data)
{
    auto uri = data.at("params").as_object().at("textDocument").as_object().at("uri").as_string();
    auto text = data.at("params").as_object().at("textDocument").as_object().at("text").as_string();
    std::string srcUri {uri};
    std::string content {text};
    json::array diags = m_diagnostics->Get({std::move(srcUri), std::move(content)});
    m_outQueue.push(json::object(
        {{"method", "textDocument/publishDiagnostics"},
         {"params",
          {
              {"uri", uri},
              {"diagnostics", diags},
          }}}));
}

void LSPServer::OnTextChanged(const json::object& data)
{
    auto uri = data.at("params").as_object().at("textDocument").as_object().at("uri").as_string();
    auto text = data.at("params").as_object().at("contentChanges").as_array().at(0).as_object().at("text").as_string();

    std::string srcUri {uri};
    std::string content {text};
    json::array diags = m_diagnostics->Get({std::move(srcUri), std::move(content)});
    m_outQueue.push(json::object(
        {{"method", "textDocument/publishDiagnostics"},
         {"params",
          {
              {"uri", uri},
              {"diagnostics", diags},
          }}}));
}

void LSPServer::OnConfiguration(const json::object& data)
{
    auto result = data.at("result").as_array().front();
    auto items = result.as_array();
    m_diagnostics->SetBuildOptions(items);
}

void LSPServer::Run()
{
    auto self = this->shared_from_this();
    m_jrpc.RegisterMethodCallback(
        "initialize", [self](const json::object& request) { self->OnInitialize(request); });

    m_jrpc.RegisterMethodCallback("initialized", [self](const json::object& request) {
        self->OnInitialized(request);
    });
        
    m_jrpc.RegisterMethodCallback(
        "textDocument/didOpen", [self](const json::object& request) {
            self->OnTextOpen(request);
        });

    m_jrpc.RegisterMethodCallback(
        "textDocument/didChange", [self](const json::object& request) {
            self->OnTextChanged(request);
        });
    
    m_jrpc.RegisterInputCallback([self](const json::object& respond) {
        const auto id = respond.at("id").as_string();
        if(!self->m_requests.empty())
        {
            auto request = self->m_requests.front();
            if (id == request.second && request.first == "workspace/configuration")
                self->OnConfiguration(respond);
            self->m_requests.pop();
        }
    });

    m_jrpc.RegisterMethodCallback("workspace/didChangeConfiguration", [self](const json::object& request) {
        self->GetConfiguration();
    });

    m_jrpc.RegisterOutputCallback([](const std::string& message) { std::cout << message << std::flush; });

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
}

std::shared_ptr<ILSPServer> CreateLSPServer()
{
    return std::shared_ptr<ILSPServer>(new LSPServer());
}

} // namespace vscode::opencl
