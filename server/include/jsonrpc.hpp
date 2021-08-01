//
//  jsonrpc.hpp
//  opencl-language-server
//
//  Created by Ilya Shoshin (Galarius) on 7/16/21.
//

#pragma once

#include <regex>
#include <iostream>
#include <optional>
#include <functional>
#include <unordered_map>

#pragma warning(push, 0)
#include <boost/json.hpp>
#pragma warning(pop)

namespace vscode::opencl {

class JsonRPC
{
    using InputCallbackFunc = std::function<void(const boost::json::object&)>;
    using OutputCallbackFunc = std::function<void(const std::string&)>;

public:
    enum class ErrorCode : int
    {
        ///@{
        ParseError = -32700,     ///< Parse error    Invalid JSON was received by the server. An error occurred on the
                                 ///< server while parsing the JSON text.
        InvalidRequest = -32600, ///< Invalid Request    The JSON sent is not a valid Request object.
        MethodNotFound = -32601, ///< Method not found    The method does not exist / is not available.
        InvalidParams = -32602,  ///< Invalid params    Invalid method parameter(s).
        InternalError =
            -32603, ///< Internal error    Internal JSON-RPC error.
                    // -32000 to -32099    Server error    Reserved for implementation-defined server-errors.
        NotInitialized = -32002 ///< The first client's message is not equal to "initialize"
                                ///@}
    };

    friend std::ostream& operator<<(std::ostream& out, ErrorCode const& code)
    {
        out << static_cast<int64_t>(code);
        return out;
    }

    /**
     Register callback to be notified on the specific method notification.
     All unregistered notifications will be responded with MethodNotFound automatically.
     */
    void RegisterMethodCallback(const std::string& method, InputCallbackFunc&& func);
    /**
     Register callback to be notified on client responds to server (our) requests.
     */
    void RegisterInputCallback(InputCallbackFunc&& func);
    /**
     Register callback to be notified when server is going to send the final message to the client.
     Basically it should be redirected to the stdout.
     */
    void RegisterOutputCallback(OutputCallbackFunc&& func);

    void Consume(char c);
    bool IsReady() const;
    void Write(const boost::json::object& data) const;
    void Reset();
    /**
     Send trace message to client.
     */
    void LogTrace(const std::string& message, const std::string& verbose = "");
    void WriteError(JsonRPC::ErrorCode errorCode, const std::string& message) const;
private:
    void OnInitialize();
    void OnTracingChanged(const boost::json::object& data);
    bool ReadHeader();
    void FireMethodCallback();
    void FireRespondCallback();

private:
    std::string m_method;
    std::string m_buffer;
    boost::json::object m_body;
    std::unordered_map<std::string, std::string> m_headers;
    std::unordered_map<std::string, InputCallbackFunc> m_callbacks;
    OutputCallbackFunc m_outputCallback;
    InputCallbackFunc m_respondCallback;
    bool m_isProcessing = true;
    bool m_initialized = false;
    bool m_validHeader = false;
    bool m_tracing = false;
    bool m_verbosity = false;
    long long m_contentLength = 0;
    std::regex m_headerRegex {"([\\w-]+): (.+)\\r\\n(?:([^:]+)\\r\\n)?"};
};

} // namespace vscode::opencl
