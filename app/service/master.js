const { Service } = require('egg')

class Master extends Service {
  find() {
    return this.ctx.model.Master
      .find()
      .populate('metaList user editor child friend')
  }

  findById(_id) {
    return this.ctx.model.Master
      .findById(_id)
      .populate('metaList editor child friend')
  }
  save(obj) {
    return obj.save()
  }

  findByIds(ids) {
    return this.ctx.model.Master
      .find({
        _id: { $in: ids },
        status: { $ne: 4 }
      })
      .populate('metaList user editor')
  }

  findActiveByIds(ids) {
    return this.ctx.model.Master
      .find({
        _id: { $in: ids },
        status: 3
      })
      .populate('metaList user editor')
  }
}

module.exports = Master

