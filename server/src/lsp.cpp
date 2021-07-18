//
//  lsp.cpp
//  opencl-language-server
//
//  Created by is on 7/16/21.
//

#include "lsp.hpp"

#include "jsonrpc.hpp"
#include "diagnostics.hpp"

#include <queue>
#include <glogger.hpp>

#define ID_CONFIGURATION 71621

using namespace boost;

namespace vscode::opencl {

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
    std::queue<std::pair<std::string, json::object>> m_inQueue;
    bool m_configured = false;
};

#pragma mark -

void LSPServer::GetConfiguration()
{
    json::object item({{{"section", "opencl.server.build_options"}}});
    json::array items({item});
    m_outQueue.push(json::object(
        {{{"id", ID_CONFIGURATION}, {"method", "workspace/configuration"}, {"params", {{"items", items}}}}}));
}

void LSPServer::OnInitialize(const json::object& data)
{
    json::object textDocumentSync(
        {{"textDocumentSync",
          {
              {"openClose", true},
              {"change", 1}, // TextDocumentSyncKind.Full
              {"willSave", false},
              {"willSaveWaitUntil", false},
              {"save", {{"includeText", false}}},
          }}});
    m_outQueue.push(json::object({{{"id", data.at("id")}, {"result", {{"capabilities", textDocumentSync}}}}}));
}

void LSPServer::OnInitialized(const json::object& data)
{
    GetConfiguration();
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
    m_configured = true;

    while (!m_inQueue.empty())
    {
        auto [method, request] = m_inQueue.front();
        if (method == "textDocument/didOpen")
            OnTextOpen(request);
        else if (method == "textDocument/didChange")
            OnTextChanged(request);
        m_inQueue.pop();
    }
}

void LSPServer::OnTraceConfiguration(const json::object& data)
{
    auto traceValue = data.at("params").as_object().at("value").as_string();
    m_outQueue.push(json::object(
        {{"method", "$/logTrace"},
         {"params",
          {
              {"message", "Test Message"}
          }}}));
}

void LSPServer::Run()
{
    auto self = this->shared_from_this();
    m_jrpc.RegisterMethodCallback(
        "initialize", [self](const json::object& request) { self->OnInitialize(request); });

    m_jrpc.RegisterMethodCallback("initialized", [self](const json::object& request) {
        self->OnInitialized(request);
    });
    
    m_jrpc.RegisterMethodCallback("$/setTrace", [self](const json::object& request) {
        self->OnTraceConfiguration(request);
    });
    
    m_jrpc.RegisterMethodCallback(
        "textDocument/didOpen", [self](const json::object& request) {
            if (self->m_configured)
                self->OnTextOpen(request);
            else
                self->m_inQueue.push(std::make_pair("textDocument/didOpen", request));
        });

    m_jrpc.RegisterMethodCallback(
        "textDocument/didChange", [self](const json::object& request) {
            if (self->m_configured)
                self->OnTextChanged(request);
            else
                self->m_inQueue.push(std::make_pair("textDocument/didChange", request));
        });

    m_jrpc.RegisterInputCallback([self](const json::object& respond) {
        auto id = respond.at("id").as_int64();
        if (id == ID_CONFIGURATION)
            self->OnConfiguration(respond);
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
