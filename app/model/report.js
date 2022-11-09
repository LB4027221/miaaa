module.exports = (app) => {
  const { mongoose } = app
  const { Schema } = mongoose
  const conn = app.mongooseDB.get('miaaa')
  const { ObjectId } = Schema.Types

  const ReportSchema = new Schema({
    // 实时数据 API
    restApi: String,
    // 应用范围 songxiaocai songxiaofu songxiaocang caimi maidashu songxiaocai-siji ...
    // not in dabiaoge 表示不在大表哥上展示
    usedOn: [
      String
    ],
    // 标签 主要区分是概要报表还是详情报表
    tags: [
      String
    ],
    alias: String,
    child: {
      type: ObjectId,
      ref: 'Report'
    },
    friend: {
      type: ObjectId,
      ref: 'Report'
    },
    // tab 时连接的报表
    tabBrothers: [{
      type: ObjectId,
      ref: 'Report'
    }],
    database: String,
    databaseArr: [String],
    // 报表名称
    cname: {
      type: String,
      unique: true
    },
    target: String,
    // 这个表单中所可能使用到的库
    targets: [{
      key: String,
      database: String,
      table: String,
      alias: String
    }],
    // 报表英文名
    name: String,
    table: String,
    isRealTime: {
      type: Boolean,
      default: false
    },
    groupBy: [{
      target: String,
      column: String
    }],
    optGroupBy: [
      String
    ],
    groupByComponents: [
      {
        options: [String],
        text: [String],
        value: String
      }
    ],
    orderBy: [{
      type: {
        type: String
      },
      target: String,
      column: String
    }],
    optOrderBy: [
      String
    ],
    regionComponent: [{
      name: {
        type: String,
        default: 'cityAndStoreHouse'
      },
      where: [String],
      cityTarget: String,
      cityColumn: String,
      storeHouseTarget: String,
      storeHouseColumn: String,
      active: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: false
      }
    }],
    limit: {
      type: Number,
      default: 15
    },
    sort: Number,
    joins: [{
      type: {
        type: String
      },
      leftColumn: String,
      leftTarget: String,
      rightColumn: String,
      rightTarget: String
    }],
    // 状态
    // 3 查看报表
    // 4 状态为下线 其他状态为可见
    // 下线的报表访问直接 404，也不会出现在报表列表
    status: {
      type: Number,
      default: 1
    },
    // 元数据字段
    metaList: [{
      type: ObjectId,
      ref: 'Meta'
    }],
    having: [{
      type: {
        type: String
      },
      target: String,
      column: String
    }],
    // 查询条件
    components: [{
      state: {
        type: Number,
        default: 1
      },
      // app 入口
      appEntry: {
        type: Boolean,
        default: false
      },
      source: String,
      sourceKey: String,
      roles: [String],
      label: String,
      target: String,
      column: String,
      where: [String],
      independent: {
        useToday: Boolean,
        options: [String],
        labels: [String],
        placeholder: String
      },
      show: Boolean,
      name: String
    }],
    SQL: String,
    expJoin: String,
    endUserId: Number,
    endEditorId: Number,
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
    // 需求编辑人
    requirementEditor: {
      type: ObjectId,
      ref: 'User'
    },
    remarks: String,
    cat: {
      type: Boolean,
      default: false
    },
    pickHouse: {
      type: Boolean,
      default: false
    },
    city: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
  })

  return conn.model('Report', ReportSchema)
}
