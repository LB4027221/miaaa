const mongoose = require('mongoose')
const R = require('ramda')
const moment = require('moment')

const indexById = R.indexBy(R.prop('_id'))
const tranBack = R.compose(
  R.values,
  R.mergeDeepRight
)

const updateComponents = R.useWith(
  tranBack,
  [indexById, indexById]
)

const { isValid } = mongoose.Types.ObjectId

const testReports = {
  // 行情展示-一批
  '5b3b19835f215220690df185': [{
    _id: '5b3b19835f215220690df185catPm',
    name: '$in',
    show: true,
    column: 'cat_id',
    target: 'a',
    state: 1,
    where: []
  }, {
    _id: '5b3b19835f215220690df185userArea',
    name: '$in',
    show: true,
    column: 'market_area_id',
    target: 'a',
    state: 1,
    where: []
  }],
  // 行情展示-二批
  '5b3b198c5f215220690df188': [{
    _id: '5b3b19835f215220690df185catPm',
    name: '$in',
    show: true,
    column: 'cat_id',
    target: 'a',
    state: 1,
    where: []
  }, {
    _id: '5b3b19835f215220690df185userArea',
    name: '$in',
    show: true,
    column: 'market_area_id',
    target: 'a',
    state: 1,
    where: []
  }],
  // 行情-竞争对手
  '5b3f1994c56d855a05583a27': [{
    _id: '5b3b19835f215220690df185catPm',
    name: '$in',
    show: true,
    column: 'cat_id',
    target: 'a',
    state: 1,
    where: []
  }, {
    _id: '5b3b19835f215220690df185userArea',
    name: '$in',
    show: true,
    column: 'market_area_id',
    target: 'a',
    state: 1,
    where: []
  }],
  // 行情展示-上游产地
  '5b50309bd3b355089ae9c3d3': [{
    _id: '5b3b19835f215220690df185catPm',
    name: '$in',
    show: true,
    column: 'cat_id',
    target: 'a',
    state: 1,
    where: []
  }, {
    _id: '5b3b19835f215220690df185userArea',
    name: '$in',
    show: true,
    column: 'market_area_id',
    target: 'a',
    state: 1,
    where: []
  }]
}

class Report {
  constructor(ctx) {
    this.ctx = ctx
  }

  async find(args) {
    return this.ctx.service.report.find(args)
  }

  async findOne(args) {
    return this.ctx.service.report.findById(args._id, args.count)
  }

  async findByUser(roles) {
    const _roles = roles.map(item => item.roleId)

    if (_roles.includes(500)) {
      return this.ctx.service.report.find()
    }

    const menu = await this.getUserMenu()
    const menuIds = menu
      .filter(item => isValid(item.menuUrl))
      .map(item => item.menuUrl)
    const reports = await this.ctx.service.report.findActiveByIds(menuIds)

    return reports
  }

  async findFeed(obj, args) {
    const columns = this.makeColumns(obj)
    // 临时测试
    let { components: oldComponents } = obj.toObject()
    const testComps = testReports[obj._id]
    if (testComps) {
      oldComponents = [...oldComponents, ...testComps]
    }

    const clearComp = this.clearComponents(oldComponents)
    const components = updateComponents(clearComp, args.components || [])
      .filter(item => item.where)
      .map(item => ({ ...item, where: R.reject(R.or(R.isEmpty, R.isNil), item.where) }))
      .filter(item => item.where.length && !R.isNil(item.where[0]))

    return this.ctx.service.rds.getReportData({
      ...obj.toObject(),
      components,
      columns
    }, args, 'table', this.mapDataSource)
  }

  async findDataFeed(obj, args) {
    const columns = this.makeColumns(obj)
    // 临时测试
    let { components: oldComponents } = obj.toObject()
    const testComps = testReports[obj._id]
    if (testComps) {
      oldComponents = [...oldComponents, ...testComps]
    }

    const clearComp = this.clearComponents(oldComponents)
    const components = updateComponents(clearComp, args.components || [])
      .filter(item => item.where)
      .map(item => ({ ...item, where: R.reject(R.or(R.isEmpty, R.isNil), item.where) }))
      .filter(item => item.where.length && !R.isNil(item.where[0]))

    return this.ctx.service.rds.getReportData({
      ...obj.toObject(),
      components,
      columns
    }, args)
  }

  mapDataSource(table) {
    return {
      data: R.pathOr([], ['data'], table),
      columns: R.pathOr([], ['schema', 'fields'], table)
    }
  }

  async build(obj, args, tpl) {
    const columns = this.makeColumns(obj)
    // 临时测试
    let { components: oldComponents } = obj
    const testComps = testReports[obj._id]
    if (testComps) {
      oldComponents = [...oldComponents, ...testComps]
    }

    const clearComp = this.clearComponents(oldComponents)
    const components = updateComponents(clearComp, args.components || [])
      .filter(item => item.where)
      .map(item => ({ ...item, where: R.reject(R.or(R.isEmpty, R.isNil), item.where) }))
      .filter(item => item.where.length && !R.isNil(item.where[0]))

    return this.ctx.service.rds.buildExcel({
      ...obj,
      components,
      columns
    }, args, tpl)
  }

  async exportExcel(obj, args) {
    const report = await this.findOne(args.excel)
    const { excel } = args
    const columns = this.makeColumns(report)
    const { components: oldComponents } = report.toObject()

    const components = updateComponents(this.clearComponents(oldComponents), excel.components || [])
      .filter(item => item.where)
      .map(item => ({ ...item, where: R.reject(R.or(R.isEmpty, R.isNil), item.where) }))
      .filter(item => item.where.length && !R.isNil(item.where[0]))

    return this.ctx.service.rds.exportExcel({
      ...report.toObject(),
      components,
      columns
    }, excel)
  }

  clearComponents(components) {
    return components
      .map((item) => {
        if (item.name === 'RangePicker') {
          const today = [
            `'${moment().format('YYYY-MM-DD')} 00:00:00'`,
            `'${moment().format('YYYY-MM-DD')} 23:59:59'`
          ]
          const where = item.independent.useToday
            ? today
            : []

          return { ...item, where }
        }
        return item
      })
  }

  findComponents(obj, args) {
    const report = obj.toObject()
    const { name } = args
    if (!name) {
      return report.components
    }
    const { components } = report

    return this
      .clearComponents(components)
      .filter(item => item.show)
      .filter(item => item.name === name)
  }

  findFullComponents(obj) {
    const report = obj.toObject()
    const { components } = report
    return this
      .clearComponents(components)
  }

  async getTotal(obj, args) {
    let { components: oldComponents } = obj.toObject()
    const testComps = testReports[obj._id]
    if (testComps) {
      oldComponents = [...oldComponents, ...testComps]
    }

    const clearComp = this.clearComponents(oldComponents)
    const components = updateComponents(clearComp, args.components || [])
      .filter(item => item.where)
      .map(item => ({ ...item, where: R.reject(R.or(R.isEmpty, R.isNil), item.where) }))
      .filter(item => item.where.length && !R.isNil(item.where[0]))

    return this.ctx.service.rds.getReportCount({
      ...obj.toObject(),
      limit: args.pageSize,
      components
    }, args)
  }

  makeColumns(obj) {
    // 用 id 来作为 index 是为了方便控制后面的每一行
    return obj.metaList
      .map(item => ({
        title: item.alias,
        dataIndex: item._id,
        key: item._id
      }))
  }

  // 这里的逻辑就是先把是 footer 的过滤掉，然后把 footer 的 id 加到 dataIndex 里面
  mapColumns(obj) {
    const isFooter = obj.metaList
      .filter(item => item.double)
      .map(item => item.double)
      .join(',')

    // 用 id 来作为 index 是为了方便控制后面的每一行
    return obj.metaList
      .filter(item => !isFooter.includes([item._id]))
      .map(item => ({
        title: item.alias,
        dataIndex: item.double
          ? `${item._id}.${item.double}`
          : item._id,
        key: item._id
      }))
  }

  async getUserMenu() {
    const user = await this.ctx.service.user.getInfo()
    const menu = await this.ctx.service.gateway.menu(user)

    if (!menu.success) {
      return []
    }

    return menu.response
  }

  async findTabs(obj) {
    const { tabBrothers } = obj
    if (!tabBrothers.length) {
      return []
    }

    return this.ctx.service.report.findAll({
      _id: tabBrothers
    })
  }
}
module.exports = Report
