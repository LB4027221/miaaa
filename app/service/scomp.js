const { Service } = require('egg')
const mongoose = require('mongoose')

const { isValid } = mongoose.Types.ObjectId

class Scomp extends Service {
  find() {
    return this.ctx.model.Scomp.find()
  }
  async findCacheFirst() {
    const data = await this.ctx.app.lru.get('moment').get('scomp')

    if (data) {
      return data
    }

    const _data = await this.find()
    const obj = _data.map(i => i.toObject())
    await this.ctx.app.lru.get('long').set('scomp', obj)
    return obj
  }

  findOneById(_id) {
    if (!isValid(_id)) {
      return null
    }
    return this.ctx.model.Scomp.findById(_id)
  }

  create(data) {
    const scomp = this.ctx.model.Scomp(data)

    return scomp.save()
  }

  edit(data) {
    return this.ctx.model.Scomp
      .findByIdAndUpdate(data._id, data, { upsert: true, new: true })
  }
}

module.exports = Scomp

