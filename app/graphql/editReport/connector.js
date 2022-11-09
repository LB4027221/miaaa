const R = require('ramda')
const mongoose = require('mongoose')

const { isValid } = mongoose.Types.ObjectId

class EditReportConnector {
  constructor(ctx) {
    this.ctx = ctx
    this.app = ctx.app
  }

  async toggleOnline(user, args) {
    const { reportId } = args
    const res = await this.ctx.service.report.toggleOnline(reportId)

    return {
      success: res,
      errorMessage: ''
    }
  }

  async edit(user, data) {
    const { _id: editor } = user
    const { _id } = data
    let reportInDB = await this.ctx.service.report.findById(_id)
    if (!reportInDB) return { success: 0, errorMessage: '没有这个报表' }
    let { report } = data
    let { metaList } = report
    const updateMeta = R.map(async (item) => {
      let meta = await this.ctx.service.meta.updateById(item)
      return meta._id
    })
    try {
      metaList = await Promise.all(updateMeta(metaList))
      const oldTabs = reportInDB.tabBrothers.filter(item => item)
      reportInDB.metaList = metaList
      reportInDB.components = R.map(R.pick([
        'target',
        'column',
        'where',
        'appEntry',
        'independent',
        'show',
        'name',
        'label',
        'source',
        'sourceKey',
        'roles'
      ]))(report.components)
      reportInDB.groupBy = R.map(R.pick([
        'target',
        'column'
      ]))(report.groupBy)

      reportInDB.joins = R.map(R.pick([
        'type',
        'leftTarget',
        'leftColumn',
        'rightTarget',
        'rightColumn'
      ]))(report.joins)

      reportInDB.targets = R.map(R.pick([
        'key',
        'database',
        'table',
        'alias'
      ]))(report.targets)

      reportInDB.orderBy = R.map(R.pick([
        'target',
        'column',
        'type'
      ]))(report.orderBy)

      reportInDB.databaseArr = report.databaseArr
      reportInDB.database = report.database
      reportInDB.updateAt = Date.now()

      reportInDB.name = report.name
      reportInDB.alias = report.alias
      reportInDB.cname = report.cname
      reportInDB.target = report.target
      reportInDB.expJoin = report.expJoin
      reportInDB.table = report.name
      reportInDB.pickHouse = report.pickHouse
      reportInDB.tabBrothers = report.tabBrothers
      reportInDB.having = report.having
      if (!report.child) {
        reportInDB.child = null
      } else if (isValid(report.child._id)) {
        reportInDB.child = report.child._id
      }

      if (!report.friend) {
        reportInDB.friend = null
      } else if (isValid(report.friend._id)) {
        reportInDB.friend = report.friend._id
      }

      reportInDB.usedOn = report.usedOn
      reportInDB.restApi = report.restApi
      reportInDB.optGroupBy = report.optGroupBy
      reportInDB.isRealTime = report.isRealTime
      reportInDB.tags = report.tags
      reportInDB.regionComponent = report.regionComponent
      reportInDB.status = 3
      reportInDB.limit = R.type(report.limit) === 'Number'
        ? report.limit
        : 15

      if (report.sort) {
        reportInDB.sort = Number(report.sort)
      }

      reportInDB.editor = editor
      const result = await this.ctx.service.report.updateOne(reportInDB, editor)
      this.ctx.service.gateway.createMenu({
        menuUrl: _id,
        menuName: reportInDB.cname
      })
      return {
        success: true,
        result: {
          ...result.toObject(),
          oldTabs
        }
      }
    } catch (e) {
      console.error('更新报表错误', e)
      return {
        success: false,
        errorMessage: '更新报表时发生错误了'
      }
    }
  }
  // 这里李恒你来写，照着下面的改
  editMeta() {
    return true
  }
  async editTabs(obj, args) {
    const { result } = obj
    const { report } = args
    const user = await this.ctx.service.user.getInfo()
    if (result) {
      let { tabBrothers } = report

      result.tabBrothers = tabBrothers.filter(isValid)
      // 第一步先把原先的所有关联清除
      const cleanTask = result.oldTabs.map(async (tab) => {
        let _report = await this.ctx.service.report.findOneById(tab)
        _report.tabBrothers = []
        _report.editor = user._id

        await this.ctx.service.report.updateOne(_report)
      })

      await Promise.all(cleanTask)

      let _tabBrothers = tabBrothers.map(async (tab) => {
        let _report = await this.ctx.service.report.findOneById(tab)
        const tabs = tabBrothers.filter(item => item !== tab)
        _report.tabBrothers = [...tabs, result._id]
        _report.tags = ['detailTab']
        _report.editor = user._id

        await this.ctx.service.report.updateOne(_report)
      })

      return Promise.all(_tabBrothers)
    }

    return []
  }
}

module.exports = EditReportConnector
