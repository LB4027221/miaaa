const { Service } = require('egg')
const hash = require('string-hash')
const moment = require('moment')
const path = require('path')
// const { pathOr } = require('ramda/src')

const r = p => path.resolve(process.cwd(), p)
// const getUserId = pathOr('', ['ctx', 'user', 'userId'])
const dw = process.env.NODE_ENV === 'production'
  ? 'dw_sec'
  : 'dw'

class Rds extends Service {
  async query(SQL, values, orient = 'records') {
    const res = values
      ? await this.app.rds.query(SQL, values)
      : await this.queryByPy(SQL, orient)

    return values ? res : JSON.parse(res)
  }

  queryByPy(sql, orient) {
    const file = r('py/little.py')
    const args = [JSON.stringify({
      sql,
      host: this.ctx.app.config.rds.client.host,
      user: this.ctx.app.config.rds.client.user,
      passwd: this.ctx.app.config.rds.client.password,
      orient
    })]

    return this.ctx.service.process.process(file, args, this.littleOnError(args))
  }

  littleOnError(args) {
    return data => {
      console.log({
        cacheReport: this.cacheReport,
        args,
        error: data.toString()
      })
    }
  }

  buildSQL(report, api = 'parser') {
    const {
      metaList,
      components = [],
      joins = [],
      groupBy = [],
      targets = [],
      orderBy
    } = report
    const where = components.filter(item => item.state !== 0)

    return this.app.ast.create[api]({
      metaList,
      report,
      where,
      joins,
      groupBy,
      targets,
      orderBy
    })
  }

  async exportMasterExcel(report, SQL, { user }) {
    try {
      const publicPath = await this.ctx.service.process.writeExcel({
        report, SQL, user, WORKSHEET: report.cname
      })
      return {
        success: true,
        publicPath
      }
    } catch (e) {
      return {
        success: false,
        errors: ['导出报表时出现错误', e]
      }
    }
  }

  async exportExcel(report, { max, user }) {
    const offset = 0
    const accessDate = moment(Date.now()).format('YYYY-MM-DD')
    const editor = await this.ctx.service.user.getInfo()
    const limit = max <= 3000000
      ? max
      : 3000000
    const _report = {
      ...report,
      offset,
      limit
    }
    const SQL = this.buildSQL(_report)
    let record = this.ctx.model.Record({
      user: editor._id,
      report: report._id,
      actionType: 4,
      count: limit
    })
    let reportCount = await this.ctx.model.Recorddaycount.findOne({
      date: accessDate
    })
    if (!reportCount) {
      reportCount = this.ctx.model.Recorddaycount({
        date: accessDate,
        accessCount: 0,
        exportCount: 0
      })
    }
    reportCount.exportCount++
    record.save()
    reportCount.save()
    try {
      const publicPath = await this.ctx.service.process.writeExcel({
        report, SQL, user, WORKSHEET: report.cname
      })
      this.ctx.app.pubsub
        .publish(
          `${this.ctx.user._id}${this.ctx.app.config.pubsub.messages}`,
          {
            target: editor._id,
            event: '导出报表',
            created: new Date(),
            context: {
              report: report.cname,
              publicPath
            }
          }
        )

      return {
        success: true,
        publicPath
      }
    } catch (e) {
      return {
        success: false,
        errors: ['导出报表时出现错误', e]
      }
    }
  }

  async getReportData(report, { pageSize, current }, orient, cb) {
    const offset = (current - 1) * pageSize
    const _report = {
      ...report,
      limit: pageSize,
      offset
    }
    this.cacheReport = _report

    const SQL = this.buildSQL(_report)
    const startTime = Date.now()

    if (report.tags.includes('rukou')) {
      return this.makeId([], offset, report)
    }

    try {
      const data = await this.query(SQL, null, orient)
      const endTime = Date.now()
      this.ctx.service.sqltrace.addTrace({
        startTime, endTime, state: 1, SQL, report, type: 0
      })

      return cb ? cb(data, offset, report) : this.makeId(data, offset, report)
    } catch (err) {
      const endTime = Date.now()
      this.ctx.service.sqltrace.addTrace({
        startTime, endTime, state: 0, SQL, report, type: 0
      })
    }
  }

  async buildExcel(report, {
    pageSize, current, filename, clearSource
  }, tpl) {
    const offset = (current - 1) * pageSize
    const _report = {
      ...report,
      limit: pageSize,
      offset
    }
    this.cacheReport = _report
    const SQL = this.buildSQL(_report)
    try {
      await this.ctx.service.excel.build(SQL, _report, { filename, clearSource }, tpl)
      await this.ctx.service.excel.calc(filename)
      return filename
    } catch (e) {
      console.log('=========buildExcel=============')
      console.log(e)
      console.log('====================================')
      return filename
    }
  }

  // 临时用的
  async getMasterColumn(report) {
    const { SQL } = report

    return this.query(SQL)
  }

  async getMasterData(report, { pageSize, current }) {
    const { SQL } = report
    const offset = (current - 1) * pageSize
    const startTime = Date.now()
    let data = null
    try {
      data = await this.query(SQL)
      const endTime = Date.now()
      this.ctx.service.sqltrace.addTrace({
        startTime, endTime, state: 1, SQL, report, type: 0
      })
      return this.makeId(data, offset, report)
    } catch (err) {
      const endTime = Date.now()
      this.ctx.service.sqltrace.addTrace({
        startTime, endTime, state: 0, SQL, report, type: 0
      })
    }

    return this.makeId(data, offset, report)
  }

  async getMasterCount(report) {
    const { SQL } = report
    this.cacheReport = report
    const data = await this.query(SQL)

    return this.converntTotal(data)
  }

  async getReportCount(report) {
    const SQL = this.buildSQL(report, 'parserCountSQL')
    this.cacheReport = report
    const data = await this.query(SQL)

    return this.converntTotal(data)
  }

  converntTotal(data) {
    if (data.length) {
      return Object.values(data[0])[0]
    }

    return 0
  }

  makeId(data, offset, report) {
    return data.map((row, index) => ({
      id: hash(`${JSON.stringify(report)}.${index + offset}`),
      row: this.makeRow(row, report)
    }))
  }

  makeRow(row, report) {
    const names = Object.keys(row)
    const values = Object.values(row)
    const { columns } = report
    const keys = columns.map(item => item.dataIndex)

    return values.map((value, idx) => ({
      id: hash(`${JSON.stringify(report)}.${keys[idx]}.${idx}`),
      column: keys[idx],
      name: names[idx],
      value
    }))
  }

  makeSql(data) {
    const { sql, values } = data
    return this.app.rds.query(sql.replace(/dw_sec/g, dw), values)
  }

  async getCat(ids) {
    const sql = `
      select id, cat_name
      from sxc_ic.sxc_item_cat
      where id in (${ids.join(',')})
    `
    const res = await this.query(sql)

    return res
  }
}

module.exports = Rds
