module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const ScompSchema = new Schema({
    name: String,
    cname: String,
    state: Number,
    sql: String,
    // 提交人
    user: {
      type: ObjectId,
      ref: 'User'
    },
    // 编辑人
    editor: {
      type: ObjectId,
      ref: 'User'
    }
  }, {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
  })

  return conn.model('Scomp', ScompSchema)
}

