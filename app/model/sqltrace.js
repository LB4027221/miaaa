module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types


  const SqlTraceSchema = new Schema({
    reportId: ObjectId,
    reportName: String,
    opratorTime: {
      type: Date,
      default: Date.now
    },
    sqlcount: {
      type: ObjectId,
      ref: 'Sqlcount'
    },
    durationTime: Number,
    sql: String,
    state: Number, // 0: 失败 1: 成功
    type: String // 0: 查询 1: 导出
  })

  return conn.model('SqlTrace', SqlTraceSchema)
}

