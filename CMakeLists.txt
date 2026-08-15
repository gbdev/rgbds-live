## Global configuration.

cmake_minimum_required(VERSION 3.16...4.4 FATAL_ERROR)

project(rgbds_live)

# Disable testing by default.
option(BUILD_TESTING "Build the testing tree." OFF)


## Patch third-party subprojects as necessary.

find_package(Git REQUIRED)
# The last three options are mostly for users' sake, but should preferably be removed during development to ensure the patches are clean.
set(patching_failed 0)
foreach(subproject rgbds)
  # Since it is a Git submodule, Git commands executed in that directory will remain scoped to it.
  set(git "${GIT_EXECUTABLE}" -C "${CMAKE_CURRENT_SOURCE_DIR}/${subproject}")
  set(PATCH_FILE "${CMAKE_CURRENT_SOURCE_DIR}/patches/${subproject}.patch")

  # First, revert the subproject to a pristine state so that the patch can be applied cleanly.
  execute_process(
    COMMAND ${git} reset --hard --quiet
    WORKING_DIRECTORY "${TARGET_DIR}"
  )
  # Then, apply the patch...
  execute_process(
    COMMAND ${git} apply --reject "${PATCH_FILE}" # `--quiet` would suppress any error lines.
    WORKING_DIRECTORY "${TARGET_DIR}"
    RESULT_VARIABLE patch_retcode
  )
  # ...and record whether there was *any* patching failure.
  math(EXPR patching_failed "${patching_failed} + ${patch_retcode}")

  # Re-run CMake automatically if the patch file is changed.
  set_property(DIRECTORY APPEND PROPERTY CMAKE_CONFIGURE_DEPENDS "${PATCH_FILE}")
endforeach()

if(patching_failed)
  # Do not attempt further progress, as the subprojects could configure incorrectly and generate spurious errors.
  message(FATAL_ERROR "Failed to apply patches!")
endif()


## Manually `find_package()`-like some libs our subprojects depend on.
# Some libraries are not compiled in a traditional sense, but are instead provided by Emscripten
# via its "ports" system. The `--use-port` option sets up everything (include dirs, etc.).
# We set `*_FOUND` so `find_package` assumes that its job has already been (successfully) done,
# and do as little work is necessary to get our dependencies to successfully build.

set(ZLIB_FOUND TRUE)
add_library(ZLIB::ZLIB INTERFACE IMPORTED GLOBAL)
target_compile_options(ZLIB::ZLIB INTERFACE "--use-port=zlib")
target_link_options(ZLIB::ZLIB INTERFACE "--use-port=zlib")

set(PNG_FOUND TRUE)
add_library(PNG::PNG INTERFACE IMPORTED GLOBAL)
target_compile_options(PNG::PNG INTERFACE "--use-port=libpng")
target_link_options(PNG::PNG INTERFACE "--use-port=libpng")


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

message(STATUS "Configuring RGBDS...")
list(APPEND CMAKE_MESSAGE_INDENT "  ")
add_subdirectory(rgbds EXCLUDE_FROM_ALL)
list(POP_BACK CMAKE_MESSAGE_INDENT)

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


set(CMAKE_POLICY_DEFAULT_CMP0077 NEW) # Force binjgb to honor the variables below.
set(WASM TRUE) # Emit WASM (for performance).
set(RGBDS_LIVE TRUE) # Enable some tweaks.

message(STATUS "Configuring binjgb...")
list(APPEND CMAKE_MESSAGE_INDENT "  ")
add_subdirectory(binjgb EXCLUDE_FROM_ALL)
list(POP_BACK CMAKE_MESSAGE_INDENT)

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
