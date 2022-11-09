'use strict';

module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    const queue = []
    let flag = true
    agent.timer = setInterval(() => {
      console.log(`ready to send runtask, flag: ${flag}, queue: ${queue.length}`)
      if (flag && queue.length) {
        flag = false
        agent.messenger.sendRandom('runTask', queue.shift())
        console.log(`send runtask success`)
      }
    }, 60000)
    agent.messenger.on('addTask', async data => {
      console.log(`task ${data.report._id} push to queue`)
      queue.push(data)
    })
    agent.messenger.on('taskFinish', data => {
      console.log(`receive run failed ${data}`)
      flag = true
      console.log(`task ${data} finished`)
    })
  })
}
