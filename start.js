const { startCluster } = require('egg')
// const workers = require('os').cpus().length

startCluster({
  baseDir: __dirname,
  workers: 1,
  port: process.env.PORT || 7777
}, () => {
  console.log('服务器启动')
})
