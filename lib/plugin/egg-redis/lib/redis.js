
const assert = require('assert')
const Redis = require('ioredis')

let count = 0

const createClient = (config, app) => {
  let client

  if (config.cluster === true) {
    assert(config.nodes && config.nodes.length !== 0, '[gpm-redis] cluster nodes configuration is required when use cluster redis')

    config.nodes.forEach((cnf) => {
      assert(
        cnf.host && cnf.port && cnf.password !== undefined && cnf.db !== undefined,
        `[gpm-redis] 'host: ${cnf.host}', 'port: ${cnf.port}', 'password: ${cnf.password}', 'db: ${cnf.db}' are required on config`
      )
    })
    app.coreLogger.info('[gpm-redis] cluster connecting start')

    client = new Redis.Cluster(config.nodes, config)
    client.on('connect', () => {
      app.coreLogger.info('[gpm-redis] cluster connect success')
    })
    client.on('error', (error) => {
      app.coreLogger.error(error)
    })
  } else if (config.enbaleSentinels === true) {
    assert(config.sentinels && config.sentinels.length !== 0, '[gpm-redis] sentinel sentinels configuration is required when usw sentinels')

    config.sentinels.forEach((cnf) => {
      assert(
        cnf.host && cnf.port,
        `[gpm-redis] 'host: ${cnf.host}', 'port: ${cnf.port}' are required on config`
      )
    })

    app.coreLogger.info('[gpm-redis] senstinels connecting start')

    client = new Redis(config)
    client.on('connect', () => {
      app.coreLogger.info('[gpm-redis] senstinels connect success')
    })
    client.on('error', (error) => {
      app.coreLogger.error(error)
    })
  } else {
    assert(
      config.host && config.port && config.password !== undefined && config.db !== undefined,
      `[gpm-redis] 'host: ${config.host}', 'port: ${config.port}', 'password: ${config.password}', 'db: ${config.db}' are required on config`
    )

    app.coreLogger.info(
      '[gpm-redis] connecting redis://:%s@%s:%s/%s',
      config.password, config.host, config.port, config.db
    )

    client = new Redis(config)
    client.on('connect', () => {
      app.coreLogger.info(
        '[gpm-redis] connect success on redis://:%s@%s:%s/%s',
        config.password, config.host, config.port, config.db
      )
    })
    client.on('error', (error) => {
      app.coreLogger.error(error)
    })
  }

  app.beforeStart(async () => {
    const result = await client.info()
    count += 1
    const index = count
    app.coreLogger.info(`[gpm-redis] instance[${index}] status OK, redis currentTime: ${result[0]}`)
  })

  return client
}

module.exports = (app) => {
  app.addSingleton('redis', createClient)
}
