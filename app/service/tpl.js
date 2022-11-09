const { Service } = require('egg')
const mongoose = require('mongoose')
const { take } = require('ramda/src')
// const Excel = require('exceljs')
const { map, values, compose } = require('ramda')

class Tpl extends Service {
  findOne(q) {
    return this.ctx.model.Tpl
      .findOne(q)
      .populate('creator editor report')
      .exec()
  }

  async read(filename, worksheets, _id) {
    const opt = {
      args: [filename]
    }

    const res = await this.ctx.service.excel.read(opt)

    const _res = compose(
      values,
      map((data) => {
        const _data = JSON.parse(data.data)
        return {
          _id: `${_id} ${data.name}`,
          name: data.name,
          data: data.name === worksheets[0] ? take(100, _data.data) : _data.data
        }
      })
    )(res)

    return _res
  }
  async update(data) {
    const _id = data._id || new mongoose.Types.ObjectId()

    const res = await this.ctx.model.Tpl
      .findOne({ filename: data.filename })
      .exec()

    if (res) {
      return this.ctx.model.Tpl
        .findOneAndUpdate(
          { filename: data.filename },
          { ...data },
          {
            new: true,
            upsert: true
          }
        )
        .populate('creator editor')
        .exec()
    }

    return this.ctx.model.Tpl
      .findOneAndUpdate(
        { _id },
        { ...data, _id },
        {
          new: true,
          upsert: true
        }
      )
      .populate('creator editor')
      .exec()
  }
}

module.exports = Tpl
