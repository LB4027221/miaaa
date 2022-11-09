module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const RecordSchema = new Schema({
    user: {
      type: ObjectId,
      ref: 'User'
    },
    report: {
      type: ObjectId,
      ref: 'Report'
    },
    // 1. 查看  2. 创建  3. 更新  4. 导出
    actionType: Number,
    count: {
      type: Number,
      default: 0
    },
    createAt: {
      type: Date,
      default: Date.now
    }
  })

  return conn.model('Record', RecordSchema)
}

