const { Controller } = require('egg')

class User extends Controller {
  async logout() {
    const { userId } = this.ctx.request.query
    this.ctx.app.lru.get('long').del(this.ctx.sessionId)
    this.ctx.app.lru.get('long').del(`${this.ctx.sessionId}.roles`)
    this.ctx.app.lru.get('long').del(`${this.ctx.sessionId}.menu`)

    const res = await this.ctx.service.gateway.logout(userId)
    this.ctx.body = res
  }
  async getUserList() {
    const userList = await this.ctx.service.user.getUserList()
    this.ctx.body = userList
  }
  async exportExcel() {
    const { id } = this.ctx.request.query

    const [user, report] = await Promise.all([
      this.service.user.getInfo(),
      this.service.report.findById(id)
    ])
    this.ctx.service.process.writeExcel({ user, report })

    this.ctx.body = {
      user, report
    }
  }
}

module.exports = User
