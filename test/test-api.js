'use strict'
//@flow

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {renumberFilenames} = require('../index')

describe('api', function () {
  describe('renumberFilenames', function () {
    it('should renumber numberless files according to name', () => {
      const original = [
        'aaa',
        'ccc',
        'abc',
        'bbb'
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-aaa', '2-abc', '3-bbb', '4-ccc'
      ])

      expect(Array.from(result.keys())).to.have.members(original)
    })

    it('should renumber files with numbers according to numbers', () => {
      const original = [
        '01-aaa',
        '03-ccc',
        '02-abc',
        '04-bbb'
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-aaa', '2-abc', '3-ccc', '4-bbb'
      ])
      expect(Array.from(result.keys())).to.have.members(original)
    })

    it('should renumber numberless files after numbered files', () => {
      const original = [
        'aaa',
        'ccc',
        '2-abc',
        '1-bbb'
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-bbb', '2-abc', '3-aaa', '4-ccc'
      ])

      expect(Array.from(result.keys())).to.have.members(original)
    })

    it('should renumber files with numbers according to numbers', () => {
      const original = [
        '10-aaa-more',
        '30-ccc',
        '20-abc',
        '41-bbb'
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-aaa-more', '2-abc', '3-ccc', '4-bbb'
      ])
      expect(Array.from(result.keys())).to.have.members(original)
    })

    it('should renumber files with numbers according to number suffixes', () => {
      const original = [
        '10-aaa',
        '10a-ccc',
        '10c-abc',
        '10b-bbb'
      ]
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal([
        '1-aaa', '1a-ccc', '1b-bbb', '1c-abc'
      ])
      expect(Array.from(result.keys())).to.have.members(original)
    })

    it('should pad renumbering with one zero if there are more than 10', () => {
      const oneToTen = Array.from(Array(10), (x, i) => i + 1)
      const original = oneToTen.map(n => `${n}a`)
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal(oneToTen.map(n => `${n < 10 ? '0' + String(n) : n}-a`))
      expect(Array.from(result.keys())).to.have.members(original)
    })

    it('should pad renumbering with two zeros if there are more than 100', () => {
      const oneToHundred = Array.from(Array(100), (x, i) => i + 1)
      const original = oneToHundred.map(n => `${n}a`)
      const result = renumberFilenames(original)

      expect(Array.from(result.values())).to.deep.equal(oneToHundred.map(
        n => `${n < 10
          ? '00' + String(n)
          : n < 100
            ? '0' + String(n)
            : n}-a`))
      expect(Array.from(result.keys())).to.have.members(original)
    })
  })
})
