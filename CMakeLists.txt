cmake_minimum_required(VERSION 3.13)
# binjgb is using minimum 2.8 ... new cmake doesn't like it those lines silencing it
set(CMAKE_POLICY_DEFAULT_CMP0000 NEW)
set(CMAKE_POLICY_VERSION_MINIMUM 3.5)
set(CMAKE_WARN_DEPRECATED OFF CACHE BOOL "" FORCE)

project(rgbds_live)

find_package(Git REQUIRED)

# it will apply patches/xxx.patch to xxx project (submodule)
function(apply_git_patch PROJECT_NAME)
    set(TARGET_DIR "${CMAKE_CURRENT_SOURCE_DIR}/${PROJECT_NAME}")
    set(PATCH_FILE "${CMAKE_CURRENT_SOURCE_DIR}/patches/${PROJECT_NAME}.patch")

    execute_process(
        COMMAND ${GIT_EXECUTABLE} apply 
            --ignore-space-change 
            --ignore-whitespace 
            --whitespace=nowarn    
            --check "${PATCH_FILE}"
        WORKING_DIRECTORY "${TARGET_DIR}"
        RESULT_VARIABLE PATCH_NEEDED
        OUTPUT_QUIET
        ERROR_QUIET
    )

    if(PATCH_NEEDED EQUAL 0)
        execute_process(
            COMMAND ${GIT_EXECUTABLE} apply 
                --ignore-space-change 
                --ignore-whitespace 
                --whitespace=nowarn
                "${PATCH_FILE}"
            WORKING_DIRECTORY "${TARGET_DIR}"
            RESULT_VARIABLE PATCH_APPLY_RESULT
        )
    endif()
endfunction()

apply_git_patch(rgbds)

# this will stop cmake from searching for zlib and pnglib
# those libs are by default in emsdk so even if we would compile rgbgfx some day this should work
set(ZLIB_FOUND TRUE CACHE BOOL "" FORCE)
set(ZLIB_USE_STATIC_LIBS ON CACHE BOOL "" FORCE)
set(ZLIB_INCLUDE_DIR "${EMSCRIPTEN_SYSROOT}/include" CACHE PATH "" FORCE)
set(ZLIB_LIBRARY "z" CACHE STRING "" FORCE)
set(PNG_FOUND TRUE CACHE BOOL "" FORCE)
set(PNG_PNG_INCLUDE_DIR "${EMSCRIPTEN_SYSROOT}/include" CACHE PATH "" FORCE)
set(PNG_LIBRARY "png" CACHE STRING "" FORCE)

# silencing PkgConfig this project doesn't need this
set(CMAKE_DISABLE_FIND_PACKAGE_PkgConfig ON CACHE BOOL "" FORCE)

# disable testing
set(BUILD_TESTING OFF CACHE BOOL "" FORCE)

# those are global flags for all projects compiled with emscripten
set(RGBDS_LIVE_C_OPT_FLAGS "-O3;-flto")
set(RGBDS_LIVE_C_COMMON_FLAGS "${RGBDS_LIVE_C_OPT_FLAGS};-msimd128;-ffast-math;-DNDEBUG")
add_compile_options(${RGBDS_LIVE_C_COMMON_FLAGS})
add_link_options(
    ${RGBDS_LIVE_C_OPT_FLAGS}
    "-sEXPORT_ES6=1" 
    "-sALLOW_MEMORY_GROWTH=1" 
    "-sENVIRONMENT=web" 
    "-sMODULARIZE=1"
)

# this is our main target and out directory
add_custom_target(rgbds_live ALL)
set(RGBDS_LIVE_OUT_DIR "${CMAKE_BINARY_DIR}/out")

# get rgbds version for build
execute_process(
    COMMAND ${GIT_EXECUTABLE} describe --tags --always
    WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/rgbds"
    OUTPUT_VARIABLE RGBDS_VERSION_FROM_GIT
    OUTPUT_STRIP_TRAILING_WHITESPACE
    ERROR_QUIET
)

# we need only those targets from rgbds
set(RGBDS_TARGETS rgbasm rgblink rgbfix)
# and we will put em into this target
add_custom_target(rgbds)

# importing rgbds
add_subdirectory(rgbds EXCLUDE_FROM_ALL)

# target specific configuration for rgbds
foreach(TGT ${RGBDS_TARGETS})
    if(TARGET ${TGT})
        set_target_properties(${TGT} PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${RGBDS_LIVE_OUT_DIR}")
        if("${TGT}" STREQUAL "rgbasm")
            set(EXP_NAME "createRgbAsm")
        elseif("${TGT}" STREQUAL "rgblink")
            set(EXP_NAME "createRgbLink")
        elseif("${TGT}" STREQUAL "rgbfix")
            set(EXP_NAME "createRgbFix")
        endif()
        target_compile_definitions(${TGT} PRIVATE BUILD_VERSION_STRING="${RGBDS_VERSION_FROM_GIT}")
        target_link_options(${TGT} PRIVATE 
            "-sEXPORT_NAME=${EXP_NAME}"
            "-sEXPORTED_RUNTIME_METHODS=['FS']"
            )
        add_dependencies(rgbds ${TGT})
    endif()
endforeach()
add_dependencies(rgbds_live rgbds)

# those need to be set before importing binjgb
set(WERROR ON CACHE BOOL "" FORCE)
set(WASM TRUE CACHE BOOL "" FORCE)
set(RGBDS_LIVE ON CACHE BOOL "" FORCE)

# importing binjgb
add_subdirectory(binjgb EXCLUDE_FROM_ALL)

#target specific configuration for binjgb
if(TARGET binjgb)
    # binjgb sets EXPORTED_JSON as LINK_DEPENDS
    # we need to get it back to after ...(next comment)
    get_target_property(EXPORTED_JSON binjgb LINK_DEPENDS)
    set_target_properties(binjgb PROPERTIES 
        # removing original LINK_FLAGS
        LINK_FLAGS ""
        RUNTIME_OUTPUT_DIRECTORY "${RGBDS_LIVE_OUT_DIR}"
    )
    target_link_options(binjgb PRIVATE
        "-sMALLOC=emmalloc"
        "-sEXIT_RUNTIME=0"
        "-sFILESYSTEM=0"
        "-sEXPORTED_RUNTIME_METHODS=['HEAP8']"
        "-sEXPORTED_FUNCTIONS=@${EXPORTED_JSON}"
    )
    add_dependencies(rgbds_live binjgb)
endif()