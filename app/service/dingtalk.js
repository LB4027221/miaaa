const { Service } = require('egg')
const mongoose = require('mongoose')

class Dingtalk extends Service {
  async sub(touser, chartId) {
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
        touser,
        agentid: this.ctx.app.config.dingtalk.agentid,
        ...msg
      })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Dingtalk
