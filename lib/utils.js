const moment = require('moment')
const { mergeAll } = require('ramda/src')

require('moment/locale/zh-cn')

moment.updateLocale('zh-cn')

const DATE_FORMAT = 'YYYY/MM/DD'
const formater = date => date.map(d => moment(d).format(DATE_FORMAT))
// ['2018-10-18', '2018-12-26'] || str => ['2018-10-18', '2018-12-26']
const caseDateMap = (date) => {
  switch (date) {
    case '近一周':
      return formater([
        moment().add(-7, 'd'),
        moment().add(-1, 'd')
      ])
    case '近一月':
      return formater([
        moment().add(-30, 'd'),
        moment().add(-1, 'd')
      ])
    case '上周':
      return formater([
        moment().add(-1, 'weeks').startOf('isoWeek'),
        moment().add(-1, 'weeks').endOf('isoWeek')
      ])
    case '上月':
      return formater([
        moment().add(-1, 'month').startOf('month'),
        moment().add(-1, 'month').endOf('month')
      ])

    case '本周':
      return formater([
        moment().startOf('isoWeek'),
        moment().add(-1, 'd')
      ])
    case '本月':
      return formater([
        moment().startOf('month'),
        moment().add(-1, 'd')
      ])

    case '昨日':
      return formater([
        moment().add(-1, 'd'),
        moment().add(-1, 'd')
      ])
    case '今日':
      return formater([
        moment(),
        moment()
      ])

    default:
      return formater(date)
  }
}

const isMoney = (key) => {
  if (key) {
    const _key = key.toLowerCase()
    return _key.includes('gmv') || _key.includes('额')
  }

  return false
}
const addW = key => (key && key.includes('万')
  ? '万'
  : '')
const yuan = val => `¥${val}`
const formatToYuan = (key, val) => (isMoney(key)
  ? `${yuan(val)}${addW(key)}`
  : val)

const mapExcelData = (data, columns) => {
  if (!data || !data.length) {
    return null
  }
  const init = columns.map(col => ({ [col]: [] }))
  const res = data.reduce((acc, item) => {
    item.forEach((i, idx) => {
      const key = columns[idx]
      acc[key].push(i)
    })

    return acc
  }, mergeAll(init))

  return res
}

const buildMsg = props => ({
  msgtype: 'oa',
  oa: {
    message_url: `https://reports.songxiaocai.com/#/chart/${props.chartId}`,
    head: {
      text: props.chartTitle,
      bbgcolor: '#999'
    },
    body: {
      title: props.chartTitle,
      form: [{
        key: props.title,
        value: `: ${props.total}`
      }, {
        key: props.body,
        value: `: ${props.footer}`
      }, {
        key: '日期',
        value: `: ${moment().format('YYYY-MM-DD')}`
      }]
    }
  }
})

module.exports = (app) => {
  app.addSingleton('utils', {
    caseDateMap,
    formatToYuan,
    mapExcelData,
    buildMsg
  })
}
