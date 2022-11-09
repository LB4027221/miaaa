class Chart {
  constructor(ctx) {
    this.ctx = ctx
  }

  async update({
    reportId, tplId, worksheet, conf
  }) {
    const data = await this.ctx.service.chart.update({
      tpl: tplId,
      worksheet,
      report: reportId,
      ...conf
    })

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

  findOne(ws) {
    // _id = tplId + ws
    const [tplId, worksheet] = ws._id.split(' ')

    return this.ctx.model.Chart
      .findOne({
        tpl: tplId,
        worksheet
      })
      .exec()
  }
  find(ws) {
    // _id = tplId + ws
    const [tplId, worksheet] = ws._id.split(' ')

    return this.ctx.model.Chart
      .find({
        tpl: tplId,
        worksheet
      })
      .exec()
  }

  async findByReport(reportId) {
    const res = await this.ctx.model.Chart
      .find({
        report: reportId
      })
      .populate('tpl')
      .exec()

    return res
  }

  async getRefs(chart) {
    return this.ctx.model.Chart
      .find({
        tpl: chart.tpl._id,
        worksheet: chart.worksheet
      })
      .populate('tpl')
      .exec()
  }

  async findById(chartId) {
    const res = await this.ctx.model.Chart
      .findById(chartId)
      .populate('tpl')
      .exec()

    return res
  }

  async getDataFromCache(chart) {
    const key = `${chart.tpl._id} ${chart.worksheet}`
    const lowdbKey = String(chart.tpl._id)

    if (!this.ctx.app.lowdbCache[lowdbKey]) {
      return []
    }
    const db = await this.ctx.app.lowdbCache[lowdbKey]

    const data = await db
      .get(key)
      .value()
    // console.log(db)

    return (data && data.length) ? data[0] : null
  }
}

module.exports = Chart
