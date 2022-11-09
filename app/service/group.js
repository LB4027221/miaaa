const { Service } = require('egg')
const R = require('ramda')
const mongoose = require('mongoose')

class Group extends Service {
  find() {
    return this.ctx.model.Group.find({
      status: {
        $ne: 0
      }
    })
  }
  add(group) {
    const _id = new mongoose.Types.ObjectId()
    const newGroup = { _id, ...group }

    return this.update(newGroup)
  }

  update(group) {
    const data = R.dissoc('__v', group)

    return this.ctx.model.Group
      .findOneAndUpdate({
        _id: group._id
      }, data, { upsert: true, new: true })
  }

  del(groupId) {
    return this.ctx.model.Group
      .findOneAndUpdate({
        _id: groupId
      }, { status: 0 }, { upsert: true, new: true })
  }
}

module.exports = Group

