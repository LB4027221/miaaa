const { Service } = require('egg')


class RecordDayCount extends Service {
  async find() {
    const ret = await this.ctx.model.Recorddaycount.find()
    return ret
  }
}

module.exports = RecordDayCount

