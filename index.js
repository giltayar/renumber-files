
exports.renumberFilenames = (fileNames/*:[{name: string, lastModified: Date}]*/,
  {start = 1, increment = 1, separator = '-'} = {})/*: [string]*/ => {
  const fileInfo = fileNames.map(f =>
    Object.assign({}, extractNumber(f, separator), {lastModified: f.lastModified}))
  fileInfo.sort((fi1, fi2) => {
    if (fi1.number !== undefined && fi2.number !== undefined) {
      const result = fi1.number - fi2.number

      if (result !== 0) {
        return result
      } else {
        return fi1.lastModified.getTime() - fi2.lastModified.getTime()
      }
    } else if (fi1.number != null && fi2.number == null) {
      return 1
    } else if (fi1.number == null && fi2.number != null) {
      return -1
    } else {
      return fi1.name.localeCompare(fi2.name)
    }
  })

  return fileInfo.map((fi, i) =>
    `${zeroPad(i === 0
        ? start
        : start + i * increment,
        start, increment, fileInfo.length)}${separator}${fi.name}`)
}

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
  const [, number, name] = /([0-9]*)(.*)/.exec(file.name)

  return {
    number: number ? parseInt(number) : undefined,
    name: separator && name.startsWith(separator) ? name.slice(separator.length) : name,
    lastModified: file.lastModified
  }
}
