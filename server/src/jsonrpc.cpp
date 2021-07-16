#include "jsonrpc.hpp"
#include <glogger.hpp>

namespace vscode::opencl {

void JsonRPC::RegisterMethodCallback(const std::string& method, InputCallbackFunc&& func)
{
    GLogTrace("Set callback for method: ", method);
    m_callbacks[method] = std::move(func);
}

void JsonRPC::RegisterInputCallback(InputCallbackFunc&& func)
{
    GLogTrace("Set callback for client responds");
    m_respondCallback = std::move(func);
}

void JsonRPC::RegisterOutputCallback(OutputCallbackFunc&& func)
{
    GLogTrace("Set output callback");
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
            GLogDebug("");
            GLogDebug(">>>>>>>>>>>>>>>>");
            for (auto& header : m_headers)
                GLogDebug(header.first, ": ", header.second);
            GLogDebug(m_buffer);
            GLogDebug(">>>>>>>>>>>>>>>>");
            GLogDebug("");

            m_body = boost::json::parse(m_buffer).as_object();
            auto method = m_body["method"];
            if (method.is_string())
            {
                m_method = method.as_string();
                if (m_method == "initialize")
                {
                    m_initialized = true;
                }
                else if (!m_initialized)
                {
                    GLogError("Unexpected first message: ", m_method);
                    WriteError(ErrorCode::NotInitialized, "Server was not initialized.");
                    return;
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
            GLogError("Failed to parse request with reason: ", e.what(), "\n", m_buffer);
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
                GLogError("Ivalid content length");
                WriteError(ErrorCode::InvalidRequest, "Invalid content length");
            }
        }
    }
}

bool JsonRPC::IsReady() const
{
    return !m_isProcessing;
}

void JsonRPC::Write(const boost::json::object& data) const
{
    assert(m_outputCallback);

    boost::json::object body = data;
    body.emplace("jsonrpc", "2.0");
    std::string content = boost::json::serialize(boost::json::value_from(body));
    std::string message;
    message.append("Content-Length: " + std::to_string(content.size()) + "\r\n");
    message.append("Content-Type: application/vscode-jsonrpc;charset=utf-8\r\n");
    message.append("\r\n");
    message.append(content);

    GLogDebug("");
    GLogDebug("<<<<<<<<<<<<<<<<");
    GLogDebug(message);
    GLogDebug("<<<<<<<<<<<<<<<<");
    GLogDebug("");

    m_outputCallback(message);
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
    assert(m_respondCallback);
    m_respondCallback(m_body);
}

void JsonRPC::FireMethodCallback()
{
    assert(m_outputCallback);
    auto callback = m_callbacks.find(m_method);
    if (callback == m_callbacks.end())
    {
        WriteError(ErrorCode::MethodNotFound, "Method '" + m_method + "' is not supported.");
    }
    else
    {
        callback->second(m_body);
    }
}

void JsonRPC::WriteError(JsonRPC::ErrorCode errorCode, const std::string& message) const
{
    boost::json::object obj(
        {{"error",
          {
              {"code", static_cast<int>(errorCode)},
              {"message", message},
          }}});
    Write(obj);
}

} // namespace vscode::opencl
