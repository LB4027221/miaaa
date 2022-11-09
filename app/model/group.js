module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const GroupSchema = new Schema({
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
    },
    name: String,
    reportIds: [ObjectId]
  }, {
    timestamps: { createdAt: 'created', updateAt: 'lastModified' }
  })

  return conn.model('Group', GroupSchema)
}

