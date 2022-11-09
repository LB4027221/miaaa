/*eslint-disable*/
const R = require('ramda')
const mongoose = require('mongoose')
const hash = require('string-hash')

const { isValid } = mongoose.Types.ObjectId
const indexById = R.indexBy(R.prop('_id'))
const tranBack = R.compose(
  R.values,
  R.mergeDeepRight
)

const updateComponents = R.useWith(
  tranBack,
  [indexById, indexById]
)

const getValues = R.compose(
  R.fromPairs,
  R.map(R.props(['key', 'defaultValue']))
)

class MasterConnector {
  constructor(ctx) {
    this.ctx = ctx
    this.app = ctx.app
  }
  async find() {
    return this.ctx.service.master.find()
  }

  async findOne(args) {
    return this.ctx.service.master.findById(args._id)
  }

  async findByUser(roles) {
    const _roles = roles.map(item => item.roleId)

    if (_roles.includes(500)) {
      return this.ctx.service.master.find()
    }

    const menu = await this.getUserMenu()
    const menuIds = menu
      .filter(item => isValid(item.menuUrl))
      .map(item => item.menuUrl)
    const reports = await this.ctx.service.master.findActiveByIds(menuIds)

    return reports
  }

  async findFeed(obj, args) {
    const columns = await this.makeColumns(obj)
    const { components: oldComponents } = obj.toObject()

    const components = updateComponents(oldComponents, args.components || [])

    const { current, pageSize } = args
    const SQL = this.getSQL(obj, components, current, pageSize)

    return this.ctx.service.rds.getMasterData({
      ...obj.toObject(),
      components,
      SQL,
      columns
    }, args)
  }

  async updateRequirement(obj, args) {
    const { _id, data } = args
    const master = await this.ctx.service.master.findById(_id)
    const keys = R.keys(data)
    keys.forEach(key => {
      master[key] = data[key]
    })
    let ret = await this.ctx.service.master.save(master)
    return ret

  }

  async exportExcel(obj, args) {
    const report = await this.ctx.service.master.findById(args.excel._id)
    const { excel } = args
    const { components: oldComponents } = report.toObject()

    const components = updateComponents(oldComponents, excel.components || [])
    const current = 1
    const pageSize = 3000000
    const SQL = this.getSQL(report, components, current, pageSize)

    return this.ctx.service.rds.exportMasterExcel(report, SQL, excel)
  }

  findComponents(obj, args) {
    const report = obj.toObject()
    const { name } = args
    const { components } = report
    return components
      .reduce((acc, item) => {
        const exist = acc.filter(i => i.key === item.key)
        if (!exist.length) {
          return [...acc, item]
        }
        return acc
      }, [])
      .filter(item => item.name === name)
      .map(item => ({ ...item, where: [item.defaultValue] }))
  }

  async getTotal(obj, args) {
    const { components: oldComponents } = obj.toObject()

    const components = updateComponents(oldComponents, args.components || [])

    const SQL = this.getCountSQL(obj, components)

    return this.ctx.service.rds.getMasterCount({
      ...obj.toObject(),
      SQL,
      components
    }, args)
  }

  // 现在暂时先直接用 SQL 获取到 column
  async makeColumns(obj) {
    const { components } = obj.toObject()
    const current = 1
    const pageSize = 1
    const args = {
      current,
      pageSize
    }

    const SQL = this.getSQL(obj, components, current, pageSize)

    const res = await this.ctx.service.rds.getMasterColumn({
      ...obj.toObject(),
      SQL
    }, args)

    return res.length
      ? R.keys(res[0])
        .map((item, index) => ({
          title: item,
          dataIndex: hash(`${item}${index}`),
          key: `${index}`,
          name: item
        }))
      : []
  }

  async getUserMenu() {
    const user = await this.ctx.service.user.getInfo()
    const menu = await this.ctx.service.gateway.menu(user)

    if (!menu.success) {
      return []
    }

    return menu.response
  }

  getCountSQL(obj, components) {
    const { countSQL } = obj
    const values = getValues(components)
    const su = { ...values }

    return this.parse(countSQL, su)
  }

  getSQL(obj, components, current, pageSize) {
    const SQL = `${obj.SQL} LIMIT :limit`
    const values = getValues(components)

    const offset = (current - 1) * pageSize
    const limit = `${offset},${pageSize}`
    const su = { ...values, limit }

    return this.parse(SQL, su)
  }

  parse(SQL, values) {
    return SQL.replace(/\:(\w+)/g, (txt, key) => {
      if (values[key]) {
        return values[key]
      }
      return txt
    })
  }
}

module.exports = MasterConnector
