const DataSet = require('@antv/data-set')
const { mergeAll, compose } = require('ramda')
const moment = require('moment')

const ds = new DataSet()
const data = [
  [
    "进单时间",
    "城市名称",
    "服务站名",
    "客户id",
    "客户",
    "skuid",
    "品类id",
    "品类",
    "商品类型",
    "市场属性",
    "gmv",
    "件数",
    "成交额",
    "重量",
    "订单号",
    "sku名称",
    "供应商",
    "销售主管",
    "销售经理",
    "销售",
    "品类分组 ",
    "交易线",
    "吨位",
    "GMV(万)",
    "是否当日",
    "商品分组",
    "是否自有"
  ],
  [
    "2018/10/25",
    "北京市",
    "大洋路农贸市场",
    31771,
    "李甲宝",
    5810,
    148,
    "蒜籽",
    "采买",
    "一批",
    85600,
    4000,
    76668,
    48000,
    "181025382400000004",
    "山东蒜籽12斤塑料袋",
    "李秀青",
    null,
    null,
    null,
    "蒜籽",
    "云丰",
    24,
    8.56,
    "其他",
    "云丰",
    "非自有"
  ],
  [
    "2018/10/26",
    "北京市",
    "大洋路农贸市场",
    31771,
    "李甲宝",
    5810,
    148,
    "蒜籽",
    "采买",
    "一批",
    85600,
    4000,
    84000,
    48000,
    "181026323700000102",
    "山东蒜籽12斤塑料袋",
    "李秀青",
    null,
    null,
    null,
    "蒜籽",
    "云丰",
    24,
    8.56,
    "其他",
    "云丰",
    "非自有"
  ],
  [
    "2018/10/26",
    "北京市",
    "大洋路农贸市场",
    31771,
    "李甲宝",
    5810,
    148,
    "蒜籽",
    "采买",
    "一批",
    85600,
    4000,
    84000,
    48000,
    "181026833300000101",
    "山东蒜籽12斤塑料袋",
    "李秀青",
    null,
    null,
    null,
    "蒜籽",
    "云果",
    24,
    8.56,
    "其他",
    "云果",
    "非自有"
  ]
]

const tryNum = (val) => {
  const r = Number(val)
  return Number.isNaN(r)
    ? val
    : r
}
const tryDate = (val) => {
  if (typeof val === 'number') {
    return val
  }
  try {
    const d = Date.parse(val)
    const _d = moment(d).format('YYYY.MM.DD')
    return _d !== 'Invalid date'
      ? _d
      : val
  } catch (e) {
    return val
  }
}
const tryNumOrDate = compose(tryDate, tryNum)

const getCol = (data, idx, itemFilter) => {
  const _filter = itemFilter ? itemFilter.split(',') : []
  const res = data
    .map(row => row.filter((i, _idx) => _idx === idx)[0])
    .filter(item => !_filter.includes(item))

  return res
}

const mapChartData = ({
  columns,
  item,
  aggregate = ['sum'],
  fields,
  groupBy,
  itemFilter
}) => (data) => {
  const itemIdx = columns.findIndex(i => i === item)
  const colFields = getCol(data, itemIdx, itemFilter)
  const res = data.reduce((acc, _item) => {
    const __item = _item.map((i, idx) => {
      const key = columns[idx]

      return { [key]: tryNumOrDate(i) }
    })

    return [...acc, mergeAll(__item)]
  }, [])

  const _fields = fields.filter(i => i)
  const operations = _fields
    .map((i, idx) => aggregate[idx] || 'sum')

  const dv = ds.createView().source(res)
    .transform({
      type: 'filter',
      callback(row) {
        return colFields.includes(row[item])
      }
    })
    .transform({
      type: 'aggregate',
      fields: _fields,
      operations,
      as: ['y1', 'y2'],
      groupBy: [...groupBy]
    })
    // .transform({
    //   type: 'fold',
    //   fields: _fields,
    //   // 展开字段集
    //   key: 'color',
    //   // key字段
    //   value: 'yAxis'
    // })

  console.log(dv)

  return dv
}


const columns = data.shift()

const s = mapChartData({
  columns,
  aggregate: ['sum'],
  fields: ['gmv', '件数'],
  item: '交易线',
  groupBy: ['进单时间']
  // itemFilter: '云果'
})(data).rows

console.log(s)
