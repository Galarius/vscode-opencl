cmake_minimum_required (VERSION 3.1)

set(MAIN_PROJECT_SOURCE_DIR ${PROJECT_SOURCE_DIR})

project(opencl-language-server-tests)

file(GLOB HEADERS "${MAIN_PROJECT_SOURCE_DIR}/include/*.hpp")
file(GLOB SOURCES "${MAIN_PROJECT_SOURCE_DIR}/src/*.cpp")
list(REMOVE_ITEM SOURCES "${MAIN_PROJECT_SOURCE_DIR}/src/main.cpp")
list(REMOVE_ITEM SOURCES "${MAIN_PROJECT_SOURCE_DIR}/src/diagnostics.cpp")
list(REMOVE_ITEM SOURCES "${MAIN_PROJECT_SOURCE_DIR}/src/lsp.cpp")
list(APPEND SOURCES "${PROJECT_SOURCE_DIR}/main.cpp")

source_group("headers" FILES ${HEADERS})
source_group("sources" FILES ${SOURCES})

add_executable (${PROJECT_NAME} ${SOURCES})

target_include_directories(${PROJECT_NAME}
     PRIVATE ${MAIN_PROJECT_SOURCE_DIR}/include
     PRIVATE ${MAIN_PROJECT_SOURCE_DIR}/lib/logger/include
     PRIVATE ${MAIN_PROJECT_SOURCE_DIR}/lib/json/include
     PRIVATE ${MAIN_PROJECT_SOURCE_DIR}/lib/catch/single_include
)

target_compile_definitions(${PROJECT_NAME} PRIVATE 
    BOOST_JSON_STANDALONE
    CL_SILENCE_DEPRECATION
)
target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)

set_target_properties(${PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/../out)
