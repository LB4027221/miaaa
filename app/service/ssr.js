const { Service } = require('egg')
const { isEmpty } = require('ramda')

class Ssr extends Service {
  async renderCard(props) {
    const { chart, d } = props
    const { conf } = chart
    const body = !isEmpty(conf) ? conf.body : null

    const cols = d.shift()
    const data = this.ctx.app.utils.create.mapExcelData(d, cols)

    const state = {
      _id: !isEmpty(chart) && chart._id,
      title: !isEmpty(conf) && conf.title,
      titleCol: !isEmpty(conf) && conf.titleCol,
      bodyCol: !isEmpty(conf) && conf.bodyCol,
      body,
      data,
      row: !isEmpty(conf) ? conf.row : 0,
      chart: conf.chart
    }

    if (!data) {
      console.log('=======chart error==================')
      console.log(chart)
      console.log('====================================')
      return null
    }

    const {
      title, titleCol, bodyCol
    } = state
    const total = title
      ? state.data[titleCol] && state.data[titleCol].length > state.row
        ? this.ctx.app.utils.create.formatToYuan(titleCol, state.data[titleCol][state.row])
        : null
      : null
    const footer = body
      ? state.data[bodyCol] && state.data[bodyCol].length > state.row
        ? this.ctx.app.utils.create.formatToYuan(bodyCol, state.data[bodyCol][state.row])
        : null
      : null

    return {
      title,
      body,
      total,
      footer
    }
  }
}

module.exports = Ssr

