const assert = require('assert')
const rds = require('ali-rds')

let count = 0

function createOneClient(config, app) {
  assert(
    config.host && config.port && config.user,
    `[egg-rds] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}'`
  )

  app.coreLogger.info(
    '[egg-rds] connecting %s@%s:%s/%s',
    config.user, config.host, config.port
  )

  const client = rds(config)

  app.beforeStart(async () => {
    const rows = await client.query('select now() as currentTime')
    const index = count++
    app.coreLogger.info(`[egg-rds] instance[${index}] status OK, rds currentTime: ${rows[0].currentTime}`)
  })
  return client
}

module.exports = (app) => {
  app.addSingleton('rds', createOneClient)
}
