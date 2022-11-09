const R = require('ramda')

const mapIndexed = R.addIndex(R.map)

const findIndex = ({ alias, type }) =>
  R.findIndex(R.propEq('alias', alias))

const convertJoins = ({ populate, getTarget }) => R.compose(
  mapIndexed(item => ({
    type: item.type,
    target: `${getTarget({ target: item.leftTarget }).database}.${getTarget({ target: item.leftTarget }).table}`,
    alias: populate({ target: item.leftTarget }),
    on: {
      [item.leftColumn]: `$${populate({ target: item.rightTarget })}.${item.rightColumn}$`
    }
  })),
  R.filter(item =>
    item.leftTarget &&
    item.leftColumn &&
    item.rightTarget &&
    item.rightColumn
  )
)

const mergetJoins = (joins) => {
  let res = []

  const mergerAll = (joins) => {
    if (joins.length) {
      let join = joins.shift()
      let index = findIndex(join)(res)

      if (index === -1) {
        res.push(join)
        return mergerAll(joins)
      }

      let item = res[index]

      item = {
        ...item,
        on: {
          ...item.on,
          ...join.on
        }
      }

      res.splice(index, 1, item)
      return mergerAll(joins)
    }
  }

  mergerAll(joins)

  return res
}

module.exports = {
  mergetJoins,
  convertJoins
}
