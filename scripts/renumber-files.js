#!/usr/bin/env node
'use strict'
//@flow

const commandLineArgs = require('command-line-args')
const {renumberFiles} = require('../index')

const optionDefinitions = [
  {name: 'increment', alias: 'i', type: Number},
  {name: 'on', type: String, defaultOption: true, defaultValue: '.'},
  {name: 'start', alias: 's', type: Number},
  {name: 'exclude', alias: 'x', type: String, multiple: true},
  {name: 'dirs', 'alias': 'd', type: Boolean}
]

const options = commandLineArgs(optionDefinitions)

renumberFiles(options.on, {
  start: options.start,
  increment: options.increment,
  excludeFiles: options.exclude,
  withDirs: options.dirs})
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
