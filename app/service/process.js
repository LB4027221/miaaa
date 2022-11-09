const { Service } = require('egg')
const { spawn } = require('child_process')
const path = require('path')

const r = p => path.resolve(process.cwd(), p)

class Process extends Service {
  async writeExcel({
    SQL, user, WORKSHEET
  }) {
    const now = Date.now()
    const publicPath = r(`./app/public/${user.userId}_${now}.xlsx`)
    const file = r('./py/fetch.py')
    const worksheetName = WORKSHEET
    const sql = SQL
    const output = publicPath

    await this.build(file, sql, worksheetName, output)

    return `public/${user.userId}_${now}.xlsx`
  }

  async build(file, sql, worksheetName, output) {
    const args = [JSON.stringify({
      worksheetName,
      sql,
      output,
      host: this.ctx.app.config.rds.client.host,
      user: this.ctx.app.config.rds.client.user,
      passwd: this.ctx.app.config.rds.client.password
    })]

    return this.process(file, args, this.onError)
  }

  onError(data) {
    console.log('===========onError============')
    console.log(data.toString())
    console.log('====================================')
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
}

module.exports = Process
