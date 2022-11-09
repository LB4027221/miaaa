const { Service } = require('egg')
const { PythonShell } = require('python-shell')
const { resolve } = require('path')
// const fse = require('fs-extra')
const { spawn } = require('child_process')
const execa = require('execa')
const {
  filter, isEmpty, toPairs, fromPairs, map, compose
} = require('ramda/src')

const r = p => resolve(__dirname, '../../', p)
const filterEmpty = filter(i => !isEmpty(i))
const mapKey = caseDateMap => compose(
  map(i => (i.dateRange ? { ...i, dateRange: caseDateMap(i.dateRange) } : i)),
  fromPairs,
  map(i => [i[0].split(' ').pop().trim(), filterEmpty(i[1])]),
  toPairs
)
const mapConf = caseDateMap => compose(
  filterEmpty,
  mapKey(caseDateMap),
  filterEmpty
)

const defaultOptions = {
  mode: 'text',
  scriptPath: r('py')
}

const filePath = name => r(`./template/${name}`)
const fileOutPath = name => r(`./output/${name}`)
const fileCachePath = name => r(`./outputCache/${name}`)

class Excel extends Service {
  getAll() {
    return this.ctx.model.Excel
      .find()
      .populate('creator editor')
      .exec()
  }

  calc(filename) {
    const inputPath = fileCachePath(filename)
    const outputPath = fileOutPath(filename)
    const file = r('cs/writer/bin/Release/netcoreapp2.2/writer.dll')

    return new Promise((_resolve) => {
      const childProcess = execa('dotnet', [
        file,
        inputPath,
        outputPath
      ])

      const output = []

      childProcess.stderr.on('data', this.onError)
      childProcess.stdout.on('data', (chunk) => {
        output.push(chunk)
      })
      childProcess.on('close', () => {
        _resolve(output.join('').toString('utf8'))
      })
    })
  }

  async build(sql, report, { filename, clearSource }, tpl) {
    const { cname } = report
    const _conf = mapConf(this.ctx.app.utils.create.caseDateMap)(tpl.conf || {})
    const args = [JSON.stringify({
      worksheetName: cname,
      sql,
      output: fileCachePath(filename),
      filename: filePath(filename),
      host: this.ctx.app.config.rds.client.host,
      user: this.ctx.app.config.rds.client.user,
      passwd: this.ctx.app.config.rds.client.password,
      conf: _conf,
      clearSource: clearSource === undefined ? true : clearSource
    })]
   
    const file = r('./py/build.py')
    const res = await this.process(file, args, this.onError)
    return res
  }

  update(opt) {
    const file = r('./py/update.py')

    return this.process(file, opt, this.onError)
  }

  read(opt) {
    const file = r('./py/read.py')

    return this.process(file, opt.args, this.onError)
  }

  onError(data) {
    console.log(data.toString())
  }

  process(file, args, onError) {
    return new Promise((_resolve, reject) => {
      const output = []
      const childProcess = spawn('python3', [
        `${file}`,
        ...args
      ])

      childProcess.stderr.on('data', onError)
      childProcess.stdout.setEncoding('utf8')
      childProcess.stdout
        .on('data', (chunk) => {
          output.push(chunk)
        })
      childProcess.on('close', (exitCode) => {
        if (exitCode) return reject()

        const out = output.join('')
        try {
          const d = JSON.parse(out.toString('utf8'))
          _resolve(d)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  create(opt, arg, user) {
    const option = {
      ...defaultOptions,
      ...opt
    }
    return new Promise((_resolve) => {
      PythonShell.run('create.py', option, async (err) => {
        if (err) {
          this.ctx.throw(500, 'Error', {
            errors: [{
              message: '创建失败',
              detail: err
            }]
          })
        }

        const data = await this.save(arg, user)
        _resolve(data)
      })
    })
  }

  save(arg, user) {
    return new this.ctx.model.Excel({
      title: arg.title,
      creator: user._id
    }).save()
  }
}

module.exports = Excel

