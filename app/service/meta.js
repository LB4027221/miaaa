const { Service } = require('egg')
const mongoose = require('mongoose')

class Meta extends Service {
  async updateByIds(requirement, { metaList }) {
    const tasks = metaList.map(meta =>
      this.updateById(meta))

    const res = await Promise.all(tasks)
    const _metaList = res.map(item => item.toObject()._id)

    await this.ctx.service.requirement.updateMeta(requirement._id, _metaList)

    return res
  }
  async findById(id) {
    let meta = await this.ctx.model.Meta.findById(id)
    return meta
  }
  async create(metaClone) {
    let meta = this.ctx.model.Meta(metaClone)
    meta = await meta.save()
    return meta
  }
  async updateById(update) {
    const _id = update._id || new mongoose.Types.ObjectId()

    return this.ctx.model.Meta.findOneAndUpdate(
      { _id },
      { ...update, _id },
      {
        new: true,
        upsert: true
      }
    )
  }
}

module.exports = Meta

