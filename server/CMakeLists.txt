cmake_minimum_required (VERSION 3.1)

project(opencl-language-server)

find_package(OpenCL REQUIRED)
message(STATUS "OpenCL found: ${OpenCL_FOUND}")
message(STATUS "OpenCL includes: ${OpenCL_INCLUDE_DIRS}")
message(STATUS "OpenCL CXX includes: ${OpenCL_HAS_CPP_BINDINGS}")
message(STATUS "OpenCL libraries: ${OpenCL_LIBRARIES}")

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(APPLE)
    set(CMAKE_OSX_DEPLOYMENT_TARGET "10.13")
    set(CXX_WARNINGS_AS_ERRORS "-Werror=return-type -Werror=exceptions -Werror=static-inline-explicit-instantiation -Werror=macro-redefined -Werror=return-stack-address -Werror=nonportable-include-path")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${CXX_WARNINGS_AS_ERRORS}")
elseif(WIN32)
     # Replace dynamic MSVCRT linker flags with static version.
    foreach(flag_var
        CMAKE_CXX_FLAGS CMAKE_CXX_FLAGS_DEBUG CMAKE_CXX_FLAGS_RELEASE
        CMAKE_CXX_FLAGS_MINSIZEREL CMAKE_CXX_FLAGS_RELWITHDEBINFO)
      if(${flag_var} MATCHES "/MD")
        string(REGEX REPLACE "/MD" "/MT" ${flag_var} "${${flag_var}}")
      endif(${flag_var} MATCHES "/MD")
    endforeach(flag_var)
else()
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -static-libstdc++ -static-libgcc -fpie -Wl,-pie -fasynchronous-unwind-tables -fstack-clash-protection -fstack-protector-strong -pipe -O3 -DNDEBUG")
endif()

message("CMake Generator:" ${CMAKE_GENERATOR})
message("C++ Flags:" ${CMAKE_CXX_FLAGS})
message("List of compile features: ${CMAKE_CXX_COMPILE_FEATURES}")

file(GLOB HEADERS "${PROJECT_SOURCE_DIR}/include/*.hpp")
file(GLOB SOURCES "${PROJECT_SOURCE_DIR}/src/*.cpp")
source_group("headers" FILES ${HEADERS})
source_group("sources" FILES ${SOURCES})

add_executable (${PROJECT_NAME} ${SOURCES} ${HEADERS})

target_compile_definitions(${PROJECT_NAME} PRIVATE 
    BOOST_JSON_STANDALONE
    CL_SILENCE_DEPRECATION
    VERSION="0.1"
)

target_include_directories(${PROJECT_NAME}
     PRIVATE ${OpenCL_INCLUDE_DIRS}
     PRIVATE ${PROJECT_SOURCE_DIR}/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/logger/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/opencl/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/json/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/filesystem/include
)

set_target_properties(${PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/bin)

set(LIBS ${OpenCL_LIBRARIES})
if(UNIX)
    set(LIBS ${LIBS} stdc++fs)
endif(UNIX)

target_link_libraries (${PROJECT_NAME} ${LIBS})

########### TESTS ############

set(TESTS_PROJECT_NAME "opencl-language-server-tests")

add_executable (${TESTS_PROJECT_NAME} 
    "${PROJECT_SOURCE_DIR}/include/jsonrpc.hpp"
    "${PROJECT_SOURCE_DIR}/src/jsonrpc.cpp"
    "${PROJECT_SOURCE_DIR}/tests/main.cpp")

target_include_directories(${TESTS_PROJECT_NAME}
     PRIVATE ${PROJECT_SOURCE_DIR}/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/json/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/logger/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/catch/single_include
)

target_compile_definitions(${TESTS_PROJECT_NAME} PRIVATE 
    CATCH_CONFIG_MAIN
    BOOST_JSON_STANDALONE
    CL_SILENCE_DEPRECATION
)

set_target_properties(${TESTS_PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/bin)
