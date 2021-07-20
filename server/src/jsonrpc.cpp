//
//  jsonrpc.cpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/16/21.
//

#include "jsonrpc.hpp"
#include <glogger.hpp>

using namespace boost;

namespace vscode::opencl {

constexpr char TracePrefix[] = "#jrpc ";

void JsonRPC::RegisterMethodCallback(const std::string& method, InputCallbackFunc&& func)
{
    GLogTrace(TracePrefix, "Set callback for method: ", method);
    m_callbacks[method] = std::move(func);
}

void JsonRPC::RegisterInputCallback(InputCallbackFunc&& func)
{
    GLogTrace(TracePrefix, "Set callback for client responds");
    m_respondCallback = std::move(func);
}

void JsonRPC::RegisterOutputCallback(OutputCallbackFunc&& func)
{
    GLogTrace(TracePrefix, "Set output callback");
    m_outputCallback = std::move(func);
}

void JsonRPC::Consume(char c)
{
    m_buffer += c;
    if (m_validHeader)
    {
        if (m_buffer.length() != m_contentLength)
            return;
        try
        {
            GLogDebug(TracePrefix);
            GLogDebug(TracePrefix, ">>>>>>>>>>>>>>>>");
            for (auto& header : m_headers)
                GLogDebug(header.first, ": ", header.second);
            GLogDebug(m_buffer);
            GLogDebug(TracePrefix, ">>>>>>>>>>>>>>>>");
            GLogDebug(TracePrefix);

            m_body = json::parse(m_buffer).as_object();
            const auto method = m_body["method"];
            if (method.is_string())
            {
                m_method = method.as_string();
                if (m_method == "initialize")
                {
                    OnInitialize();
                }
                else if (!m_initialized)
                {
                    GLogError(TracePrefix, "Unexpected first message: ", m_method);
                    WriteError(ErrorCode::NotInitialized, "Server was not initialized.");
                    return;
                }
                else if (m_method == "$/setTrace")
                {
                    OnTracingChanged(m_body);
                }
                FireMethodCallback();
            }
            else
            {
                FireRespondCallback();
            }
            m_isProcessing = false;
        }
        catch (std::exception& e)
        {
            GLogError(TracePrefix, "Failed to parse request with reason: ", e.what(), "\n", m_buffer);
            m_buffer.clear();
            WriteError(ErrorCode::ParseError, "Failed to parse request");
            return;
        }
    }
    else
    {
        if (ReadHeader())
            m_buffer.clear();

        if (m_buffer == "\r\n")
        {
            m_buffer.clear();
            m_validHeader = m_contentLength > 0;
            if (m_validHeader)
            {
                m_buffer.reserve(m_contentLength);
            }
            else
            {
                WriteError(ErrorCode::InvalidRequest, "Invalid content length");
            }
        }
    }
}

bool JsonRPC::IsReady() const
{
    return !m_isProcessing;
}

void JsonRPC::Write(const json::object& data) const
{
    assert(m_outputCallback);

    std::string message;
    try
    {
        json::object body = data;
        body.emplace("jsonrpc", "2.0");
        std::string content = json::serialize(json::value_from(body));
        message.append("Content-Length: " + std::to_string(content.size()) + "\r\n");
        message.append("Content-Type: application/vscode-jsonrpc;charset=utf-8\r\n");
        message.append("\r\n");
        message.append(content);

        GLogDebug(TracePrefix);
        GLogDebug(TracePrefix, "<<<<<<<<<<<<<<<<");
        GLogDebug(message);
        GLogDebug(TracePrefix, "<<<<<<<<<<<<<<<<");
        GLogDebug(TracePrefix);

        m_outputCallback(message);
    }
    catch (std::exception& err)
    {
        GLogError(TracePrefix, "Failed to write message: ", message, ", error: ", err.what());
    }
}

void JsonRPC::Reset()
{
    m_method = std::string();
    m_buffer.clear();
    m_body.clear();
    m_headers.clear();
    m_validHeader = false;
    m_contentLength = 0;
    m_isProcessing = true;
}

void JsonRPC::LogTrace(const std::string& message, const std::string& verbose)
{
    if (!m_tracing)
    {
        GLogDebug(TracePrefix, "JRPC tracing is disabled");
        GLogTrace(TracePrefix, "The message was: ", message, ", verbose: ", verbose);
        return;
    }

    if (!verbose.empty() && !m_verbosity)
    {
        GLogDebug(TracePrefix, "JRPC verbose tracing is disabled");
        GLogTrace(TracePrefix, "The verbose message was: ", verbose);
        return;
    }

    Write(json::object(
        {{"method", "$/logTrace"}, {"params", {{"message", message}, {"verbose", m_verbosity ? verbose : ""}}}}));
}

void JsonRPC::OnInitialize()
{
    try
    {
        const auto traceValue = m_body["params"].as_object().at("trace").as_string();
        m_tracing = traceValue != "off";
        m_verbosity = traceValue == "verbose";
        m_initialized = true;
        GLogDebug(
            TracePrefix,
            "Tracing options: is verbose",
            m_verbosity ? "yes" : "no",
            ", is on: ",
            m_tracing ? "yes" : "no");
    }
    catch (std::exception& err)
    {
        GLogError(TracePrefix, "Failed to read tracing options", err.what());
    }
}

void JsonRPC::OnTracingChanged(const json::object& data)
{
    try
    {
        const auto traceValue = data.at("params").as_object().at("value").as_string();
        m_tracing = traceValue != "off";
        m_verbosity = traceValue == "verbose";
        GLogDebug(
            TracePrefix,
            "Tracing options were changed: is verbose",
            m_verbosity ? "yes" : "no",
            ", is on: ",
            m_tracing ? "yes" : "no");
    }
    catch (std::exception& err)
    {
        GLogError(TracePrefix, "Failed to read tracing options", err.what());
    }
}

bool JsonRPC::ReadHeader()
{
    std::sregex_iterator next(m_buffer.begin(), m_buffer.end(), m_headerRegex);
    std::sregex_iterator end;
    const bool found = std::distance(next, end) > 0;
    while (next != end)
    {
        std::smatch match = *next;
        std::string key = match.str(1);
        std::string value = match.str(2);
        if (key == "Content-Length")
            m_contentLength = std::stoi(value);
        m_headers[key] = value;
        ++next;
    }
    return found;
}

void JsonRPC::FireRespondCallback()
{
    if (m_respondCallback)
    {
        GLogDebug(TracePrefix, "Calling handler for a client respond");
        m_respondCallback(m_body);
    }
}

void JsonRPC::FireMethodCallback()
{
    assert(m_outputCallback);
    auto callback = m_callbacks.find(m_method);
    if (callback == m_callbacks.end())
    {
        const bool isRequest = m_body["params"].as_object()["id"] != nullptr;
        const bool mustRespond = isRequest || m_method.rfind("$/", 0) == json::string::npos;
        GLogDebug(
            TracePrefix,
            "Got request: ",
            isRequest ? "yes" : "no",
            ", respond is required: ",
            mustRespond ? "yes" : "no");
        if (mustRespond)
        {
            WriteError(ErrorCode::MethodNotFound, "Method '" + m_method + "' is not supported.");
        }
    }
    else
    {
        try
        {
            GLogDebug(TracePrefix, "Calling handler for method: ", m_method);
            callback->second(m_body);
        }
        catch (std::exception& err)
        {
            GLogError(TracePrefix, "Failed to handle method '", m_method, "'");
        }
    }
}

void JsonRPC::WriteError(JsonRPC::ErrorCode errorCode, const std::string& message) const
{
    GLogTrace(TracePrefix, "Reporting error: ", message, " (", errorCode, ")");
    json::object obj(
        {{"error",
          {
              {"code", static_cast<int>(errorCode)},
              {"message", message},
          }}});
    Write(obj);
}

} // namespace vscode::opencl
