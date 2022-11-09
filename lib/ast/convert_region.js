const R = require('ramda')

const getVisibleCity = R.pluck('id')
const getStoreHouse = R.pluck('id')

const formatRegion = findAlias => R.reduce((acc, item) => {
  const options = item.options
    ? JSON.parse(item.options)
    : []

  if (item.name !== 'cityAndStoreHouse') {
    const column = item.name === 'city'
      ? item.cityColumn
      : item.storeHouseColumn
    const target = item.name === 'city'
      ? item.cityTarget
      : item.storeHouseTarget

    const opt = item.name === 'city'
      ? getVisibleCity(options)
      : getStoreHouse(options)

    const where = item.active && !item.where.length
      ? opt
      : item.where.map(Number)

    const t = { ...item, target, column }

    acc[`${findAlias(t)}.${column}`] = {
      $in: where
    }

    return acc
  }

  const t1 = {
    ...item,
    target: item.cityTarget,
    column: item.cityColumn
  }

  const t2 = {
    ...item,
    target: item.storeHouseTarget,
    column: item.storeHouseColumn
  }

  let where = item.active && !item.where.length
    ? getVisibleCity(options)
    : item.where.map(Number)

  const citySelected = where.length
    ? where[0]
    : []

  const storeHouseSelected = where.length > 1
    ? where.slice(1)
    : []

  if (citySelected.length) {
    acc[`${findAlias(t1)}.${item.cityColumn}`] = {
      $in: citySelected
    }
  }

  if (storeHouseSelected.length) {
    acc[`${findAlias(t2)}.${item.storeHouseColumn}`] = {
      $in: storeHouseSelected
    }
  }

  return acc
}, {})

const convertWhere = (findAlias, where) => R.compose(
  R.merge(R.mergeAll(where)),
  formatRegion(findAlias)
)

module.exports = convertWhere
