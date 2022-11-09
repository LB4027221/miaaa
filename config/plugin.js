const path = require('path')

exports.redis = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-redis')
}

exports.gateway = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-gateway')
}

exports.graphql = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-graphql')
}

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose'
}
// 先用这个代替
// exports.orm = {
//   enable: true,
//   package: 'egg-orm',
// },
// exports.rds = {
//   enable: true,
//   path: path.join(__dirname, '../lib/plugin/egg-rds')
// }

exports.lru = {
  enable: true,
  package: 'egg-lru'
}
// exports.alinode = {
//   enable: true,
//   package: 'egg-alinode'
// }

exports.io = {
  enable: true,
  package: 'egg-socket.io'
}
exports.queue = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-queue')
}
// exports.grpc = {
//   enable: true,
//   path: path.join(__dirname, '../lib/plugin/egg-grpc')
// }
exports.oss = {
  enable: true,
  package: 'egg-oss'
}

exports.dingtalk = {
  enable: true,
  package: 'egg-dingtalk'
}
