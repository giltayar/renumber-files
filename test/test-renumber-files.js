'use strict'
//@flow

const {describe, it} = require('mocha')
const {expect} = require('chai')
const co = require('co')
const thenify = require('thenify')
const fs = require('fs')
const path = require('path')
const testFixture = require('test-fixture')
const {fork} = require('child_process')

describe('renumber-files script', function () {
  const prepareTestFolder = co.wrap(function*() {
    const testFolderFixture = testFixture('test-folder')
    const testFolder = yield thenify(testFolderFixture.copy.bind(testFolderFixture))()

    const later = new Date(2001, 1, 2).getTime() / 1000
    const earlier = new Date(2001, 1, 1).getTime() / 1000

    yield thenify(fs.utimes)(path.join(testFolder, '10-aaa'), later, later)
    yield thenify(fs.utimes)(path.join(testFolder, '10-abc'), earlier, earlier)

    return testFolder
  })

  it('should rename the files in the test-folder', co.wrap(function* () {
    const testFolder = yield prepareTestFolder()
    const code = yield new Promise((resolve, reject) =>
      fork(path.resolve(__dirname, '../scripts/renumber-files'), [
        '--exclude', 'README.md'
      ], {cwd: testFolder})
        .on('error', reject)
        .on('exit', resolve))

    expect(code).to.equal(0)

    const resultFiles = yield thenify(fs.readdir)(testFolder)
    expect(resultFiles).to.have.members([
      '1-abc', '2-aaa', '3-ccc', '4-bbb', 'README.md', '.foo'
    ])
  }))

  it('should rename according to the given parameters', co.wrap(function* () {
    const testFolder = yield prepareTestFolder()
    const code = yield new Promise((resolve, reject) =>
      fork(path.resolve(__dirname, '../scripts/renumber-files'), [
        '--dir', testFolder,
        '--increment', '10',
        '--start', '3',
        '--exclude', 'README.md'
      ])
        .on('error', reject)
        .on('exit', resolve))

    expect(code).to.equal(0)

    const resultFiles = yield thenify(fs.readdir)(testFolder)

    expect(resultFiles).to.have.members([
      '03-abc', '13-aaa', '23-ccc', '33-bbb', 'README.md', '.foo'
    ])
  }))
})
