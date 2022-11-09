module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const UserSchema = new Schema({
    userId: Number,
    userName: String,
    mobilePhone: String,
    cityCode: Number,
    sessionId: String,
    userType: Number,
    jobNo: Number,
    dingtalkUserId: String,
    dingtalkId: String,
    position: String,
    avatar: String,
    // 收藏
    favorite: [ObjectId]
  }, {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
  })

  return conn.model('User', UserSchema)
}

