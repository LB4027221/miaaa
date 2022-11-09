const fs = require('fs')
const path = require('path')
const Controller = require('egg').Controller
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
// const fse = require('fs-extra')

class UploadController extends Controller {
  async index() {
    const ctx = this.ctx
    const stream = await ctx.getFileStream()
    const { reportId, userId } = stream.fields
    const filename = `${reportId}.xlsx`
    const target = path.join(this.config.baseDir, `template/${filename}`)
    const writeStream = fs.createWriteStream(target)

    const data = {
      creator: userId,
      editor: userId,
      report: reportId,
      title: stream.filename,
      filename
    }

    this.ctx.service.tpl.update(data)

    try {
      await awaitWriteStream(stream.pipe(writeStream))
    } catch (err) {
      await sendToWormhole(stream)
      throw err
    }
    ctx.body = {
      data
    }
  }
}

module.exports = UploadController
