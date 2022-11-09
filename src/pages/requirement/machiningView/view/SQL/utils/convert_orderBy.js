const R = require('ramda')

const convertOrderBy = findAlias => R.compose(
  R.reduce((acc, item) => {
    let { type, column } = item
    if (type === 'exp') {
      acc.push(`${column}`)
    } else {
      let alias = findAlias(item)
      acc.push(`${alias}.${column} ${type}`)
    }

    return acc
  }, []),
  R.filter(item =>
    item.column
  )
)

module.exports = convertOrderBy
