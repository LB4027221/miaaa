
class Meta {
  constructor(ctx) {
    this.ctx = ctx
  }

  async updateMeta(obj, args) {
    return this.ctx.service.meta.updateByIds(obj, args)
  }
}

module.exports = Meta
