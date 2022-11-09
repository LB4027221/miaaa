module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const ExcelSchema = new Schema({
    title: {
      type: String,
      unique: true
    },
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

  return conn.model('Excel', ExcelSchema)
}

