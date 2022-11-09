const path = require('path')
exports.gateway = {
  appKey: '18701298',
  bizCode: 'report_login',
  host: 'http://121.40.83.124:8080'
}

// exports.cluster = {
//   listen: {
//     port: 1024
//   }
// }

exports.mongoose = {
  clients: {
    miaaa: {
      url: 'mongodb://127.0.0.1/report',
      options: {
        debug: true
      }
    },
    track: {
      url: 'mongodb://127.0.0.1/miaaa-track',
      options: {}
    }
  }
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
}

// exports.rds = { // ali-rds
//   client: {
//     host: 'rm-bp1enc0yrzt3zu60do.mysql.rds.aliyuncs.com',
//     port: '3306',
//     user: 'sxc_test',
//     password: 'Songxiaocai2015',
//     bigNumberStrings: true,
//     dateStrings: true,
//     timezone: 'CN',
//     trace: false,
//     connectionLimit: 5
//   },
//   app: true,
//   agent: false
// }
//exports.grpc = {
//  clients: [
//    {
//      instanceName: 'server',
//      packageName: 'miaaaserver',
//      serviceName: 'Build',
//      protoPath: path.resolve(__dirname, '../proto/server.proto'),
//      sdUri: 'static://' + '127.0.0.1' + ':2048',
//      // sdUri: 'static://' + '127.0.0.1' + ':2048',
//
//      grpcProtoLoaderOpts: {
//         // see:  https://github.com/grpc/grpc-node/tree/master/packages/proto-loader for details
//      },
//    },
//    {
//      instanceName: 'server',
//      packageName: 'miaaaserver',
//      serviceName: 'Read',
//      protoPath: path.resolve(__dirname, '../proto/server.proto'),
//      sdUri: 'static://' + '127.0.0.1' + ':2048',
//      grpcProtoLoaderOpts: {
//         // see:  https://github.com/grpc/grpc-node/tree/master/packages/proto-loader for details
//      },
//    }
//  ],
//}

// exports.redis = {
//   clients: {
//     cache: {
//       enbaleSentinels: true,
//       sentinels: [{
//         host: '121.43.151.212',
//         port: '26379'
//       }, {
//         host: '121.43.151.212',
//         port: '26380'
//       }, {
//         host: '121.43.151.212',
//         port: '26381',
//         family: 'mymaster',
//         password: 'songxiaocai2015',
//         db: 2
//       }],
//       name: 'mymaster',
//       password: 'songxiaocai2015'
//     }
//   }
// }
