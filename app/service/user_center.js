const { Service } = require('egg')
const axios = require('axios')

class UserCenter extends Service {
  expire() {
    if (!this.ctx.sessionId) {
      return null
    }

    return this.ctx.service.gateway.getById()
  }

  async updateUser(user) {
    const newUser = await this.ctx.model.User
      .findOneAndUpdate({ userId: user.userId }, user, { upsert: true })

    return newUser
  }

  async login({
    mobilePhone,
    password
  }) {
    const {
      deviceUUID,
      appKey
    } = this.ctx.request.body

    const { data } = await axios({
      url: `${this.config.gateway.host}/login/login`,
      method: 'post',
      headers: {
        'context-type': 'application/json'
      },
      data: {
        bizCode: this.config.gateway.bizCode,
        appKey,
        deviceUUID,
        mobilePhone,
        password
      }
    })

    if (data.success) {
      this.updateUser(data.result)
    }
    return data
  }
}

module.exports = UserCenter

