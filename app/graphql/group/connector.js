class GroupConnector {
  constructor(ctx) {
    this.ctx = ctx
    this.app = ctx.app
  }

  getGroups() {
    return this.ctx.service.group.find()
  }

  async addReportsGroup(user, args) {
    const { reportIds, name } = args
    const data = {
      reportIds,
      name,
      creator: user._id,
      editor: user._id
    }

    try {
      const group = await this.ctx.service.group.add(data)
      return {
        success: true,
        result: group
      }
    } catch (e) {
      return {
        success: false,
        errorMessage: e
      }
    }
  }

  async updateReportsGroup(user, args) {
    const data = {
      ...args,
      editor: user._id
    }
    try {
      const res = await this.ctx.service.group.update(data)
      return {
        success: true,
        result: res
      }
    } catch (e) {
      return {
        success: false,
        errorMessage: e
      }
    }
  }

  async delReportsGroup(user, groupId) {
    try {
      await this.ctx.service.group.del(groupId)
      return {
        success: true
      }
    } catch (e) {
      return {
        success: false,
        errorMessage: e
      }
    }
  }
}

module.exports = GroupConnector
