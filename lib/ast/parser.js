const R = require('ramda')
const builder = require('@sxc/mongo-sql')
const _ = require('lodash')
const convertOrderBy = require('./convert_orderBy')
const { convertJoins, mergetJoins } = require('./convert_joins')
const convertWhere = require('./convert_where')
const { convertGroupBy, groupByComponentsConvert } = require('./convert_groupBy')
const convertByPassWhere = require('./convert_pass_where')
const convertRegion = require('./convert_region')

const alias = ['b', 'a', 'c', 'd', 'e', 'f', 'g', 'f', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q']
const mapIndexed = R.addIndex(R.map)

const addExpJoin = (sql, expJoin) => {
  if (sql) {
    const { joins = [] } = sql
    sql.joins = [...joins, {
      expression: expJoin
    }]
  }

  return sql
}

const parser = ({
  metaList,
  report: {
    database,
    table,
    limit = 15,
    offset = 0,
    target,
    expJoin,
    optGroupBy,
    groupByComponents,
    regionComponent = [],
    having = []
  },
  where,
  joins,
  groupBy,
  targets,
  orderBy
}, passWhere) => {
  let populate = populateTarget(targets)
  let getTarget = findTarget(targets)

  regionComponent = regionComponent.filter(item => (item.where && item.where.length) || item.active)

  if (metaList.length) {
    const merge = initSql({
      database,
      populate,
      table,
      limit,
      offset,
      target
    })

    let sqlStr = merge(metaList)

    where = convertWhere(populate)(where)

    if (joins && joins.length) {
      joins = convertJoins({ populate, getTarget })(joins)
      joins = mergetJoins(joins)

      sqlStr.joins = joins
    }

    if (where && where.length) {
      sqlStr.where = where
    }

    if (passWhere) {
      sqlStr.where = convertByPassWhere(passWhere)(sqlStr.where || [])
    }

    if (regionComponent && regionComponent.length) {
      sqlStr.where = convertRegion(populate, sqlStr.where || [])(regionComponent)
    }

    if (orderBy && orderBy.length) {
      let order = convertOrderBy(populate)(orderBy)

      if (order.length) sqlStr.order = order
    }

    if (groupBy.length) {
      sqlStr.groupBy = convertGroupBy(populate)(groupBy)
    }

    if (sqlStr.columns.length && sqlStr.table) {
      sqlStr.table = database
        ? `${database}.${table}`
        : table
          ? { expression: table }
          : table

      if (optGroupBy && optGroupBy.length) {
        sqlStr.groupBy = sqlStr.groupBy
          ? sqlStr.groupBy.concat(optGroupBy)
          : [].concat(optGroupBy)

        sqlStr.groupBy = sqlStr.groupBy.filter(i => !R.isEmpty(i))
      }

      if (groupByComponents && groupByComponents.length) {
        groupByComponents = groupByComponentsConvert(groupByComponents)

        sqlStr.groupBy = sqlStr.groupBy
          ? sqlStr.groupBy.concat(groupByComponents)
          : [].concat(groupByComponents)

        sqlStr.groupBy = sqlStr.groupBy.filter(i => !R.isEmpty(i))
      }

      if (sqlStr.groupBy && !sqlStr.groupBy.length) {
        sqlStr = R.dissoc('groupBy')(sqlStr)
      }

      if (expJoin) {
        sqlStr = addExpJoin(sqlStr, expJoin)
      }
      if (!R.isEmpty(having)) {
        let _having = convertOrderBy(populate)(having)

        if (_having.length) sqlStr.having = _having
      }

      let result = builder.sql(sqlStr)
      result = convertSQL(result, sqlStr)
      result = result.replace(/HAVING undefined =/i, '\nHAVING')

      // 为了兼容正式与测试库有 dw = dw_sec
      if (process.env.NODE_ENV === 'development') {
        result = result.replace(/dw_sec/g, 'dw')
      }

      return result
    }
  }

  return ''
}

const countIfHaving = (props) => {
  const from = parser(props)

  return `select count(*) from (${from}) as aaaaa`
}

const parserCountSQL = ({
  metaList,
  report: {
    database, table, limit = 15, offset = 0, target, optGroupBy, groupByComponents, expJoin, regionComponent = [], having = []
  },
  where,
  joins,
  targets,
  groupBy
}, passWhere) => {
  if (!R.isEmpty(having) && having[0].column) {
    return countIfHaving({
      metaList,
      report: {
        database,
        table,
        limit: 100000000,
        offset: 0,
        target,
        optGroupBy,
        groupByComponents,
        expJoin,
        regionComponent,
        having
      },
      where,
      joins,
      targets,
      groupBy
    }, passWhere)
  }
  let populate = populateTarget(targets)
  let getTarget = findTarget(targets)

  regionComponent = regionComponent.filter(item => item.where.length || item.active)

  if (metaList.length && table) {
    const merge = initSql({
      database,
      populate,
      table,
      limit,
      offset,
      target
    })

    let sqlStr = merge(metaList)

    sqlStr = R.dissoc('limit')(sqlStr)
    sqlStr = R.dissoc('offset')(sqlStr)

    where = convertWhere(populate)(where)

    if (joins && joins.length) {
      joins = convertJoins({populate, getTarget})(joins)
      joins = mergetJoins(joins)

      sqlStr.joins = joins
    }

    if (where && where.length) {
      sqlStr.where = where
    }

    if (regionComponent && regionComponent.length) {
      sqlStr.where = convertRegion(populate, sqlStr.where || [])(regionComponent)
    }

    if (passWhere) {
      sqlStr.where = convertByPassWhere(passWhere)(sqlStr.where || [])
    }

    if (sqlStr.columns.length && sqlStr.table) {
      sqlStr.table = database
        ? `${database}.${table}`
        : table
          ? { expression: table }
          : table

      let column = {
        type: 'function',
        function: 'count'
      }

      groupBy = groupBy.map(item => `${populate(item)}.${item.column}`)

      if (optGroupBy && optGroupBy.length) {
        groupBy = groupBy
          ? groupBy.concat(optGroupBy)
          : [].concat(optGroupBy)
      }

      if (groupByComponents && groupByComponents.length) {
        groupByComponents = groupByComponentsConvert(groupByComponents)

        groupBy = groupBy
          ? groupBy.concat(groupByComponents)
          : [].concat(groupByComponents)

        groupBy = groupBy.filter(item => !R.isEmpty(item))
      }

      let expression = groupBy.filter(item => !R.isEmpty(item)).length
        ? `distinct ${groupBy.join(',')}`
        : '*'

      column.expression = expression

      let columns = [column]
      sqlStr.columns = columns

      if (expJoin) {
        sqlStr = addExpJoin(sqlStr, expJoin)
      }
      if (!R.isEmpty(having)) {
        let _having = convertOrderBy(populate)(having)

        if (_having.length) sqlStr.having = _having
      }

      let result = builder.sql(sqlStr)
      result = convertSQL(result, sqlStr)
      result = result.replace(/HAVING undefined =/i, '\nHAVING')

      // 为了兼容正式与测试库有 dw = dw_sec
      if (process.env.NODE_ENV === 'development') {
        result = result.replace(/dw_sec/g, 'dw')
      }

      return result
    }
  }

  return ''
}

const populateTarget = targets => item => {
  let target = R.find(R.propEq('key', item.target))(targets)
  return target
    ? target.alias.trim()
    : item.target
}

const findTarget = targets => item => {
  let res = R.find(R.propEq('key', item.target))(targets)
  // 为了兼容正式与测试库有 dw = dw_sec
  console.log(res)
  if (process.env.NODE_ENV === 'development') {
    if (res) {
      res.database = res.database === 'dw_sec'
        ? 'dw'
        : res.database
    }
  }

  return res || {
    database: '',
    table: ''
  }
}

const convertSelect = {
  select: R.pick(['table', 'alias', 'name']),
  sum: item => ({...item, expression: `${item.table}.${item.name}`}),
  sum100: item => {
    item.expression = `sum(${item.table}.${item.name})/100`
    item.type = 'function'

    return item
  },
  date: item => {
    item.expression = `DATE_FORMAT( ${item.table}.${item.name}, '%Y-%m-%d %H:%i:%S')`
    item.type = 'function'
    return item
  },
  function: item => ({...item, expression: item.expression})
}

const convertSelectAlias = item => {
  if (item.alias) return ({ ...item, alias: `\`${item.alias.trim()}\`` })

  return item
}

const convertSQL = (result, sqlStr) => {
  let values = result.values
  let sql = result.toString()

  sql = sql.replace(/"/g, '')
  let reg = new RegExp('\\$(?!0)\\d{1,3}', 'g')
  sql = sql.replace(reg, m => {
    m = m.substring(1)
    m = Number(m)

    m--
    m = m >= 0
      ? m
      : 0
    return values[m]
  })

  return sql
}

const filterAliasList = ({ joins, main }) => R.compose(
  mapIndexed((item, index) => ({ ...item, alias: `${alias[index].trim()}` })),
  R.flatten,
  R.concat(mapIndexed((i, index) => ([
    {database: i.aDatabase, table: i.aTable},
    {database: i.bDatabase, table: i.bTable}
  ]))(joins))
)(main)

const getAliasList = (joins, database, table) => {
  let aliasList = []
  if (database && table) aliasList.push({ database, table, id: 'main:0' })

  return filterAliasList(({ main: aliasList, joins }))
}

const initSql = ({ database, populate, table, limit, offset, target }) => R.compose(
  R.reduce((acc, item) => {
    if (item.target) item.table = populate(item)
    item = convertSelect[item.type](item)
    item = convertSelectAlias(item)
    acc.alias = populate({ target })

    if (item.table || item.type === 'function') acc.columns.push(item)

    return acc
  }, { type: 'select', database, columns: [], table, limit, offset, target }),
  R.map(R.pick([
    'database',
    'table',
    'type',
    'expression',
    'alias',
    'name',
    'target'
  ]))
)

const isPromise = function (value) {
  if (value !== null && typeof value === 'object') {
    return value && typeof value.then === 'function'
  }
  return false
}

module.exports = {
  parser,
  parserCountSQL
}
