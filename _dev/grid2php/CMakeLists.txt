cmake_minimum_required (VERSION 3.1)
project(grid2php)

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

file(GLOB HEADERS "${PROJECT_SOURCE_DIR}/*.hpp")
file(GLOB SOURCES "${PROJECT_SOURCE_DIR}/*.cpp")
source_group("headers" FILES ${HEADERS})
source_group("sources" FILES ${SOURCES})

add_executable (${PROJECT_NAME} ${SOURCES} ${HEADERS})

set_target_properties(${PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/bin)
