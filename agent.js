// const RegistryClient = require('./lib/excel_sdk')

module.exports = (agent) => {
  agent.messenger.on('egg-ready', () => {
    const data = {}
    agent.messenger.sendRandom('init_sub', data)
  })
}
