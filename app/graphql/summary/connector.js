const mongoose = require('mongoose')
const R = require('ramda')
const moment = require('moment')

const { isValid } = mongoose.Types.ObjectId

const testReports = {
  // 行情展示-一批
  '5b3b19835f215220690df185': [1],
  // 行情展示-二批
  '5b3b198c5f215220690df188': [2],
  // 行情-竞争对手
  '5b3f1994c56d855a05583a27': [3],
  // 行情展示-上游产地
  '5b50309bd3b355089ae9c3d3': [4]
}

const dw = process.env.NODE_ENV === 'production'
  ? 'dw_sec'
  : 'dw'

// 从数据库里面拉两个字段，第一个字段作为写入的值
// 第二个字段作为展示的值
const userArea = {
  name: 'userArea',
  sql: `SELECT a.market_area_id, a.market_area_name
    FROM ${dw}.dimen_market_area a
    WHERE a.area_type = ?
      AND a.city_code in (?)
  `
}
// 品类维度测试
const SalerCat = {
  name: 'SalerCatComp',
  sql: `
    SELECT b.category_id, b.category_name FROM sxc.sxc_sales_category_group_relation a
    INNER JOIN sxc.sxc_category_group_relation b on b.category_group_id = a.category_group_id 
    WHERE a.sales_id = ?
  `
}
// 城市维度测试
const SalerCity = {
  name: 'SalerCityComp',
  sql: `
    SELECT a.code, a.name
    From sxc.sxc_region a
    WHERE a.code in (?)
  `
}
// 服务站
const StoreHouse = {
  name: 'StoreHouseSQL',
  sql: `
    SELECT
    a.pickhouse_id, ( GROUP_CONCAT(DISTINCT a.pickhouse_name) ) as '服务站'
    FROM sxc.saler_pickhouse_relation a
    WHERE a.state = 1
    and a.user_id = ?
    GROUP BY a.pickhouse_id 
  `
}

const indexById = R.indexBy(R.prop('_id'))

const makeComp = ({
  _id,
  where,
  labels,
  options,
  name,
  placeholder
}) => {
  const independent = {
    __typename: 'Component',
    placeholder,
    labels,
    options
  }

  const comp = {
    _id,
    name,
    where,
    independent
  }

  return comp
}

const getLabels = R.map(R.compose(
  R.last,
  R.values
))
const getOptions = R.map(R.compose(
  R.head,
  R.values
))

const roleType = {
  10: 'warden',
  14: 'manager',
  11: 'cityManager',
  9: 'saler',
  12: 'saler'
}

class Summary {
  constructor(ctx) {
    this.ctx = ctx
  }

  async findByUser(user, args) {
    const { reportId } = args
    const menu = await this.ctx.service.user.getUserMenu(user)
    const _menu = menu
      .map(i => i.menuUrl)
      .filter(isValid)
    this._id = _menu

    if (reportId) {
      return this.ctx.service.report.findAll({ _id: reportId })
    }

    const _id = _menu
    const { tags, usedOn } = args

    return this.ctx.service.report.findAll({ tags, usedOn, _id })
  }

  async findSummaryChildren(summary) {
    const { child } = summary.toObject()
    if (!child) return null

    const tabs = [child, ...child.tabBrothers]
    const hasEdited = tabs
      .filter(item => this._id.includes(item._id))
      .length > 0

    return hasEdited
      ? tabs.filter(item => this._id.includes(item._id))
      : tabs
  }

  makeSSomp(components, args, scomps) {
    const _scomps = indexById(scomps)

    return components
      .map(item =>
        (item.source && _scomps[item.source] ? this.fetchSScomp(item, args, _scomps[item.source]) : item))
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

  async findComponents(report, args) {
    const { name, user } = args
    if (!name) {
      return report.components
    }
    const { components } = report

    const _comp = this
      .clearComponents(components)
      .filter(item => item.show)
      .filter(item => item.name === name)
      .filter(item =>
        !item.roles.length
        || (roleType[user.userType] && item.roles.includes(roleType[user.userType])))
    const scomps = await this.ctx.service.scomp.findCacheFirst()
    const res = await Promise.all(this.makeSSomp(_comp, args, scomps))

    return res
  }

  makeColumns(obj) {
    // 用 id 来作为 index 是为了方便控制后面的每一行
    return obj.metaList.map(item => ({
      title: item.alias,
      dataIndex: item._id,
      key: item._id
    }))
  }

  async findDataSource(obj) {
    const columns = this.makeColumns(obj)
    const report = obj.toObject()
    const { components: oldComponents } = report
    const components = this.clearComponents(oldComponents)
      .filter(item => item.where)
      .map(item => ({ ...item, where: R.reject(R.or(R.isEmpty, R.isNil), item.where) }))
      .filter(item => item.where.length && !R.isNil(item.where[0]))

    const res = (!report.tags.includes('rukou')
      ? await this.ctx.service.rds.getReportData({
        ...report,
        limit: 1,
        components,
        columns
      }, { pageSize: 1, current: 1 })
      : [])

    const row = res && res.length ? res[0].row : []

    return columns.map((item) => {
      const cell = row.filter(r => r.column === item.dataIndex).length
        ? row.filter(r => r.column === item.dataIndex)[0]
        : {}

      return {
        title: item.title,
        value: cell.value || null,
        id: cell.id || item.id
      }
    })
  }

  // 临时用的
  async getCat(obj, args) {
    if (!testReports[obj._id]) {
      return []
    }

    const { user } = args

    if (user.catPm) {
      const data = await this.ctx.service.user.catPm(user)
      const labels = getLabels(data)
      const options = getOptions(data)
      const _id = `${obj._id}catPm`
      const name = 'catPmComp'
      const where = options
      const placeholder = '品类'
      const comp = makeComp({
        _id,
        where,
        labels,
        options,
        placeholder,
        name
      })
      // 之所以用数组是为了前端代码少写判断
      return [comp]
    }

    const data = await this.ctx.service.rds.makeSql({
      ...SalerCat,
      values: [user.userId]
    })

    const labels = getLabels(data)
    const options = getOptions(data)
    const _id = `${obj._id}catPm`
    const name = 'catPmComp'
    const where = options
    const placeholder = '品类'
    const comp = makeComp({
      _id,
      where,
      labels,
      options,
      placeholder,
      name
    })
    // 之所以用数组是为了前端代码少写判断
    return [comp]
  }

  // 临时用的
  async getCity(obj, args) {
    if (!testReports[obj._id]) {
      return []
    }

    const { user } = args
    const cities = user.cityList && user.cityList.length
      ? user.cityList.map(i => i.cityCode)
      : [user.cityCode]

    if (user.cityList && user.cityList.length) {
      const data = user.cityList
      const labels = getLabels(data)
      const options = getOptions(data)
      const _id = `${obj._id}userCity`
      const name = 'userCityComp'
      const where = options
      const placeholder = '城市'
      const comp = makeComp({
        _id,
        where,
        labels,
        options,
        placeholder,
        name
      })
      // 之所以用数组是为了前端代码少写判断
      return [comp]
    }

    const data = await this.ctx.service.rds.makeSql({
      ...SalerCity,
      values: cities.join(',')
    })

    const labels = getLabels(data)
    const options = getOptions(data)
    const _id = `${obj._id}userCity`
    const name = 'userCityComp'
    const where = options
    const placeholder = '城市'
    const comp = makeComp({
      _id,
      where,
      labels,
      options,
      placeholder,
      name
    })
    // 之所以用数组是为了前端代码少写判断
    return [comp]
  }
  // pickHouses
  async getPickHouse(obj, args) {
    if (!obj.pickHouse) {
      return []
    }

    const { user } = args
    const data = await this.ctx.service.rds.makeSql({
      ...StoreHouse,
      values: [user.userId]
    })

    const labels = getLabels(data)
    const options = getOptions(data)
    const _id = `${obj._id}pickHouse`
    const name = 'userPickHouseComp'
    const where = options
    const placeholder = '服务站'
    const comp = makeComp({
      _id,
      where,
      labels,
      options,
      placeholder,
      name
    })
    // 之所以用数组是为了前端代码少写判断
    return [comp]
  }

  async getBusiness(obj, args) {
    const { user } = args
    const testVal = testReports[obj._id]
    if (!testVal) {
      return []
    }

    const city = user.cityList && user.cityList.length
      ? user.cityList.map(i => i.cityCode)
      : [user.cityCode]

    if (user.cityList && user.cityList.length) {
      const sql = cities => `SELECT a.market_area_id, a.market_area_name
        FROM ${dw}.dimen_market_area a
        WHERE a.area_type = ${testVal}
          AND a.city_code in (${cities})
      `
      const data = await this.ctx.service.rds.query(sql(city.join(',')))
      const labels = getLabels(data)
      const options = getOptions(data)
      const _id = `${obj._id}userArea`
      const name = 'userAreaComp'
      const where = options
      const placeholder = '区域'
      const comp = makeComp({
        _id,
        where,
        labels,
        options,
        placeholder,
        name
      })
      // 之所以用数组是为了前端代码少写判断
      return [comp]
    }


    const data = await this.ctx.service.rds.makeSql({
      ...userArea,
      values: [
        ...testVal,
        city.join(',')
      ]
    })

    const labels = getLabels(data)
    const options = getOptions(data)
    const _id = `${obj._id}userArea`
    const name = 'userAreaComp'
    const where = options
    const placeholder = '区域'
    const comp = makeComp({
      _id,
      where,
      labels,
      options,
      placeholder,
      name
    })
    // 之所以用数组是为了前端代码少写判断
    return [comp]
  }

  async fetchSScomp(_comp, args, scomp) {
    const { user } = args
    const { sourceKey } = _comp
    const val = sourceKey
      ? user[sourceKey] || ''
      : ''

    const data = await this.ctx.service.rds.makeSql({
      ...scomp,
      values: [
        val
      ]
    })

    const labels = getLabels(data)
    const options = getOptions(data)
    const where = options
    const placeholder = _comp.independent.placeholder
    const comp = makeComp({
      ..._comp,
      where,
      labels,
      options,
      placeholder
    })
    // 之所以用数组是为了前端代码少写判断
    return comp
  }
}

module.exports = Summary
