const { Controller } = require('egg')
const { readFileSync, createReadStream } = require('fs')
const { resolve } = require('path')

const html = readFileSync(resolve(__dirname, '../index.html'))
class Home extends Controller {
  async page() {
    this.ctx.body = `${html}`
  }
  async downloadTpl() {
    const { q } = this.ctx.request.query
    const filename = q.split('/')[1]
    this.ctx.res.statusCode = 200
    this.ctx.set('Content-Type', 'application/force-download')
    this.ctx.set('Content-disposition', `attachment; filename=${filename}`)
    this.ctx.body = createReadStream(resolve(__dirname, `../../template/${q}`))
  }
  async downloadData() {
    const { q } = this.ctx.request.query
    const filename = q.split('/')[1]


    this.ctx.res.statusCode = 200
    this.ctx.set('Content-Type', 'application/force-download')
    this.ctx.set('Content-disposition', `attachment; filename=${filename}`)
    this.ctx.body = createReadStream(resolve(__dirname, `../../output/${q}`))
  }
}

module.exports = Home
