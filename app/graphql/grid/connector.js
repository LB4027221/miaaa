const mongoose = require('mongoose')

const defaultPopulateConf = {
  path: 'items',
  model: 'GridItem',
  populate: {
    model: 'Chart',
    path: 'chart'
  }
}

class Grid {
  constructor(ctx) {
    this.ctx = ctx
  }

  async getUserGrid(user) {
    if (user.grid) {
      return this.findOne(user.grid)
    }

    const res = await this.ctx.model.Grid
      .find()
      .limit(1)
      .populate(defaultPopulateConf)
      .exec()
    return res ? res[0] : null
  }

  async findByUser(user) {
    const res = await this.ctx.service.user
      .findByUserRole(user, this.userFindFn.bind(this), this.adminFindFn.bind(this))

    return res
  }

  async findById(_id) {
    return this.ctx.model.Grid
      .findById(_id)
      .populate(defaultPopulateConf)
      .exec()
  }

  updateItem(ctx) {
    return (gridItem) => {
      const _id = gridItem._id || new mongoose.Types.ObjectId()

      return ctx.model.GridItem
        .findOneAndUpdate(
          { _id },
          { ...gridItem, _id, chart: gridItem.chart._id },
          {
            new: true,
            upsert: true
          }
        )
        .exec()
    }
  }

  async update(user, data, stream, name) {
    const _id = data._id || new mongoose.Types.ObjectId()
    if (stream) {
      stream.on('readable', () => {
        this.ctx.oss.put(name, stream)
      })
    }

    try {
      const res = await this.ctx.model.Grid
        .findOneAndUpdate(
          { _id },
          { ...data, _id },
          {
            new: true,
            upsert: true
          }
        )
        .populate(defaultPopulateConf)
        .exec()

      return {
        success: true,
        data: res
      }
    } catch (e) {
      console.log('=========Grid=================')
      console.log(e)
      console.log('====================================')
      return {
        success: false,
        data: e.message
      }
    }
  }

  adminFindFn() {
    return this.ctx.model.Grid
      .find()
      .populate(defaultPopulateConf)
      .exec()
  }

  userFindFn(ids) {
    return this.ctx.model.Grid
      .find({
        _id: { $in: ids }
      })
      .populate(defaultPopulateConf)
      .exec()
  }

  findOne(id) {
    return this.ctx.model.Grid
      .findById(id)
      .populate(defaultPopulateConf)
      .exec()
  }
}

module.exports = Grid

