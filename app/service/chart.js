const { Service } = require('egg')
const mongoose = require('mongoose')

class Chart extends Service {
  update(data) {
    const _id = data._id || new mongoose.Types.ObjectId()

    return this.ctx.model.Chart
      .findOneAndUpdate(
        { _id },
        { ...data, _id },
        {
          new: true,
          upsert: true
        }
      )
      .exec()
  }
}

module.exports = Chart
