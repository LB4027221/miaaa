const { Service } = require('egg')
const _ = require('lodash')
const R = require('ramda')

const cmp = (x, y) => String(x._id) === String(y._id)

class Record extends Service {
  async find({ query, pageSize, current }) {
    const list = await this.ctx.model.Record.find(query)
      .populate('user', 'userName')
      .populate('report', 'cname')
      .sort({ _id: -1 })
      .limit(Number(pageSize))
      .skip(pageSize * (current - 1))
    return list
  }
  async count(options) {
    const ret = await this.ctx.model.Record.count(options)
    return ret
  }

  async getRankingList(match) {
    let list = await this.ctx.model.Record.aggregate([{
      $match: match
    }, {
      $group: {
        _id: '$user',
        count: {
          $sum: 1
        }
      }
    }])
      .sort(({ count: -1 }))
      .lookup({
        from: 'users', localField: '_id', foreignField: '_id', as: 'user'
      })
    list = _.filter(list, (o) => {
      o.user = o.user[0] && o.user[0].userName
      return o._id != null
    })
    return list
  }
  async getRecordSort({
    match, user, report, pageSize, current
  }) {
    let group = {}
    let lookup = {}
    if (user) {
      group = {
        _id: '$report',
        count: {
          $sum: 1
        }
      }
      lookup = {
        from: 'reports', localField: '_id', foreignField: '_id', as: 'report'
      }
    }
    if (report) {
      group = {
        _id: '$user',
        count: {
          $sum: 1
        }
      }
      lookup = {
        from: 'users', localField: '_id', foreignField: '_id', as: 'user'
      }
    }
    if (!user && !report) {
      delete match.report
      group = {
        _id: '$report',
        count: {
          $sum: 1
        }
      }
      lookup = {
        from: 'reports', localField: '_id', foreignField: '_id', as: 'report'
      }
    }
    let list = await this.ctx.model.Record.aggregate([{
      $match: match
    }, {
      $group: group
    }])
      .sort({ count: -1 })
      .lookup(lookup)
      .skip(pageSize * (current - 1))
      .limit(Number(pageSize))
    let count = await this.ctx.model.Record.aggregate([{
      $match: match
    }, {
      $group: group
    }])
      .sort({ count: -1 })
    const reportList = await this.ctx.model.Report.find({
      status: {
        $ne: 4
      }
    }).select('_id cname tags')
    const noHandlesReports = R.differenceWith(cmp, reportList, count)
    const length = count.length
    return { list, count: length, noHandlesReports }
  }
}

module.exports = Record

