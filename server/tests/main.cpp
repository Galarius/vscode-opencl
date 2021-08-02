//
//  main.cpp
//  opencl-language-server-tests
//
//  Created by Ilya Shoshin (Galarius) on 7/16/21.
//

#include <catch2/catch.hpp>

#include "jsonrpc.hpp"
#define __glogger_implementation__    // define this only once
#include <glogger.hpp>
#include "diagnostics.hpp"
#include <boost/json/src.hpp>

using namespace vscode::opencl;
using namespace boost;

namespace {

std::string BuildRequest(const std::string& content)
{
    std::string request;
    request.append("Content-Length: " + std::to_string(content.size()) + "\r\n");
    request.append("Content-Type: application/vscode-jsonrpc;charset=utf-8\r\n");
    request.append("\r\n");
    request.append(content);
    return request;
}

std::string BuildRequest(const json::object& obj)
{
    return BuildRequest(json::serialize(json::value_from(obj)));
}

void Send(const std::string& request, JsonRPC& jrpc)
{
    for(auto c: request)
        jrpc.Consume(c);
}

std::string ParseResponse(std::string str)
{
    std::string delimiter = "\r\n";
    size_t pos = 0;
    while ((pos = str.find(delimiter)) != std::string::npos) {
        str.erase(0, pos + delimiter.length());
    }
    return str;
}

void EnableTracing()
{
     GLogger::instance().SetOutputMode(GLogger::Output::Console);
     GLogger::instance().SetMinLevel(GLogger::Output::Console, GLogger::Level::Trace);
}

}

TEST_CASE( "JSON-RPC TESTS", "<->" )
{
    // EnableTracing();
    
    SECTION( "Invalid request handling" ) {
        const std::string message = BuildRequest(R"!({"jsonrpc: 2.0", "id":0, [method]: "initialize"})!");
        JsonRPC jrpc;
        jrpc.RegisterOutputCallback([](const std::string& message) {
            auto response = boost::json::parse(ParseResponse(message)).as_object();
            const auto code = response["error"].as_object()["code"].as_int64(); 
            REQUIRE(code == static_cast<int64_t>(JsonRPC::ErrorCode::ParseError));
        });
        Send(message, jrpc);
    }
    
    SECTION( "Out of order request" ) {
        const std::string message = BuildRequest(json::object(
            {
                {"jsonrpc", "2.0"},
                {"id", 0},
                {"method", "textDocument/didOpen"},
                {"params", {}}
            }
        ));
        JsonRPC jrpc;
        jrpc.RegisterOutputCallback([](const std::string& message) {
            auto response = boost::json::parse(ParseResponse(message)).as_object();
            const auto code = response["error"].as_object()["code"].as_int64();
            REQUIRE(code == static_cast<int64_t>(JsonRPC::ErrorCode::NotInitialized));
        });
        Send(message, jrpc);
    }
    
    const std::string initRequest = BuildRequest(json::object(
        {
            {"jsonrpc", "2.0"},
            {"id", 0},
            {"method", "initialize"},
            {"params", {
                {"processId", 60650},
                {"trace", "off"}
            }}
        }
    ));
        
    SECTION( "Method/initialize" ) {
        JsonRPC jrpc;
        jrpc.RegisterOutputCallback([](const std::string&) {});
        jrpc.RegisterMethodCallback("initialize", [](const boost::json::object& request) {
           const auto& processId = request.at("params").as_object()
                                          .at("processId").as_int64();
           REQUIRE(processId == 60650);
        });
        Send(initRequest, jrpc);
    }
    
    const auto InitializeJsonRPC = [&initRequest](JsonRPC& jrpc) {
        jrpc.RegisterOutputCallback([](const std::string&) {});
        
        jrpc.RegisterMethodCallback("initialize", [](const boost::json::object& request) {});
        Send(initRequest, jrpc);
        jrpc.Reset();
    };
    
    SECTION( "Respond to unsupported method" ) {
        JsonRPC jrpc;
        InitializeJsonRPC(jrpc);
        // send unsupported request
        const std::string request = BuildRequest(json::object(
            {
                {"jsonrpc", "2.0"},
                {"id", 0},
                {"method", "textDocument/didOpen"},
                {"params", {}}
            }
        ));
        jrpc.RegisterOutputCallback([](const std::string& message) {
            auto response = boost::json::parse(ParseResponse(message)).as_object();
            const auto code = response["error"].as_object()["code"].as_int64();
            REQUIRE(code == static_cast<int64_t>(JsonRPC::ErrorCode::MethodNotFound));
        });
        Send(request, jrpc);
    }
}

