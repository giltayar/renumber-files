# renumber-files

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

Renumbers files to look like this:

01-a-file.html
02-another-file.html
03-...

## Installation

```js
npm install -g renumber-files
```

## Usage

```bash
renumber-files [_dir_] [-n interval]
```

Will renumber the files in the directory specified, or current directory if not specified. The delta between
each number will be _interval_, where the default is 1.

## Renumbering algorithm

The algorithm will be thus:

* List all files
* For each file, if it is prefixed by digits,
  grab those digits into a number, and remember.
* Sort the files with numbers first.
  If two files have the same number,
  use the modification time to sort between the two.
  The numberless files will be last, sorted by name.
* Now remove all numbers from the files with numbers, and renumber according to the sort.
* Renumbering will be _number_-_filename_, where number is padded with zeros to make a lexical sort work.
