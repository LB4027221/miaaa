const { interval } = require('rxjs')

const MIN = 60
const HOUR = MIN * 60

const intervalMap = {
  min: MIN,
  hour: HOUR,
  day: HOUR * 24,
  week: HOUR * 24 * 7,
  month: HOUR * 24 * 30
}

const myTask = ctx => (schedule) => {
  if (ctx.app.mainTasks[schedule.report._id]) {
    return null
  }
  ctx.app.tasks = ctx.app.tasks || {}

  if (ctx.app.tasks[schedule._id]) {
    ctx.app.tasks[schedule._id].unsubscribe()
  }
  const [intervalValue, intervalUnit] = schedule.interval.split('*')
  const _interval = intervalValue * intervalMap[intervalUnit]
  const task = interval(_interval * 1000)
    .subscribe(async () => {
      try {
        const {
          pageSize, current, filename, components, report, tpl
        } = schedule
        const args = {
          pageSize, current, filename, components
        }
        // ctx.app.lockMap = ctx.app.lockMap || {}
        // const t = ctx.app.lockMap[report._id]
        // ctx.app.messenger.broadcast('lockTasks', report._id)
        // if (t) {
        //   await t
        //   ctx.app.lockMap[report._id] = null
        // }

        // const next = async () => {
        //   await ctx.connector.report.build(report, args, tpl)
        //   const data = await ctx.connector.tpl.read(tpl, {})
        //   // console.log('schedule: ', schedule._id)
        //   ctx.connector.tpl.cache(tpl, data)
        //   ctx.app.lockMap[report._id] = null
        // }

        // flag
        ctx.app.messenger.sendToAgent('addTask', {report, args, tpl})
         // flag
        // ctx.app.lockMap[report._id] = next()
        // await ctx.app.lockMap[report._id]
        // ctx.app.messenger.broadcast('unlockTasks', report._id)
      } catch (e) {
        ctx.logger.error(e)
        task.unsubscribe()
        ctx.app.tasks[schedule._id] = null
        ctx.app.messenger.broadcast('unlockTasks', schedule.report._id)
      } finally {
        ctx.app.messenger.sendToAgent('taskFinish', report._id)
      }
    })

  ctx.app.tasks[schedule._id] = task
}

module.exports = myTask
