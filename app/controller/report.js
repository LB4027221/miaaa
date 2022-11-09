const { Controller } = require('egg')
const R = require('ramda')
const mongoose = require('mongoose')

const { isValid } = mongoose.Types.ObjectId

module.exports = app => class Report extends Controller {
  async updateReport(ctx, next) {
    const { body } = ctx.request
    const { _id } = ctx.params
    const { _id: editor } = ctx.user._doc
    let reportInDB = await this.service.report.findById(_id)

    if (!reportInDB) return (ctx.body = { success: 0, msg: '没有这个报表' })
    // 修改报表上下线
    if (body.online !== undefined) {
      if (body.online) {
        reportInDB.status = 3
      } else {
        reportInDB.status = 4
      }

      reportInDB.editor = editor

      await reportInDB.save()

      return (ctx.body = { success: 1 })
    }
    let { report, metaList } = body
    const updateMeta = R.map(async (item) => {
      let meta = await this.service.meta.updateById(item)
      return meta._id
    })
    try {
      metaList = await Promise.all(updateMeta(metaList))
      reportInDB.metaList = metaList

      reportInDB.components = R.map(R.pick([
        'target',
        'column',
        'where',
        'appEntry',
        'independent',
        'show',
        'name',
        'label'
      ]))(report.components)
      reportInDB.groupBy = R.map(R.pick([
        'target',
        'column'
      ]))(report.groupBy)

      // reportInDB.groupByComponents = R.map(R.pick([
      //   'options',
      //   'value',
      //   'text'
      // ]))(report.groupByComponents)

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

      reportInDB.name = report.name
      reportInDB.alias = report.alias
      reportInDB.cname = report.cname
      reportInDB.target = report.target
      reportInDB.expJoin = report.expJoin
      reportInDB.table = report.name
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
      let { tabBrothers } = report
      if (tabBrothers && tabBrothers.length) {
        reportInDB.tabBrothers = tabBrothers.filter(isValid)

        let _tabBrothers = tabBrothers.map(async (tab) => {
          let _report = await this.service.report.findById(tab)
          _report.tabBrothers = tabBrothers.filter(item => item !== tab)
          _report.tabBrothers.push(reportInDB._id)
          _report.tags = ['detailTab']

          await this.ctx.service.report.updateOne(_report)
        })

        await Promise.all(_tabBrothers)
      } else {
        reportInDB.tabBrothers = []
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
      await this.ctx.service.report.updateOne(reportInDB)
      ctx.body = {
        success: 1,
        body: reportInDB
      }
    } catch (e) {
      console.error('更新报表错误', e)
      ctx.body = {
        success: 0,
        msg: '更新报表时发生错误了'
      }
    }
  }
  async copy(ctx, next) {
    const { reportId } = ctx.query
    const user = await this.service.user.getInfo()
    if (!user) {
      return (ctx.body = { success: 0, msg: '请先登录' })
    }

    let report = await this.ctx.service.report.findById(reportId)
    let reportClone = Object.assign({}, report.toObject())
    reportClone = R.compose(
      R.dissoc('_id'),
      R.dissoc('createAt'),
      R.dissoc('updateAt'),
      R.clone
    )(reportClone)
    reportClone.cname = `${reportClone.cname}-${Date.now()}`
    let { metaList } = reportClone
    reportClone = await this.ctx.service.report.create(reportClone)
    metaList = metaList.map(async (metaId) => {
      let meta = await this.ctx.service.meta.findById(metaId)
      let metaClone = Object.assign({}, meta.toObject())
      metaClone = R.compose(
        R.dissoc('_id'),
        R.dissoc('createAt'),
        R.dissoc('updateAt'),
        R.clone
      )(metaClone)
      metaClone.report = reportClone._id
      metaClone = await this.ctx.service.meta.create(metaClone)
      return metaClone._id
    })
    metaList = await Promise.all(metaList)
    reportClone.metaList = metaList
    reportClone = await this.ctx.service.report.save(reportClone)
    ctx.body = {
      success: 1,
      body: {
        _id: reportClone._id
      }
    }
  }
  async findList(ctx, next) {
    let report = await this.ctx.service.report.findList()
    ctx.body = {
      success: 1,
      body: {
        list: report
      }
    }
  }
}
