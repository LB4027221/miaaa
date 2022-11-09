const { Controller } = require('egg')
const moment = require('moment')
const _ = require('lodash')
const mongoose = require('mongoose')

class Record extends Controller {
  async RecordDayCount() {
    const RecordDayCount = await this.ctx.service.recordDayCount.find()
    this.ctx.body = {
      success: 1,
      body: RecordDayCount
    }
  }
  async statistic() {
    const reportCount = this.ctx.service.report.count()
    const createCount = this.ctx.service.record.count({
      createAt: {
        $gte: moment().startOf('month'),
        $lte: moment().endOf('month')
      },
      actionType: 2
    })
    const updateCount = this.ctx.service.record.count({
      createAt: {
        $gte: moment().startOf('month'),
        $lte: moment().endOf('month')
      },
      actionType: 3
    })
    const allExportCount = this.ctx.service.record.count({
      actionType: 4
    })
    let search = [reportCount, createCount, updateCount, allExportCount]
    // eslint-disable-next-line
    let [retReportCount, retCreateCount, retUpdateCount, retAllExportCount] = await Promise.all(search)
    this.ctx.body = {
      success: 1,
      body: [
        retReportCount,
        retCreateCount,
        retUpdateCount,
        retAllExportCount
      ]
    }
  }
  async findList() {
    const {
      pageSize, current, startDate, endDate, actionType, userId, reportId
    } = this.ctx.request.query
    let query = {
      actionType: {
        $in: [1, 4]
      }
    }
    if (startDate && endDate) {
      query.createAt = {
        $gte: moment(startDate, 'YYYY/MM/DD').startOf('day'),
        $lte: moment(endDate, 'YYYY/MM/DD').endOf('day')
      }
    }
    if (!actionType || Number(actionType) === 0) {
      query.actionType = {
        $in: [1, 4]
      }
    } else {
      query.actionType = Number(actionType)
    }
    if (userId) {
      query.user = userId
    }
    if (reportId) {
      query.report = reportId
    }
    const actionTypeMap = ['', '查询', '创建', '更新', '导出']
    let list = await this.ctx.service.record.find({ query, pageSize, current })
    let count = await this.ctx.service.record.count(query)
    list = _.filter(list, item => item.report != null)
    list = _.map(list, item => ({
      actionType: item.actionType,
      actionName: actionTypeMap[item.actionType],
      time: moment(item.createAt).format('YYYY-MM-DD HH:mm:ss'),
      reportName: item.report.cname,
      userName: item.user.userName,
      count: item.count ? item.count : '-',
      key: item._id,
      reportId: item.report._id,
      remarks: item.report.remarks
    }))
    this.ctx.body = {
      success: 1,
      body: {
        list,
        count
      }
    }
  }
  async getRankingList() {
    const { startDate, endDate, actionType } = this.ctx.request.query
    let match = {}
    if (startDate && endDate) {
      match.createAt = {
        $gte: new Date(moment(startDate, 'YYYY/MM/DD').startOf('day')),
        $lte: new Date(moment(endDate, 'YYYY/MM/DD').endOf('day'))
      }
    }
    if (!actionType || Number(actionType) === 0) {
      match.actionType = { $in: [1, 4] }
    } else {
      match.actionType = Number(actionType)
    }
    let list = await this.ctx.service.record.getRankingList(match)
    this.ctx.body = {
      success: 1,
      body: list
    }
  }
  async getRecordSort() {
    const {
      pageSize, current, startDate, endDate, actionType, userId, reportId
    } = this.ctx.request.query
    let query = {
      actionType: {
        $in: [1, 4]
      }
    }

    if (startDate && endDate) {
      query.createAt = {
        $gte: moment(startDate, 'YYYY/MM/DD').startOf('day').toDate(),
        $lte: moment(endDate, 'YYYY/MM/DD').endOf('day').toDate()
      }
    }
    if (!actionType || Number(actionType) === 0) {
      query.actionType = {
        $in: [1, 4]
      }
    } else {
      query.actionType = Number(actionType)
    }
    if (userId) {
      query.user = mongoose.Types.ObjectId(userId)
    }
    if (reportId) {
      query.report = mongoose.Types.ObjectId(reportId)
    }
    // query pageSize, current
    // eslint-disable-next-line
    let { list, count, noHandlesReports } = await this.ctx.service.record.getRecordSort({ match: query, user: userId, report: reportId, pageSize, current})
    this.ctx.body = {
      success: 1,
      body: {
        list,
        count,
        noHandlesReports
      }
    }
  }
}


module.exports = Record
