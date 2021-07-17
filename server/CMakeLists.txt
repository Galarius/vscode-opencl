cmake_minimum_required (VERSION 3.1)

project(opencl-language-server)

add_subdirectory(tests)

find_package(OpenCL REQUIRED)

message ("C++ Flags:" ${CMAKE_CXX_FLAGS})
message("List of compile features: ${CMAKE_CXX_COMPILE_FEATURES}")

file(GLOB HEADERS "${PROJECT_SOURCE_DIR}/include/*.hpp")
file(GLOB SOURCES "${PROJECT_SOURCE_DIR}/src/*.cpp")
source_group("headers" FILES ${HEADERS})
source_group("sources" FILES ${SOURCES})

add_executable (${PROJECT_NAME} ${SOURCES})

target_compile_definitions(${PROJECT_NAME} PRIVATE 
    BOOST_JSON_STANDALONE
    CL_SILENCE_DEPRECATION
)
target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)

target_include_directories(${PROJECT_NAME}
     PRIVATE ${OpenCL_INCLUDE_DIRS}
     PRIVATE ${PROJECT_SOURCE_DIR}/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/logger/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/opencl/include
     PRIVATE ${PROJECT_SOURCE_DIR}/lib/json/include
)

set_target_properties(${PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/out)

target_link_libraries (${PROJECT_NAME} ${OpenCL_LIBRARIES})
