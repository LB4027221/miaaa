const { Service } = require('egg')
const moment = require('moment')
const _ = require('lodash')

class Sqltrace extends Service {
  async addTrace({
    startTime, endTime, state, SQL, report, type
  }) {
    const durationTime = Number(endTime) - Number(startTime)
    let sqlcount = null
    if (Number(state)) {
      let traceCount = await this.ctx.model.Sqlcount.findOne({
        reportId: report._id,
        type: Number(type)
      })
      if (traceCount) {
        // eslint-disable-next-line
        const averageTime = ((traceCount.count * traceCount.averageTime) + durationTime) / ++traceCount.count
        traceCount.averageTime = Math.round(averageTime * 100) / 100
      } else {
        traceCount = await this.ctx.model.Sqlcount({
          reportId: report._id,
          count: 1,
          averageTime: durationTime,
          type
        })
      }
      let count = await traceCount.save()
      sqlcount = count._id
    }
    const trace = await this.ctx.model.Sqltrace({
      opratorTime: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
      durationTime,
      state,
      type,
      sql: SQL,
      reportId: report._id,
      reportName: report.cname,
      sqlcount
    })
    await trace.save()
  }
  async find({
    pageSize, current, reportId, type, startDate, endDate
  }) {
    let condition = {}
    if (startDate && endDate) {
      condition.opratorTime = {
        $gte: moment(startDate, 'YYYY/MM/DD').startOf('day'),
        $lte: moment(endDate, 'YYYY/MM/DD').endOf('day')
      }
    }
    if (reportId) {
      condition.reportId = reportId
    }
    if (type) {
      condition.type = type
    }
    let list = await this.ctx.model.Sqltrace.find(condition)
      .populate('sqlcount')
      .sort({ _id: -1 })
      .limit(Number(pageSize))
      .skip(pageSize * (current - 1))
    let count = await this.ctx.model.Sqltrace.count(condition)
    list = _.map(list, (d) => {
      d = d.toObject()
      if (d.sqlcount) {
        d.averageTime = d.sqlcount.averageTime
        d.key = d._id
      }
      return d
    })
    return { list, count }
  }
}
module.exports = Sqltrace

