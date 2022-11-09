const {
  Service
} = require('egg')
const R = require('ramda')

const mongoose = require('mongoose')

const { isValid } = mongoose.Types.ObjectId

// const LRU = require('lru-cache')

// const LRUOptions = {
//   max: 500,
//   length: (n, key) => (2 * n) + key.length,
//   dispose: (key, n) => { if (n && n.close) { n.close() } },
//   maxAge: 1000 * 60 * 60
// }
// const cache = LRU(LRUOptions)
class User extends Service {
  async findByUserRole(user, userFindFn, adminFindFn) {
    const roles = await this.getRoles(user)
    const _roles = roles.map(item => item.roleId)

    if (_roles.includes(500)) {
      return adminFindFn()
    }

    const menu = await this.getUserMenu(user)
    const menuIds = menu
      .filter(item => isValid(item.menuUrl))
      .map(item => item.menuUrl)

    return userFindFn(menuIds)
  }
  async check() {
    const user = await this.getInfo()

    if (!user) {
      this.ctx.throw(403, 'Forbidden', {
        errors: [{
          message: '用户登录失效'
        }]
      })
    }

    return user
  }

  async findById(_id) {
    return this.ctx.model.User
      .findById(_id)
  }
  async getUserList() {
    const userList = await this.ctx.model.User
      .find({})
    return userList
  }


  update(user) {
    const data = R.dissoc('__v', user)

    return this.ctx.model.User
      .findOneAndUpdate({
        userId: user.userId
      }, data, {
        upsert: true,
        new: true
      })
  }

  async getInfo() {
    if (this.ctx.user) {
      return this.ctx.user
    }
    let user = this.ctx.app.lru
      .get('long')
      .get(this.ctx.sessionId)
    if (user) {
      this.ctx.user = user
      return user
    }
    try {
      user = await this.ctx.service.gateway.auth()
    } catch (e) {
      return null
    }
    if (!user) return null

    const _user = await this.ctx.model.User
      .findOneAndUpdate({
        userId: user.userId
      }, user, {
        upsert: true,
        new: true
      })
    this.ctx.user = {
      ..._user.toObject(),
      ...user
    }
    this.ctx.app.lru.get('long')
      .set(this.ctx.sessionId, _user.toObject())
    const theUser = _user.toObject()
    this.ctx.user = theUser

    return theUser
  }

  async getRoles(user) {
    let roles = this.ctx.app.lru.get('long')
      .get(`${this.ctx.sessionId}.roles`)
    if (roles) {
      return roles
    }
    const res = await this.ctx.service.gateway.roles(user)

    if (!res.success) {
      this.ctx.throw(422, 'Unprocessable Entity', {
        errors: [{
          message: '获取用户列表失败'
        }]
      })
    }
    if (res.success) {
      this.ctx.app.lru.get('long')
        .set(`${this.ctx.sessionId}.roles`, res.response)
    }

    return res.success ?
      res.response :
      null
  }

  async getDingInfo(user) {
    let dingding = this.ctx.app.lru.get('long')
      .get(`${this.ctx.sessionId}.dingding`)

    if (dingding) {
      return dingding
    }

    dingding = await this.ctx.service.gateway.getDingInfo(user)
    this.ctx.app.lru.get('long')
      .set(`${this.ctx.sessionId}.dingding`, dingding)

    return dingding
  }

  async getUserMenu(user) {
    let menu = this.ctx.app.lru.get('long')
      .get(`${this.ctx.sessionId}.menu`)

    if (menu) {
      return menu
    }
    menu = await this.ctx.service.gateway.menu(user)

    if (!menu.success) {
      return []
    }
    this.ctx.app.lru.get('long')
      .set(`${this.ctx.sessionId}.menu`, menu.response)

    return menu.response
  }

  // async catPm(user) {
  //   const result = await this.ctx.app.redis
  //     .get('cache')
  //     .smembers(`KaCat_userId_${user.userId}`)

  //   if (result && result.length) {
  //     return this.ctx.service.rds.getCat(result)
  //   }

  //   return []
  // }
}

module.exports = User
