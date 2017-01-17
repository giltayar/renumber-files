
exports.renumberFilenames = (fileNames/*:[{name: string, lastModified: Date}]*/, 
  {start = 1, increment = 1, separator = '-x1'})/*: [string]*/ => {
  const fileInfo = fileNames.map(f =>
    Object.assign({}, extractNumber(f), {lastModified: f.lastModified}))

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
    `${i === 0 ? start : start + i * increment}${separator}${fi.name}`)
}

const extractNumber = (file/*: {name: string, lastModified: Date}*/)/*: {number: number, name: string, lastModified: Date}*/ => {
  const [, number, name] = /([0-9]*)(.*)/.exec(file.name)

  return {
    number,
    name: name ? parseInt(name) : undefined,
    lastModified: file.lastModified
  }
}
