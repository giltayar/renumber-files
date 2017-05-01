'use strict'
//@flow
const co = require('co')
const thenify = require('thenify')
const fs = require('fs')
const path = require('path')
const zip = require('lodash.zip')

/*::
type RenumberFilenamesOptions = {
  start: number,
  increment: number,
  separator: string,
  excludeFiles?: string[],
  withDirs?: boolean
}
*/

exports.renumberFiles = (dir/*:string*/, options/*:RenumberFilenamesOptions*/) => co(function*() {
  const fis = yield getFileInfos(dir, options.withDirs || false)

  const renamings = exports.renumberFilenames(fis, options)

  yield renameFiles(dir, renamings)
})

exports.renumberFilenames = (fileNames/*:string[]*/,
  {start = 1, increment = 1, separator = '-', excludeFiles = []}
    /*:RenumberFilenamesOptions*/ = {})/*: Map<string, string> */ => {
  const fileInfos = fileNames
    .map(f =>
      Object.assign({},
        {originalName: f}, extractNumber(f, separator)))
    .filter(f => !excludeFiles.includes(f.originalName))

  fileInfos.sort((fi1, fi2) => {
    if (fi1.number !== undefined && fi2.number !== undefined) {
      const result = fi1.number - fi2.number

      if (result !== 0) {
        return result
      } else {
        return (fi1.numberSuffix || '').localeCompare(fi2.numberSuffix || '')
      }
    } else if (fi1.number != null && fi2.number == null) {
      return -1
    } else if (fi1.number == null && fi2.number != null) {
      return 1
    } else {
      return fi1.name.localeCompare(fi2.name)
    }
  })

  // I tried - I really tried to make it functional. It would have been very convoluted.
  let index = 0
  const res = []
  for (const fi of fileInfos) {
    if (index === 0) {
      index = start
    } else if (!fi.numberSuffix) {
      index += increment
    }
    res.push([
      fi.originalName,
      `${zeroPad(index, start, increment, fileInfos.length)}${fi.numberSuffix || ''}${separator}${fi.name}`])
  }

  return new Map(res)
}

const getFileInfos = (dir, withDirs) => co(function*() {
  const dirList = yield thenify(fs.readdir)(dir)

  const dirListWithoutDotFiles = dirList.filter(f => !f.startsWith('.'))

  const stats = yield Promise.all(
    dirListWithoutDotFiles
      .map(entry => thenify(fs.stat)(path.join(dir, entry))))

  const nameAndStats = zip(dirListWithoutDotFiles, stats)

  return nameAndStats
    .filter(([name, stat]) => withDirs || stat.isFile())
    .map(([name, stat]) => name)
})

const renameFiles = (dir, renamings) => co(function*() {
  yield Promise.all(
    Array.from(renamings.entries())
      .map(([originalName, newName]) =>
        thenify(fs.rename)(path.join(dir, originalName), path.join(dir, newName + '.renumber'))))

  yield Promise.all(
    Array.from(renamings.values())
      .map(newName =>
        thenify(fs.rename)(path.join(dir, newName + '.renumber'), path.join(dir, newName))))
})

const zerosToPadWith = '00000000000000000'

const zeroPad = (number, start, increment, length) => {
  const maxNumber = start + increment * (length - 1)

  const numberOfDigits =
    maxNumber < 10 ? 1 : maxNumber < 100 ? 2 : maxNumber < 1000 ? 3 : maxNumber < 10000 ? 4 : 5

  return (zerosToPadWith.slice(0, numberOfDigits) + number).slice(-numberOfDigits)
}

const extractNumber = (
  file,
  separator) => {
  const [, number, afterNumber] = new RegExp(`([0-9]*)(.*)`).exec(file)
  const [numberSuffix, ...nameParts] = afterNumber.split(separator)
  const name = nameParts.join(separator)

  return {
    number: number ? parseInt(number) : undefined,
    numberSuffix: !name ? undefined : numberSuffix,
    name: !name ? numberSuffix : name
  }
}
