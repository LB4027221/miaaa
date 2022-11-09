const fs = require('fs-extra')
// const R = require('ramda')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const path = require('path')
const {
  filter, isEmpty, toPairs, fromPairs, map, compose, mergeAll, pathOr
} = require('ramda/src')
const myTask = require('../../../lib/schedule')

const r = p => path.resolve(__dirname, '../../../output', p)
const r2 = p => path.resolve(__dirname, '../../../template', p)
// const indexById = R.indexBy(R.prop('_id'))

// const getUserId = pathOr('', ['userId'])

const filterEmpty = filter(i => !isEmpty(i))
const mapKey = compose(
  fromPairs,
  map(i => [i[0].split(' ')[1], filterEmpty(i[1])]),
  toPairs
)
const mapConf = compose(
  filterEmpty,
  mapKey,
  filterEmpty
)

class Tpl {
  constructor(ctx) {
    this.ctx = ctx
  }

  findOne(user, arg) {
    const { report } = arg
    return this.ctx.service.tpl.findOne({ report })
  }

  async update(user, args) {
    const { filename, ws, data } = args
    const opt = [JSON.stringify({
      filename: r2(filename),
      ws,
      data
    })]
    const res = await this.ctx.service.excel.update(opt)

    return {
      success: true,
      data: res
    }
  }

  async build(user, arg) {
    const { reportId, conf } = arg
    let report = await this.ctx.service.report
      .findById(reportId)
      // .toObject()
    // console.log(report)
    report = report.toObject()
    this.ctx.user = user

    const tpl = await this.ctx.model.Tpl
      .findOneAndUpdate({ report: reportId }, { conf: mapConf(conf) }, {
        new: true,
        upsert: true
      })
      .exec()


    const schedule = await this.ctx.model.Schedule
      .findOneAndUpdate({
        report: report._id
      }, {
        filename: arg.filename,
        interval: arg.interval,
        pageSize: arg.pageSize,
        report: report._id,
        clearSource: arg.clearSource,
        components: arg.components,
        tpl: tpl._id,
        creator: user._id
      }, {
        new: true,
        upsert: true
      })
      .exec()

    try {
      this.ctx.app.lockMap = this.ctx.app.lockMap || {}

      const next = async () => {
        this.ctx.app.lockMap = this.ctx.app.lockMap || {}
        await this.ctx.connector.report.build(report, arg, tpl)
        const _data = await this.read(tpl, {})
        this.cache(tpl, _data)

        this.ctx.app.lockMap[report._id] = null

        return _data
      }

      const t = this.ctx.app.lockMap[report._id]

      if (t) {
        await t
        this.ctx.app.lockMap[report._id] = null
      }

      const _data = next()
      this.ctx.app.lockMap[report._id] = _data
      const _d = await _data
      // 在 task 里面加入
      const _schedule = await this.ctx.model.Schedule
        .findById(schedule._id)
        .populate('creator editor')
        .populate({
          path: 'report',
          model: 'Report',
          populate: {
            model: 'Meta',
            path: 'metaList'
          }
        })
        .populate({
          path: 'tpl',
          model: 'Tpl',
          populate: {
            model: 'User',
            path: 'creator'
          }
        })
        .exec()
      myTask(this.ctx)(_schedule)

      return {
        success: true,
        _data: _d
      }
    } catch (e) {
      console.log('===========build error=================')
      console.log(e)
      console.log('====================================')
      return {
        success: false,
        data: e
      }
    }
  }

  async read(tpl, arg) {
    const path1 = r(tpl.filename)
    const filename = fs.existsSync(path1)
      ? path1
      : r2(tpl.filename)

    const { worksheets = [tpl.report.cname] } = arg
    const { conf = {} } = tpl
    const wb = await this.ctx.service.tpl.read(filename, worksheets, tpl._id)

    return wb.map(ws => ({ ...ws, conf: conf[ws.name] || null }))
  }

  async cache(tpl, data) {
    const filename = r(`${tpl._id}.json`)
    const exist = await fs.existsSync(filename)

    if (exist) {
      fs.removeSync(filename)
    }

    const adapter = await new FileAsync(filename)
    const db = await low(adapter)
    const dbdata = compose(
      mergeAll,
      map(d => ({ [d._id]: [d] }))
    )(data)

    db.defaults(dbdata)
      .write()
      .then(() => {
        this.ctx.app.messenger.broadcast('cacheBy', { filename, key: tpl._id })
      })
  }
}

module.exports = Tpl

