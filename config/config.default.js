const path = require('path')

exports.keys = 'miaaa'

exports.token = 'miaaa_yahaha'

// exports.clusterClient = {
//   responseTimeout: 60000
// }

exports.lowdb = {
  path: path.resolve(__dirname, '../', 'db.json'),
  adapter: 'file'
}

exports.pubsub = {
  notification: 'notification',
  messages: 'messages'
}

exports.graphql = {
  router: '/graphql',
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
  // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
  graphiql: true
  // // graphQL 路由前的拦截器
  // onPreGraphQL: function* (ctx) {},
  // // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
  // onPreGraphiQL: function* (ctx) {}
}
exports.bodyParser = {
  jsonLimit: '100mb'
}

exports.security = {
  csrf: {
    enable: false
  }
}

exports.cors = {
  origin: () => '*'
}

exports.static = {
  dynamic: true,
  preload: false,
  buffer: true,
  maxFiles: 1000,
  maxAge: 31536000
}

exports.lru = {
  clients: {
    long: {
      max: 1000,
      maxAge: 1000 * 60 * 60 * 72
    },
    moment: {
      max: 1000,
      maxAge: 1000 * 60
    }
  },
  app: true,
  agent: false
}

exports.multipart = {
  fileSize: '50mb',
  whitelist: [
    '.xlsx',
    '.csv',
    '.png'
  ]
}

exports.oss = {
  client: {
    accessKeyId: 'EUP0QELW1y2YkSgB',
    accessKeySecret: 'dfmLyD9uLvb7E2VE3CUKTwyviooouI',
    bucket: 'dev-sxc-pesticide',
    endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    timeout: '60s'
  }
}

exports.dingtalk = {
  corpid: 'ding18b7a4a3fdad4761',
  corpsecret: 'RKbw-zntVqL7Q8OViJkjGql5LGkFIow38y2TgKay2rA1WNl7-YIkkHRGsLr3uHty',
  agentid: '210873523'
  // host: '',
  // enableContextLogger: ''
}

exports.middleware = ['graphql', 'initUser']
