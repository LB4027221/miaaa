module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId, Mixed } = Schema.Types

  const TplSchema = new Schema({
    title: String,
    report: {
      type: ObjectId,
      ref: 'Report'
    },
    filename: {
      type: String,
      unique: true
    },
    status: {
      default: 1,
      type: Number
    },
    pageSize: {
      default: 50,
      type: Number
    },
    creator: {
      type: ObjectId,
      ref: 'User'
    },
    editor: {
      type: ObjectId,
      ref: 'User'
    },
    conf: Mixed
  }, {
    timestamps: { createdAt: 'created', updateAt: 'lastModified' }
  })

  return conn.model('Tpl', TplSchema)
}

