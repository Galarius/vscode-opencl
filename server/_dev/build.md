# Build Hints

## Dependencies

### Linux

`apt-get install ocl-icd-opencl-dev opencl-headers cmake gcc git`

### Universal

`git submodule update --init`

## Build

### macOS

```
cd ./server
mkdir build && cd build
cmake -G Xcode ..
```

### Linux

```
cd ./server
mkdir build && cd build
cmake ..
make
```

### Win32

```
cd ./server
mkdir build && cd build
cmake -G "Visual Studio 16" -T v142 ..
```
