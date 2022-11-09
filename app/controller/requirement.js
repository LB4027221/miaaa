const { Controller } = require('egg')

class Requirement extends Controller {
  async add() {
    const [user, report] = await Promise.all([
      this.service.user.getInfo(),
      this.service.report.findByCname()
    ])

    if (report) {
      this.ctx.throw(422, 'Unprocessable Entity', {
        errors: [{
          message: '报表已存在'
        }]
      })
    }

    await this.ctx.service.report.add(user, this.ctx.request.body)
    this.ctx.body = {
      success: 1,
      msg: '需求提交完成'
    }
  }
}

module.exports = Requirement
