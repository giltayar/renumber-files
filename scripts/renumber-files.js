#!/usr/bin/env node
'use strict'
//@flow

const commandLineArgs = require('command-line-args')
const {renumberFilenames, getFileInfos, renameFiles} = require('../index')
const co = require('co')

const optionDefinitions = [
  {name: 'interval', alias: 'i', type: Number},
  {name: 'dir', type: String, defaultOption: true, defaultValue: '.'},
  {name: 'start', alias: 's', type: Number}
]

const options = commandLineArgs(optionDefinitions)

co(function*() {
  const fis = yield getFileInfos(options.dir)

  const renamings = renumberFilenames(fis, options.start, options.increment)

  yield renameFiles(options.dir, renamings)
})
