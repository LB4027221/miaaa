const userAgent = require('user-agent')
const cookie = require('cookie')

const USER_AGENT = Symbol('Context#USER_AGENT')
const UM_DISTINCTID = Symbol('Context#UMDISTINCTID')
const SESSIONID = Symbol('Context#SESSIONID')
const DEVICEUUID = Symbol('Context#DEVICEUUID')

module.exports = {
  get userAgent() {
    if (!this[USER_AGENT]) {
      const agent = userAgent.parse(this.get('user-agent'))

      this[USER_AGENT] = {
        clientSysName: agent.name,
        clientSysVersion: agent.version,
        clientVersion: agent.os || 'windows'
      }
    }

    return this[USER_AGENT]
  },

  get sessionId() {
    if (!this[SESSIONID]) {
      this[SESSIONID] = this.get('SESSION')
        ? this.get('SESSION')
        : cookie.parse(this.get('Cookie')).SESSION
    }

    return this[SESSIONID]
  },
  get umDistinctid() {
    if (!this[UM_DISTINCTID]) {
      this[UM_DISTINCTID] = this.get('UM_distinctid')
        ? this.get('UM_distinctid')
        : cookie.parse(this.get('Cookie')).UM_distinctid
    }

    return this[UM_DISTINCTID]
  },
  get deviceUUID() {
    if (!this[DEVICEUUID]) {
      this[DEVICEUUID] = this.get('deviceUUID')
    }

    return this[DEVICEUUID]
  }
}
