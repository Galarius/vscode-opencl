//
//  main.cpp
//  opencl-language-server-tests
//
//  Created by is on 7/14/21.
//

#define CATCH_CONFIG_MAIN
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

}

TEST_CASE( "JSON-RPC TESTS", "<->" )
{

    //GLogger::instance().SetOutputMode(GLogger::Output::Console);
    //GLogger::instance().SetMinLevel(GLogger::Output::Console, GLogger::Level::Trace);

    SECTION( "Corrupted request handling" ) {
        std::string message = BuildRequest(R"!({"jsonrpc: 2.0", "id":0, [method]: "initialized"})!");
        JsonRPC jrpc;
        jrpc.RegisterOutputCallback([](const std::string& message) {
            auto response = boost::json::parse(ParseResponse(message)).as_object();
            REQUIRE(response["error"].as_object()["code"] == -32700);
        });
        Send(message, jrpc);
    }
    SECTION( "Method/initialize" ) {
        json::object obj ({
            {
                {"jsonrpc", "2.0"},
                {"id", 0},
                {"method", "initialize"},
                {"params", {
                    {"processId", 60650}
                }}
            }
        });
        std::string request = BuildRequest(obj);
        JsonRPC jrpc;
        jrpc.RegisterMethodCallback("initialize", [](const boost::json::object& request) {
           const auto& processId = request.at("params").as_object()
                                          .at("processId").as_int64();
           REQUIRE(processId == 60650);
        });
        jrpc.RegisterOutputCallback([](const std::string& message){
            REQUIRE(message.size() > 0);
        });
        Send(request, jrpc);
        REQUIRE(true);
    }
}

