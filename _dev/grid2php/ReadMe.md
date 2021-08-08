 # grid2php
 
 Tool for conversion markdown `grid_tables` to `PHP Markdown Extra table`
 
 ## Usage 
 
 Run command `grid2php fixtures/src.md fixtures/dst.md` to convert grid table:
 
 
 ```
 +---------------+---------------+--------------------+
 | Fruit         | Price         | Advantages         |
 +===============+===============+====================+
 | Bananas       | $1.34         | - built-in wrapper |
 |               |               | - bright color     |
 +---------------+---------------+--------------------+
 | Oranges       | $2.10         | - cures scurvy     |
 |               |               | - tasty            |
 +---------------+---------------+--------------------+
 ```
 
 to `PHP Markdown Extra table`:
 
 ```
 | Fruit         | Price         | Advantages         |
 | --- | --- | --- |
 |  Bananas       |  $1.34         |  - built-in wrapper   - bright color     |
 |  Oranges       |  $2.10         |  - cures scurvy       - tasty            |
 ```
  
## Build

### macOS

```
mkdir build && cd build
cmake -G Xcode ..
```

### Linux

```
mkdir build && cd build
cmake ..
make
```

### Win32

```
mkdir build && cd build
cmake -G "Visual Studio 16" -T v142 ..
```