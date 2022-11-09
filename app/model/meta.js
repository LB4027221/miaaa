module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const { ObjectId, Mixed } = Schema.Types
  const conn = app.mongooseDB.get('miaaa')

  const MetaSchema = new Schema({
    name: String,
    cname: String,
    type: {
      type: String,
      default: 'function'
    },
    dataType: {
      type: String
    },
    // 字段逻辑
    annotate: String,
    // 表名
    database: String,
    table: {
      type: String
    },
    alias: String,
    target: String,
    // 列名
    column: String,
    as: String,
    // SQL 查询方法
    queryStr: String,
    expression: Mixed,
    endUserId: Number,
    user: { type: ObjectId, ref: 'User' },
    report: { type: ObjectId, ref: 'Report' },
    // app 上显示的单位
    unit: String,
    // 子报表
    child: { type: ObjectId, ref: 'Report' },
    // 下段传参
    passWhere: String,
    // 双行情况下的第二行
    double: { type: ObjectId, ref: 'Meta' }
  }, {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' },
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  })

  MetaSchema
    .virtual('status')
    .get(function makeV() {
      return this.table && this.column
        ? 2
        : 1
    })

  MetaSchema.pre('save', function preSave(next) {
    if (this.isNew) {
      const now = Date.now()
      this.createdAt = now
      this.updatedAt = now
    } else {
      this.updatedAt = Date.now()
    }

    next()
  })

  return conn.model('Meta', MetaSchema)
}
