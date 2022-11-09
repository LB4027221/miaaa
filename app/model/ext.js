module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId, Mixed } = Schema.Types

  const ExtSchema = new Schema({
    title: String,
    columns: [Mixed],
    report: {
      type: ObjectId,
      ref: 'Report'
    },
    linkReports: [{
      type: ObjectId,
      ref: 'Report'
    }],
    linkExcel: [{
      type: ObjectId,
      ref: 'Excel'
    }],
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

  return conn.model('Ext', ExtSchema)
}

