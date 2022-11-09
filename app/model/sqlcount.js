module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types


  const SqlcountSchema = new Schema({
    reportId: ObjectId,
    count: Number,
    averageTime: Number,
    type: Number
  })

  return conn.model('Sqlcount', SqlcountSchema)
}

