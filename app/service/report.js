const { Service } = require('egg')
const R = require('ramda')
const moment = require('moment')

const addIn = (num, key, obj) => ({
  $in: obj[key]
})

class Report extends Service {
  find(args = {}) {
    const q = R.compose(
      R.mapObjIndexed(addIn),
      R.filter(item => item && !R.isEmpty(item))
    )(args)

    return this.ctx.model.Report
      .find(q)
      .populate('metaList user editor child friend')
  }

  findAll(args = {}) {
    const q = R.compose(
      R.mapObjIndexed(addIn),
      R.filter(item => item && !R.isEmpty(item))
    )(args)

    return this.ctx.model.Report
      .find({
        ...q,
        status: { $ne: 4 }
      })
      .populate('metaList')
      .populate({
        path: 'child',
        select: '_id cname components alias metaList',
        populate: {
          path: 'tabBrothers',
          select: 'alias _id cname components metaList'
        }
      })
  }

  findAllLoader(q) {
    return this.ctx.model.Report
      .find({
        ...q,
        status: { $ne: 4 }
      })
      .populate('metaList')
      .populate({
        path: 'child',
        select: '_id cname components alias metaList',
        populate: {
          path: 'tabBrothers',
          select: 'alias _id cname components metaList'
        }
      })
  }

  async toggleOnline(_id) {
    const report = await this.ctx.model.Report
      .findById(_id)
      .select('status _id')

    const status = report.status === 4
      ? 3
      : 4
    return this.ctx.model.Report
      .findByIdAndUpdate(_id, {
        status
      })
  }

  findById(_id, count) {
    const ret = this.ctx.model.Report
      .findById(_id)
      .populate('metaList editor child friend')
      .exec()
    if (count) {
      const accessDate = moment(Date.now()).format('YYYY-MM-DD')
      const user = this.ctx.service.user.getInfo()
      const reportCount = this.ctx.model.Recorddaycount.findOne({
        date: accessDate
      })
      const search = [ret, user, reportCount]
      Promise.all(search).then(([retR, retU, reportCount]) => {
        let data = {
          user: retU._id,
          report: retR._id,
          actionType: 1
        }
        if (!reportCount) {
          reportCount = this.ctx.model.Recorddaycount({
            date: accessDate,
            accessCount: 0,
            exportCount: 0
          })
        }
        reportCount.accessCount++

        const newRecord = this.ctx.model.Record(data)
        newRecord.save()
        reportCount.save()
      })
    }
    return ret
  }
  findOneById(_id) {
    return this.ctx.model.Report
      .findById(_id)
  }

  findByIds(ids) {
    return this.ctx.model.Report
      .find({
        _id: { $in: ids },
        status: { $ne: 4 }
      })
      .populate('metaList user editor')
  }

  findActiveByIds(ids) {
    return this.ctx.model.Report
      .find({
        _id: { $in: ids },
        status: 3
      })
      .populate('metaList user editor')
  }
  findList() {
    return this.ctx.model.Report.find().select('_id cname')
  }

  findByCname() {
    const {
      reportName: cname
    } = this.ctx.request.body

    return this.ctx.model.Report.findOne({ cname }).exec()
  }

  async updateOne(report, editor) {
    const ret = report.save()
    if (editor) {
      let record = this.ctx.model.Record({
        user: editor,
        report: report._id,
        actionType: 3
      })
      record.save()
    }
    return ret
  }
  async create(report) {
    let reportclone = this.ctx.model.Report(report)
    return reportclone
  }
  async count() {
    const ret = await this.ctx.model.Report.count()
    return ret
  }
  async save(report) {
    let reportclone = await report.save()
    return reportclone
  }

  async add(user, {
    reportName,
    tablefields,
    remarks,
    isRealTime
  }) {
    const metaList = await Promise.all(this.insertMeta(tablefields, user))
    const report = this.ctx.model.Report({
      cname: reportName,
      components: [],
      remarks,
      isRealTime,
      metaList,
      user: user._id,
      endUserId: user.userId
    })

    let ret = await report.save()
    let recordData = {
      user: ret.user,
      report: ret._id,
      actionType: 2
    }
    let record = this.ctx.model.Record(recordData)
    record.save()
  }

  insertMeta(metaList, user) {
    return metaList.map(async (item) => {
      const meta = this.ctx.model.Meta({
        alias: item.alias,
        endUserId: user.userId,
        annotate: item.annotate
      })

      await meta.save()

      return meta._id
    })
  }
}

module.exports = Report

