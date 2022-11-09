
class Ext {
  constructor(ctx) {
    this.ctx = ctx
  }

  async findOne(args) {
    return args._id
      ? this.ctx.service.ext.findOneById(args._id)
      : null
  }

  async updateExt(user, data) {
    return this.ctx.service.ext.update({
      ...data,
      editor: user._id
    })
  }
}

module.exports = Ext

