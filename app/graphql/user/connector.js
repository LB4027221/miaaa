class UserConnector {
  constructor(ctx) {
    this.ctx = ctx
    this.app = ctx.app
  }

  async getSubscription(user) {
    try {
      const res = await this.ctx.model.Subscription
        .find({
          subscribers: { $in: [user._id] }
        })
        .exec()
      return res
    } catch (e) {
      return []
    }
  }

  async subscribe(args) {
    try {
      const res = await this.ctx.model.Subscription
        .findOneAndUpdate({
          chartId: args.chartId
        }, {
          status: 1,
          $push: {
            subscribers: args.userId,
            dingtalkIds: args.dingtalkId
          }
        }, {
          new: true,
          upsert: true
        })
        .exec()

      return {
        success: true,
        data: res
      }
    } catch (e) {
      return {
        success: false,
        data: e
      }
    }
  }

  async unsubscribe(args) {
    try {
      const res = await this.ctx.model.Subscription
        .findOneAndUpdate({
          chartId: args.chartId
        }, {
          $pull: {
            subscribers: args.userId,
            dingtalkIds: args.dingtalkId
          }
        })
        .exec()

      return {
        success: true,
        data: res
      }
    } catch (e) {
      return {
        success: false,
        data: e
      }
    }
  }

  async getInfo(args = {}) {
    return this.ctx.service.user.getInfo(args)
  }

  getRoles(user) {
    return this.ctx.service.user.getRoles(user)
  }

  async editFavorite(user, { reportIds }) {
    const favorite = reportIds

    try {
      const res = await this.ctx.service.user.update({ ...user, favorite })
      this.ctx.app.lru.get('long').set(this.ctx.sessionId, res.toObject())

      return {
        success: true,
        result: res.favorite
      }
    } catch (e) {
      return {
        success: false,
        errorMessage: e
      }
    }
  }

  getDingInfo(user) {
    return this.ctx.service.user.getDingInfo(user)
  }
}

module.exports = UserConnector
