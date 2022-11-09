module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const GridSchema = new Schema({
    title: String,
    sort: Number,
    status: {
      default: 1,
      type: Number
    },
    description: String,
    snapshot: String,
    items: [{
      ref: 'GridItem',
      type: ObjectId
    }]
  }, {
    timestamps: { createdAt: 'created', updateAt: 'lastModified' }
  })

  return conn.model('Grid', GridSchema)
}

