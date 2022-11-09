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

      const clientSysName = this.get('clientSysName')
      const clientSysVersion = this.get('clientSysVersion')
      const clientVersion = this.get('clientVersion')

      const data = {
        clientSysName: clientSysName || agent.name,
        clientSysVersion: clientSysVersion || agent.version,
        clientVersion: clientVersion || agent.os || 'windows'
      }

      this[USER_AGENT] = data
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
  },
  get appKey() {
    return this.get('appkey') || ''
  },
  get bizCode() {
    return this.get('bizcode') || ''
  }
}
