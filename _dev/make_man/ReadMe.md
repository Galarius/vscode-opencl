# OpenCL man maker

> Helper script to provide OpenCL Runtime hover documentation in markdown format that is supported by vscode.

## Requirements

* wget
* pandoc
* grid2php

## Usage

* Download html documentation files: `python3 make_man.py -d`
* Convert html to markdown: `python3 make_man.py -c`
* Generate files for the vscode hover provider: `python3 make_man.py -u`
