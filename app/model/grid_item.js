module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const GridItemSchema = new Schema({
    i: String,
    x: Number,
    y: Number,
    w: Number,
    h: Number,
    chart: {
      ref: 'Chart',
      type: ObjectId
    }
  }, {
    timestamps: { createdAt: 'created', updateAt: 'lastModified' }
  })

  return conn.model('GridItem', GridItemSchema)
}

