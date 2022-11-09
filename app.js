const { map } = require('ramda')
// const { PubSub } = require('graphql-subscriptions')
// const ast = require('./lib/ast')
const utils = require('./lib/utils')
// const myTask = require('./lib/schedule')
const cache = require('./lib/cache')
const cacheBy = require('./lib/cache_by')

const tasks = {}
// 加入了 excel 执行时的一个锁，保证每次只有一个进程在做这件事情
const lockMap = {}
const mainTasks = {}

module.exports = async (app) => {
  // ast(app)
  utils(app)
  cache(app)
  app.mainTasks = mainTasks
  app.messenger.on('lockTasks', (key) => {
    app.mainTasks[key] = true
  })
  app.messenger.on('unlockTasks', (key) => {
    app.mainTasks[key] = false
  })
  app.messenger.on('cacheBy', ({ filename, key }) => {
    cacheBy(app, key, filename)
  })
  app.messenger.on('runTask', async ({ report, args, tpl }) => {
  const ctx = app.createAnonymousContext()
   try {
     console.log(`ready to runtask`)
    await ctx.connector.report.build(report, args, tpl)
    console.log(`run task success 1`)
    const data = await ctx.connector.tpl.read(tpl, {})
    console.log(`run task success 2`)
    ctx.connector.tpl.cache(tpl, data)
   } catch(e) {
     console.log(e)
    console.log(`run task failed`)
    app.messenger.sendToAgent('taskFinish', report._id)
    console.log('client send to Agent Success')
   } finally {
    app.messenger.sendToAgent('taskFinish', report._id)
   }
  })

  app.messenger.on('init_sub', async () => {
    app.tasks = tasks
    app.lockMap = lockMap

    // const ctx = app.createAnonymousContext()
    // const schedules = await ctx.model.Schedule
    //   .find()
    //   .populate('creator editor')
    //   .populate({
    //     path: 'report',
    //     model: 'Report',
    //     populate: {
    //       model: 'Meta',
    //       path: 'metaList'
    //     }
    //   })
    //   .populate({
    //     path: 'tpl',
    //     model: 'Tpl',
    //     populate: {
    //       model: 'User',
    //       path: 'creator'
    //     }
    //   })
    //   .exec()

    map(myTask(ctx), schedules)
  })
}
