
class Excel {
  constructor(ctx) {
    this.ctx = ctx
  }

  async read(excel) {
    const options = {
      args: [JSON.stringify({
        fileName: excel.title
      })]
    }

    return this.ctx.service.excel.read(options)
  }

  async getAll() {
    return this.ctx.service.excel.getAll()
  }

  async create(user, arg) {
    const options = {
      args: [JSON.stringify({
        title: arg.title,
        data: arg.data
      })]
    }

    return this.ctx.service.excel.create(options, arg, user)
  }
}

module.exports = Excel

