'use strict'
//@flow

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {renumberFilenames} = require('../index')

describe('api', function () {
  describe('renumberFilenames', function () {
    it('should renumber numberless files according to name', () => {
      const original = [
        {name: 'aaa', lastModified: new Date()},
        {name: 'ccc', lastModified: new Date()},
        {name: 'abc', lastModified: new Date()},
        {name: 'bbb', lastModified: new Date()}
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-aaa', '2-abc', '3-bbb', '4-ccc'
      ])

      expect(Array.from(result.keys())).to.have.members(original.map(fi => fi.name))
    })

    it('should renumber numberless files after numbered files', () => {
      const original = [
        {name: 'aaa', lastModified: new Date()},
        {name: 'ccc', lastModified: new Date()},
        {name: '2-abc', lastModified: new Date()},
        {name: '1-bbb', lastModified: new Date()}
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-bbb', '2-abc', '3-aaa', '4-ccc'
      ])

      expect(Array.from(result.keys())).to.have.members(original.map(fi => fi.name))
    })

    it('should renumber files with numbers according to numbers', () => {
      const original = [
        {name: '01-aaa', lastModified: new Date()},
        {name: '03-ccc', lastModified: new Date()},
        {name: '02-abc', lastModified: new Date()},
        {name: '04-bbb', lastModified: new Date()}
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-aaa', '2-abc', '3-ccc', '4-bbb'
      ])
      expect(Array.from(result.keys())).to.have.members(original.map(fi => fi.name))
    })

    it('should renumber files with numbers according to numbers', () => {
      const original = [
        {name: '10-aaa', lastModified: new Date()},
        {name: '30-ccc', lastModified: new Date()},
        {name: '20-abc', lastModified: new Date()},
        {name: '41-bbb', lastModified: new Date()}
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-aaa', '2-abc', '3-ccc', '4-bbb'
      ])
      expect(Array.from(result.keys())).to.have.members(original.map(fi => fi.name))
    })

    it('should pad renumbering with one zero if there are more than 10', () => {
      const oneToTen = Array.from(Array(10), (x, i) => i + 1)
      const original = oneToTen.map(n => ({name: `${n}a`, lastModified: new Date()}))
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal(oneToTen.map(n => `${n < 10 ? '0' + String(n) : n}-a`))
      expect(Array.from(result.keys())).to.have.members(original.map(fi => fi.name))
    })

    it('should pad renumbering with two zeros if there are more than 100', () => {
      const oneToHundred = Array.from(Array(100), (x, i) => i + 1)
      const original = oneToHundred.map(n => ({name: `${n}a`, lastModified: new Date()}))
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal(oneToHundred.map(
        n => `${n < 10
          ? '00' + String(n)
          : n < 100
            ? '0' + String(n)
            : n}-a`))
      expect(Array.from(result.keys())).to.have.members(original.map(fi => fi.name))
    })

    it('should renumber files with same numbers according to last modified', () => {
      const original = [
        {name: '10-aaa', lastModified: new Date(2001, 10, 2)},
        {name: '30-ccc', lastModified: new Date()},
        {name: '10-abc', lastModified: new Date(2001, 10, 1)},
        {name: '41-bbb', lastModified: new Date()}
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-abc', '2-aaa', '3-ccc', '4-bbb'
      ])
      expect(Array.from(result.keys())).to.have.members(original.map(fi => fi.name))
    })
  })
})
