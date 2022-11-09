
class Requirement {
  constructor(ctx) {
    this.ctx = ctx
  }

  async updateRequirement(args) {
    return this.ctx.service.requirement.updateById(args)
  }

  async authorization(user, { authArgs }) {
    const owner = await this.ctx.service.user.findById(authArgs.owner)

    return this.ctx.service.requirement.authorization({
      user,
      owner,
      reportId: authArgs.reportId,
      cname: authArgs.cname
    })
  }
}

module.exports = Requirement
