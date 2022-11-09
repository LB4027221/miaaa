const R = require('ramda')

const convertGroupBy = findAlias => R.reduce((acc, item) => {
  let alias = findAlias(item)
  acc.push(`${alias}.${item.column}`)

  return acc
}, [])

const groupByComponentsConvert = R.compose(
  R.flatten,
  R.map((item) => {
    if (item.value) {
      return item.value
    }

    return item.options[0]
  }),
  R.filter(item =>
    item.options.length &&
    !R.isEmpty(item.options[0]) &&
    item.text.length &&
    !R.isEmpty(item.text[0]))
)

module.exports = {
  convertGroupBy,
  groupByComponentsConvert
}
