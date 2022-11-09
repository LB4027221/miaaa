module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId, Mixed } = Schema.Types

  const ScheduleSchema = new Schema({
    tpl: {
      type: ObjectId,
      ref: 'Tpl'
    },
    report: {
      type: ObjectId,
      ref: 'Report'
    },
    pageSize: {
      type: Number,
      default: 100
    },
    components: Mixed,
    // 秒
    clearSource: {
      type: Boolean,
      default: true
    },
    interval: String,
    filename: String,
    // 1 正常 0 暂停
    status: {
      default: 1,
      type: Number
    },
    creator: {
      type: ObjectId,
      ref: 'User'
    },
    editor: {
      type: ObjectId,
      ref: 'User'
    }
  }, {
    timestamps: { createdAt: 'created', updateAt: 'lastModified' }
  })

  return conn.model('Schedule', ScheduleSchema)
}

