const { Service } = require('egg')
const mongoose = require('mongoose')

class Ext extends Service {
  findOneById(_id) {
    return this.ctx.model.Ext
      .findOneById({ report: _id })
      .populate('report linkReports linkExcel')
      .exec()
  }

  update(data) {
    const _id = data._id || new mongoose.Types.ObjectId()

    return this.ctx.model.Ext
      .findOneAndUpdate(
        { _id },
        { ...data, _id },
        {
          new: true,
          upsert: true
        }
      )
      .populate('report linkReports linkExcel')
      .exec()
  }
}

module.exports = Ext

