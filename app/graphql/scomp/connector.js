class ScompConnector {
  constructor(ctx) {
    this.ctx = ctx
    this.app = ctx.app
  }
  find() {
    return this.ctx.service.scomp.find()
  }

  async create(user, args) {
    const res = await this.ctx.service.scomp.create(args.scomp)
    return {
      success: res
    }
  }

  async edit(user, args) {
    const res = await this.ctx.service.scomp.edit(args.scomp)
    return {
      success: res
    }
  }
}

module.exports = ScompConnector
