module.exports = (app) => {
  class DingtalkController extends app.Controller {
    // { touser, toparty, msgtype, ... }
    async msg() {
      const { chartId } = this.ctx.query
      const chart = await this.ctx.connector.chart.findById(chartId)
      const data = await this.ctx.connector.chart.getDataFromCache(chart)
      const card = await this.ctx.service.ssr.renderCard({
        chart,
        d: data.data
      })
      const msg = this.ctx.app.utils.create.buildMsg({
        chartId,
        chartTitle: chart.title,
        ...card
      })

      try {
        // touser: '102210350524367434',
        this.ctx.dingtalk.message.send({
          touser: '102210350524367434',
          agentid: app.config.dingtalk.agentid,
          ...msg
        })
      } catch (e) {
        console.log('DingtalkController', e)
      }
      this.ctx.body = '123'
    }
  }
  return DingtalkController
}
