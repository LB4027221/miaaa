module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const MasterSchema = new Schema({
    cname: {
      type: String,
      unique: true
    },
    // 提交人
    user: {
      type: ObjectId,
      ref: 'User'
    },
    // 编辑人
    editor: {
      type: ObjectId,
      ref: 'User'
    },
    usedOn: [
      String
    ],
    // 标签 主要区分是概要报表还是详情报表
    tags: [
      String
    ],
    SQL: String,
    countSQL: String,
    // 查询条件
    components: [{
      state: {
        type: Number,
        default: 1
      },
      key: String,
      cname: String,
      name: String,
      defaultValue: String,
      label: String
    }],
    // 状态
    // 3 查看报表
    // 4 状态为下线 其他状态为可见
    // 下线的报表访问直接 404，也不会出现在报表列表
    status: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 25
    }
  }, {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
  })

  return conn.model('Master', MasterSchema)
}
