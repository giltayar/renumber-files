#!/usr/bin/env node
'use strict'
//@flow

const commandLineArgs = require('command-line-args')
const {renumberFiles} = require('../index')

const optionDefinitions = [
  {name: 'increment', alias: 'i', type: Number},
  {name: 'dir', type: String, defaultOption: true, defaultValue: '.'},
  {name: 'start', alias: 's', type: Number}
]

const options = commandLineArgs(optionDefinitions)
renumberFiles(options.dir, {start: options.start, increment: options.increment})
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
