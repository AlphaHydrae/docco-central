[![build status](https://secure.travis-ci.org/AlphaHydrae/docco-central.png)](http://travis-ci.org/AlphaHydrae/docco-central)
# docco-central

**[Docco](http://jashkenas.github.com/docco/) documentation for whole projects.**

## Installation

    npm install -g docco-central

Docco requires [Pygments](http://pygments.org) for syntax highlighting. Install it with `sudo easy_install pygments` or follow the [installation documentation](http://pygments.org/docs/installation/).

## Usage

    cd /path/to/your/project
    docco-central lib/*.js

Documentation is put in `docs` by default.

## Options

    Usage: docco-central [options] <file>...

    Options:

      -o, --output    change the output directory ("docs" by default)
      -h, --help      show usage information
      -V, --version   show version number

## License (MIT)

Copyright (c) 2011 Alpha Hydrae

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
