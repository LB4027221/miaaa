const { Controller } = require('egg')

class Sqltrace extends Controller {
  async find() {
    const {
      pageSize, current, reportId, type, startDate, endDate
    } = this.ctx.request.query

    const { list, count } = await this.ctx.service.sqltrace.find({
      pageSize, current, reportId, type, startDate, endDate
    })

    this.ctx.body = {
      success: 1,
      body: {
        list,
        count
      }
    }
  }
}

module.exports = Sqltrace
