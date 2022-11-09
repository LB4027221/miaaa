const R = require('ramda')

const useToday = (props) => {
  let dafault = props.where.map(item => item.replace(/'/g, ''))

  let where = dafault

  return where.map(item => `'${item}'`)
}

const convertWhere = findAlias => R.reduce((acc, item) => {
  let i = {}

  let canWork = R.type(item.where) === 'Array'
    ? item.where.filter(item => !R.isEmpty(item)).length
    : null

  if (item.column && canWork) {
    item.where = item.where
      .filter(item => !R.isEmpty(item))
      .filter(item => item !== 'all')

    let whereSwitch = {
      RangePicker: (props) => {
        if (item.independent.useToday) {
          return ({
            $gte: useToday(props)[0],
            $lte: useToday(props)[1]
          })
        }

        return ({
          $gte: item.where[0],
          $lte: item.where[1]
        })
      },
      Search: { $like: item.where[0] },
      SelectIn: { $in: item.where },
      SSelectIn: { $in: item.where },
      $in: { $in: item.where },
      $nin: { $nin: item.where },
      // 修复以前数据不正确而留下的一个坑
      $equal: { $equals: item.where }
    }

    i[`${findAlias(item)}.${item.column}`] = whereSwitch[item.name]
      ? typeof whereSwitch[item.name] === 'function'
        ? whereSwitch[item.name](item)
        : whereSwitch[item.name]
      : { [item.name]: item.where[0] }

    acc.push(i)
  }

  return acc
}, [])

module.exports = convertWhere
