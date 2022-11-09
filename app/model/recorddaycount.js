module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')

  const RecordDayCountSchema = new Schema({
    accessCount: {
      type: Number,
      default: 0
    },
    exportCount: {
      type: Number,
      default: 0
    },
    date: Date
  })

  return conn.model('Recorddaycount', RecordDayCountSchema)
}

