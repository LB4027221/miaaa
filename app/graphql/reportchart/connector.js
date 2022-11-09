const mongoose = require('mongoose')

class Chart {
  constructor(ctx) {
    this.ctx = ctx
  }

  async findByReport(report) {
    const res = await this.ctx.model.ReportChart
      .find({
        report: report._id
      })
      .exec()

    return res.map(i => ({ ...i.toObject(), report }))
  }

  async update({
    reportId, conf
  }) {
    const _id = conf._id || new mongoose.Types.ObjectId()

    const data = await this.ctx.model.ReportChart
      .findOneAndUpdate(
        { _id },
        { ...conf, _id, report: reportId },
        {
          new: true,
          upsert: true
        }
      )
      .exec()

    return {
      success: true,
      data
    }
  }

  async remove({ chartId }) {
    await this.ctx.model.Chart.findOneAndRemove({
      _id: chartId
    })

    return {
      success: true
    }
  }
}

module.exports = Chart
