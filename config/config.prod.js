const path = require('path')
// 这里需要一个加密的东西
const [
  rdsHost,
  rdsUser,
  rdsPassword,
  mongoDB
] = [
  'fGpL6px1o2paFSyexocIClN3xvuD7Zq7+aDUvYUyuw56HnBK9zyIBEFMYynWGmPv',
  'q8+7XU9qxtvohlJfCuKvxg==',
  'U3ft7A/Lzo+CGZnkg8Aphw==',
  'Sl0UKqPPFsB3acL6Y4L8cip1ts+Tyr2CQ5RGAWPBU8FVpZd6q5Ohac56c0didvpQ0Vt+RpoRETslB6F9xY7q5FAHf8GZrG/QlHaMuTddMto8ZULwlin/yZqP1S3D7vyMdSL97OrHgtalhHpsGZtsyqIvr/6RgZe0c9q7yLVsrz/54bw7hH6S+WwPTYvn/9//TYtloZ9CoiI7CtiwpKNfwyrn3Lf0dP+eZ+1hq1BkEpw='
];

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

exports.gateway = {
  appKey: '18701298',
  bizCode: 'report_login',
  host: 'https://gateway.songxiaocai.com'
}

exports.mongoose = {
  clients: {
    miaaa: {
      url: mongoDB,
      options: {}
    }
  }
}

exports.rds = {
  client: {
    host: rdsHost,
    port: '3306',
    user: rdsUser,
    password: rdsPassword,
    bigNumberStrings: true,
    dateStrings: true,
    timezone: 'CN',
    trace: false,
    connectionLimit: 5
  },
  app: true,
  agent: false
}

exports.logger = {
  level: 'WARN',
  dir: '~/logs/miaaa',
  formatter: (meta) => {
    return JSON.stringify(meta)
  },
  contextFormatter: (meta) => {
    const { formatter, ...output } = meta
    return JSON.stringify(output)
  }
}
exports.alinode = {
  appid: '79600',
  secret: '8051a0bece785a8743daee07bac3abe789ae1363',
  error_log: ['~/logs/miaaa/appname-web.log', '~/logs/miaaa/common-error.log', '~/logs/miaaa/egg-agent.log'],
  packages: ['/www/miaaa/production/current/package.json']
}

exports.redis = {
  clients: {
    cache: {
      enbaleSentinels: true,
      sentinels: [{
        host: '218.244.151.7',
        port: '26379'
      }, {
        host: '120.26.109.176',
        port: '26379'
      }, {
        host: '114.215.196.77',
        port: '26379',
        family: 'mymaster',
        password: 'songxiaocai2015',
        db: 2
      }],
      name: 'mymaster',
      password: 'songxiaocai2015'
    }
  }
}
exports.grpc = {
  clients: [
    {
      instanceName: 'server',
      packageName: 'miaaaserver',
      serviceName: 'Build',
      protoPath: path.resolve(__dirname, '../proto/server.proto'),
      sdUri: 'static://' + '121.43.164.74' + ':2048',
      // sdUri: 'static://' + '127.0.0.1' + ':2048',

      grpcProtoLoaderOpts: {
         // see:  https://github.com/grpc/grpc-node/tree/master/packages/proto-loader for details
      },
    },
    {
      instanceName: 'server',
      packageName: 'miaaaserver',
      serviceName: 'Read',
      protoPath: path.resolve(__dirname, '../proto/server.proto'),
      sdUri: 'static://' + '121.43.164.74' + ':2048',
      grpcProtoLoaderOpts: {
         // see:  https://github.com/grpc/grpc-node/tree/master/packages/proto-loader for details
      },
    }
  ],
}
