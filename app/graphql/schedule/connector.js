
class Schedule {
  constructor(ctx) {
    this.ctx = ctx
  }
  async findById(report) {
    const res = await this.ctx.model.Schedule
      .findOne({
        report
      })
      .populate('tpl creator editor')
      .populate({
        path: 'report',
        model: 'Report',
        populate: {
          model: 'Meta',
          path: 'metaList'
        }
      })
      .exec()

    return res
  }
}

module.exports = Schedule
