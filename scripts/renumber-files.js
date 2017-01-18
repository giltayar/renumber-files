#!/usr/bin/env node
'use strict'
//@flow

const commandLineArgs = require('command-line-args')
const {renumberFilenames, getFileInfos, renameFiles} = require('../index')
const co = require('co')

const optionDefinitions = [
  {name: 'increment', alias: 'i', type: Number},
  {name: 'dir', type: String, defaultOption: true, defaultValue: '.'},
  {name: 'start', alias: 's', type: Number}
]

const options = commandLineArgs(optionDefinitions)
co.wrap(function*() {
  const fis = yield getFileInfos(options.dir)

  const renamings = renumberFilenames(fis, {start: options.start, increment: options.increment})

  yield renameFiles(options.dir, renamings)
})().catch(err => {
  console.error(err)
  process.exit(1)
})
