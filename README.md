# renumber-files

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)
![build status](https://travis-ci.org/create-oss/renumber-files.svg?branch=master)
[![npm version](https://badge.fury.io/js/renumber-files.svg)](https://badge.fury.io/js/renumber-files)

Renumbers files to look like this:

01-a-file.html
02-another-file.html
03-...

## Installation

```js
npm install -g renumber-files
```

## Usage

### Command Line

```bash
renumber-files [_dir_] [--increment <increment>] [--start <start>] [[-exclude <filename>]] [--dirs]
```

Will renumber the files in the directory specified, or current directory if not specified.
The delta between each number will be _increment_, where the default is 1,
and will start at _start_, where the default is 1. It will exclude `<filename>` from the renumbering.
If _dirs_, then listing will also take into account directories

### API

The package exposes the function `renumberFiles`

```javascript
renumberFiles(directoryWhereFilesAre[, options])
```

where `options` is an object with the optional fields:

* `start`: from which number to start the numbering. Default 1.
* `increment`: how much to increment each number. Default 1.
* `separator`: what will be the separator between the number and the name. Default '-'.
* `excludeFiles`: an array of filenames to exclude from the renumbering

## Renumbering algorithm

The renumbering works like this:

* List all files
* For each file, if it is prefixed by digits,
  grab those digits into a number, and remember.
  Also remember the number suffix if there are non-digits before separator.
* Sort the files with numbers first.
  If two files have the same number, use the number suffix. If there is no number suffix,
  use their names.
  The numberless files will be last, sorted by name.
* Now remove all numbers from the files with numbers, and renumber according to the sort. Note that
  files with the same number but a different suffix will still have the same number.
* Renumbering will be `<number><numberSuffix>-<filename>`, where number is padded with zeros to make a lexical sort
  work.
