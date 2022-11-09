const R = require('ramda')

const getTempleteValues = R.match(/{([^}]+)?}/g)
const removeChar = R.replace(/{|}/g, '')
const getKeyAndValue = R.split(/:\s+/)
const zipKeyAndValue = R.fromPairs
const removeValueChar = R.map(value => parseInt(value, 10) || R.replace(/'/g, '')(value))

const compiled = R.compose(
  removeValueChar,
  zipKeyAndValue,
  R.map(R.compose(
    getKeyAndValue,
    removeChar
  )),
  getTempleteValues
)

const convert = R.pipe(R.converge(R.merge, [
  R.pipe(R.nthArg(0), compiled),
  R.pipe(R.nthArg(1), R.mergeAll)
]))

module.exports = convert
