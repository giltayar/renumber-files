'use strict'
//@flow

const {describe, it} = require('mocha')
const {expect} = require('chai')
const co = require('co')
const thenify = require('thenify')
const fs = require('fs')
const os = require('os')

describe('renumber-files script', function () {
  it('should rename the files in the test-folder', co.wrap(function* () {
    const tmpDir = yield thenify(fs.mkdtemp)(os.tmpdir())


  }))
})
