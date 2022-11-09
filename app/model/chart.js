module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId, Mixed } = Schema.Types

  const ChartSchema = new Schema({
    tpl: {
      type: ObjectId,
      ref: 'Tpl'
    },
    report: {
      type: ObjectId,
      ref: 'Report'
    },
    conf: Mixed,
    worksheet: String,
    chartType: String,
    title: String,
    grid: String,
    xAxis: String,
    yAxis: Mixed,
    AbbreviatedAxis: String,
    legend: String,
    tooltip: String,
    warningLine: String,
    auxiliaryLine: String,
    name: String
  }, {
    timestamps: { createdAt: 'created', updateAt: 'lastModified' }
  })

  return conn.model('Chart', ChartSchema)
}

