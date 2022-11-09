const R = require('ramda')
const _ = require('lodash')

const RDS_DB = [
  // wz 说没用了，所以移掉
  // {
  //   id: 1,
  //   name: 'cat',
  //   isRealTime: true
  // },
  {
    id: 0,
    name: 'sxc',
    isRealTime: true
  },
  {
    id: 1,
    name: 'sxc_lp',
    isRealTime: true
  },
  {
    id: 2,
    name: 'sxc_collection',
    isRealTime: true
  },
  {
    id: 3,
    name: 'sxc_pc',
    isRealTime: true
  },
  {
    id: 4,
    name: 'sxc_co',
    isRealTime: true
  },
  {
    id: 5,
    name: 'sxc_monitor',
    isRealTime: true
  },
  {
    id: 6,
    name: 'sxc_oc',
    isRealTime: true
  },
  {
    id: 7,
    name: 'sxc_ic',
    isRealTime: true
  },
  {
    id: 8,
    name: 'sxc_org_center',
    isRealTime: true
  },
  {
    id: 9,
    name: 'sxc_price',
    isRealTime: true
  },
  {
    id: 10,
    name: 'sxc_sc',
    isRealTime: true
  },
  {
    id: 11,
    name: 'sxc_tp',
    isRealTime: true
  },
  {
    id: 12,
    name: 'information_schema',
    isRealTime: true
  },
  {
    id: 13,
    name: process.env.NODE_ENV !== 'production' ? 'dw' : 'dw_sec',
    isRealTime: false
  }
]

const filterDataByNames = ({ obj, names = [], data }) => (names.length
  ? R.filter(item => names.includes(item.name))(data)
  : data)
class Database {
  constructor(ctx) {
    this.ctx = ctx
  }

  async getDatabaseList(obj, { database, names, ...args }) {
    const data = [...RDS_DB, {
      id: 14,
      name: 'sxc_behavior',
      isRealTime: true
    }]
    const result = filterDataByNames({ obj, names, data })
    return result
  }

  async getTableList(obj, { database, names }) {
    await this.ctx.service.rds.query(`USE ${database};`, [])
    let tables = await this.ctx.service.rds.query(`show tables FROM ${obj.name}`)
    tables = JSON.parse(JSON.stringify(tables))
    tables = _.map(tables, (value, i) => value[Object.keys(value)[0]])
    // tables = R.map(R.compose(
    //   R.nth(0),
    //   R.values
    // ))(tables[1])
    tables = tables.map((name, id) => ({ name, id }))
    if (!names || !names.length) return R.map(item => ({ ...item, database }))(tables)
    tables = filterDataByNames({ names, data: tables })
    return R.map(item => ({ ...item, database }))(tables)
  }
  async getColumns(obj, { database, table }) {
    let columns = await this.ctx.service.rds.query(`SHOW COLUMNS FROM ${database}.${table}`)

    const mapIndex = R.addIndex(R.map)
    columns = R.compose(
      mapIndex((item, index) => ({ ...item, id: index })),
      R.map(R.compose(
        R.zipObj(['name', 'type']),
        R.values,
        R.pick(['Field', 'Type'])
      ))
    )(columns)

    return (columns)
  }
}
module.exports = Database
