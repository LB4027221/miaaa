const { Service } = require('egg')
const mongoose = require('mongoose')

class Requirement extends Service {
  updateMeta(_id, metaList) {
    return this.ctx.model.Report.findOneAndUpdate(
      { _id },
      { metaList }
    )
  }
  async updateById({ requirement }) {
    const { _id: requirementEditor } = await this.ctx.service.user.check()
    const update = { ...requirement, requirementEditor }
    const _id = requirement._id || new mongoose.Types.ObjectId()

    return this.ctx.model.Report.findOneAndUpdate(
      { _id },
      { ...update, _id },
      {
        new: true,
        upsert: true
      }
    )
  }

  authorization({
    user,
    owner,
    reportId,
    reportCname
  }) {
    console.log(
      user,
      owner,
      reportId,
      reportCname
    )
  }
}

module.exports = Requirement

