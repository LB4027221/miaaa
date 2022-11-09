const moment = require('moment')

module.exports = {
  schedule: {
    interval: '30m',
    type: 'all',
    immediate: true
  },
  async task(ctx) {
    const nine = moment().startOf('day')
      .add(9, 'hours')
    const nineThirty = moment().startOf('day')
      .add(9, 'hours')
      .add(29, 'minutes')

    const shouldRun = moment().isBetween(nine, nineThirty, null, '(]')
    if (shouldRun) {
      setTimeout(async () => {
        const res = await ctx.model.Subscription
          .find({
            status: 1,
            dingtalkIds: { $exists: true, $ne: [] }
          })
          .exec()
        res.forEach(sub => {
          const touser = sub.dingtalkIds.join(',')
          ctx.service.dingtalk.sub(touser, sub.chartId)
        })
      }, 1000 * 60 * 5)
    }
  }
}
