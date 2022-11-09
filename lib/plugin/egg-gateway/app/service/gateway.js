const { Service } = require('egg')
const axios = require('axios')

class GateWay extends Service {
  request(api, config = {}) {
    const appKey = this.ctx.appKey || this.config.gateway.appKey
    const bizCode = this.ctx.bizCode || this.config.gateway.bizCode
    const params = {
      appKey,
      bizCode,
      ...this.ctx.userAgent,
      deviceUUID: this.ctx.deviceUUID,
      ...config.params
    }

    return axios({
      url: `${this.config.gateway.host}/gw/api/${api}`,
      ...config,
      headers: {
        cookie: `SESSION=${this.ctx.sessionId}`
      },
      params
    }).then(res => res.data)
  }

  async auth() {
    const user = await this.expire()
    if (!user) {
      this.ctx.throw(403, '登陆失效')
    }

    return user
  }

  expire() {
    if (!this.ctx.sessionId) {
      return null
    }

    return this.getById()
  }

  logout(userId) {
    if (!userId) {
      return {
        success: false,
        errorMessage: '你是不是忘记传用户 id 了？'
      }
    }

    const data = {
      appKey: this.config.gateway.appKey,
      bizCode: this.config.gateway.bizCode,
      deviceUUID: this.ctx.deviceUUID,
      userId
    }

    const config = {
      url: `${this.config.gateway.host}/login/logout`,
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      data
    }

    return axios({
      url: `${this.config.gateway.host}/login/logout`,
      ...config
    }).then(res => res.data)
  }

  async getById(params = {}) {
    const res = await this.request('songxiaocai.user.getById', {
      method: 'post',
      params
    })

    return res.success
      ? res.response
      : null
  }

  async getDingInfo(user) {
    const dw = process.env.NODE_ENV === 'production'
      ? 'dw_sec'
      : 'dw'
    const dingInfo = await this.app.rds.query(`
      SELECT
        job_no as jobNo,
        dingtalk_user_id as dingtalkUserId,
        dingtalk_id as dingtalkId,
        position,
        avatar
      FROM
        ${dw}.dimen_dingtalk_employee
      WHERE
        user_id = ${user.userId}
    `)

    return dingInfo.length
      ? { ...dingInfo[0] }
      : null
  }

  async userNodeTree(juniorQueryNodeId) {
    const res = await this.request('songxiaocai.organization.trees.get', {
      data: {
        juniorQueryNodeId
      }
    })

    return res
  }

  // songxiaocai.pemission.authenticate
  async authenticate(authenticationDTO) {
    const res = await this.request('songxiaocai.pemission.authenticate', {
      data: {
        authenticationDTO
      }
    })

    return res
  }

  // songxiaocai.menu.get
  async menu({ userId }) {
    const res = await this.request('songxiaocai.menu.get', {
      params: {
        userId,
        sysId: 3
      }
    })

    return res
  }

  async getMenu(menuDTO) {
    const res = await this.request('songxiaocai.permission.menu.getById', {
      params: {
        menuId: menuDTO.menuId
      }
    })

    return res
  }

  // songxiaocai.permission.createMenu
  async createMenu(menuDTO) {
    const params = {
      menuDTO: {
        ...menuDTO,
        displayInMenu: 1,
        systemId: 3,
        groupId: 516
      }
    }
    const res = await this.request('songxiaocai.permission.createMenu', {
      params
    })

    return res
  }

  // songxiaocai.user.getRoleByUserId
  async roles({ userId }) {
    const res = await this.request('songxiaocai.user.getRoleByUserId', {
      params: {
        userId
      }
    })

    return res
  }
}

module.exports = GateWay

