module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const SubscriptionSchema = new Schema({
    dingtalkIds: [String],
    subscribers: [{
      type: ObjectId,
      ref: 'User'
    }],
    status: {
      default: 1,
      type: Number
    },
    chartId: String
  }, {
    timestamps: { createdAt: 'created', updateAt: 'lastModified' }
  })

  return conn.model('Subscription', SubscriptionSchema)
}

