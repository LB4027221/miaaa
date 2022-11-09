import React from 'react'
import { withProps, renderNothing, branch, renderComponent } from 'recompose'
import converge from 'ramda/src/converge'
import useWith from 'ramda/src/useWith'
import find from 'ramda/src/find'
import findIndex from 'ramda/src/findIndex'
import pipe from 'ramda/src/pipe'
import nthArg from 'ramda/src/nthArg'
import propEq from 'ramda/src/propEq'
import dissoc from 'ramda/src/dissoc'
import drop from 'ramda/src/drop'
import take from 'ramda/src/take'
import map from 'ramda/src/map'
import compose from 'ramda/src/compose'
import fromPairs from 'ramda/src/fromPairs'
import zipWith from 'ramda/src/zipWith'
import zipObj from 'ramda/src/zipObj'
import pathOr from 'ramda/src/pathOr'
// import _props from 'ramda/src/props'
import filter from 'ramda/src/filter'
import mergeAll from 'ramda/src/mergeAll'
import values from 'ramda/src/values'
// import evolve from 'ramda/src/evolve'
import pick from 'ramda/src/pick'
import path from 'ramda/src/path'
import toPairs from 'ramda/src/toPairs'
import flatten from 'ramda/src/flatten'
import prop from 'ramda/src/prop'
import uniq from 'ramda/src/uniq'
import pluck from 'ramda/src/pluck'
import indexBy from 'ramda/src/indexBy'
import mergeDeepRight from 'ramda/src/mergeDeepRight'
// import identity from 'ramda/src/identity'
import groupBy from 'ramda/src/groupBy'
import not from 'ramda/src/not'
import isEmpty from 'ramda/src/isEmpty'
import gte from 'ramda/src/gte'
import length from 'ramda/src/length'
import _tap from 'ramda/src/tap'
import findDeep from 'find-deep'
import pinyinFn from 'pinyin'
import identity from 'ramda/src/identity'
import DataSet from '@antv/data-set'
import moment from 'moment'
import Loading from '@component/loadable/loading2'
import numeral from 'numeral'
import { isMobile } from 'react-device-detect'
import 'moment/locale/zh-cn'

numeral.register('locale', 'chs', {
  delimiters: {
    thousands: ',',
    decimal: '.'
  },
  abbreviations: {
    thousand: '千',
    million: '百万',
    billion: '十亿',
    trillion: '兆'
  },
  ordinal: function (number) {
    return '.';
  },
  currency: {
    symbol: '¥'
  }
})

numeral.locale('chs')
moment.locale('zh-cn')

const tap = _tap(console.log)
const debug = withProps(console.log)
const ds = new DataSet()

const findBy = propKey => converge(
  find,
  [pipe(nthArg(0), propEq(propKey)), nthArg(1)]
)

const findByPath = findBy('path')

const getRoutes = (obj, _path) =>
  findDeep(obj, value => value.path === _path)

const pinyin = p => pinyinFn(p, {
  style: pinyinFn.STYLE_NORMAL
})

// 渲染表数据
// 双行支持
const renderDouble = columns => (text, record) => (
  <div>
    <span>{record[columns[0]]}</span>
    <br />
    <span style={{ color: '#999' }}>{record[columns[1]]}</span>
  </div>
)
const mapColumn = map(column => (column.dataIndex.split('.').length > 1
  ? { ...column, render: renderDouble(column.dataIndex.split('.')) }
  : column))

const mapDataSource = map((item, index) => {
  const { row } = item
  const pickKeyVal = compose(
    values,
    pick(['column', 'value'])
  )
  const _values = compose(
    mergeAll,
    fromPairs,
    map(pickKeyVal)
  )(row)

  return {
    key: `${item.id}:${index}`,
    ..._values
  }
})

const isMoney = (key) => {
  if (key) {
    const _key = key.toLowerCase()
    return _key.includes('gmv') || _key.includes('额') || _key.includes('总价') || _key.includes('价格')
  }

  return false
}
const addW = key => (key && key.includes('万')
  ? '万'
  : '')
const yuan = val => `¥${val}`
const formatToYuan = (key, val) => (isMoney(key)
  ? `${yuan(val)}${addW(key)}`
  : val)

// 报表展示页-提取前两个组件展示
const groupByName = groupBy((component) => {
  switch (component.name) {
    case 'SelectIn':
      return 'SelectIn'
    case 'Search':
      return 'Search'
    case 'datePicker':
      return 'datePicker'
    default:
      return 'RangePicker'
  }
})

// const indexByName = indexBy(prop('name'))
const takeFirstAndSecond = width => (items) => {
  const takeNum = (width - 82) / 270

  return take(Math.floor(takeNum), items)
}
const pickComponents = pick(['SelectIn', 'Search', 'RangePicker', 'datePicker'])
const takeThreeComponents = width => compose(
  groupByName,
  takeFirstAndSecond(width),
  flatten,
  values,
  map(values),
  pickComponents
)

// 报表展示页-提交之前把数据格式还原成原来组件的数据格式
const beforeSubmit = compose(
  map(zipObj(['_id', 'where'])),
  toPairs
)

// 报表展示页-如果只用两个组件或小于，直接使用 simple
const lteThree = width => len => (width - 72) > len * 270
const lessThanThree = width => compose(
  lteThree(width),
  length,
  flatten,
  values,
  map(values),
  pickComponents
)

// 报表展示页-将 ID 作为索引，方便更新数据
const indexById = indexBy(prop('_id'))
const indexByKey = indexBy(prop('key'))

// 报表展示页-初始化组件的值，用与持久缓存用户的选择等，第一个参数是原组件，第二个参数是默认值
const pickComponentsAndIndex = compose(
  map(indexById),
  pick(['SelectIn', 'Search', 'RangePicker', 'datePicker'])
)
const groupAndIndex = compose(map(indexById), groupByName)
const initComponent = useWith(
  mergeDeepRight,
  [pickComponentsAndIndex, groupAndIndex]
)

// 报表展示页-初始话数据
const flattenComponents = compose(
  flatten,
  values,
  pick(['SelectIn', 'Search', 'RangePicker', 'datePicker'])
)
const mapToKeyValue = compose(
  mergeAll,
  map(item => ({ [item._id]: item.where }))
)
const initComps = compose(
  mapToKeyValue,
  flattenComponents
)
const initSubmit = compose(
  map(item => ({ _id: item._id, where: item.where })),
  flattenComponents
)
const initReports = map(item => ({
  name: item._id,
  state: {
    __typename: item.__typename,
    components: initComps(item), // 用于组件状态
    submitComponents: initSubmit(item), // 用于提交
    defaultComponents: initSubmit(item), // 用于重置到默认值
    expand: false,
    pageSize: item.limit,
    current: 1
  },
  reducers: {
    toggle(state) {
      return {
        ...state,
        expand: !state.expand
      }
    },
    onChange(state, components) {
      return {
        ...state,
        ...components
      }
    },
    reset(state) {
      return {
        ...state,
        pageSize: state.pageSize,
        current: 1,
        submitComponents: state.defaultComponents,
        components: mapToKeyValue(state.defaultComponents)
      }
    },
    submit(state) {
      return {
        ...state,
        current: 1,
        submitComponents: beforeSubmit(state.components)
      }
    },
    onShowSizeChange(state, _, pageSize) {
      return {
        ...state,
        current: 1,
        pageSize
      }
    },
    changeCurrent(state, current) {
      return {
        ...state,
        current
      }
    }
  }
}))
const initReport = item => ({
  name: item._id,
  state: {
    __typename: item.__typename,
    components: initComps(item), // 用于组件状态
    submitComponents: initSubmit(item), // 用于提交
    defaultComponents: initSubmit(item), // 用于重置到默认值
    expand: false,
    pageSize: item.limit,
    current: 1
  },
  reducers: {
    toggle(state) {
      return {
        ...state,
        expand: !state.expand
      }
    },
    onChange(state, components) {
      return {
        ...state,
        ...components
      }
    },
    reset(state) {
      return {
        ...state,
        pageSize: state.pageSize,
        current: 1,
        submitComponents: state.defaultComponents,
        components: mapToKeyValue(state.defaultComponents)
      }
    },
    submit(state) {
      return {
        ...state,
        current: 1,
        submitComponents: beforeSubmit(state.components)
      }
    },
    onShowSizeChange(state, _, pageSize) {
      return {
        ...state,
        current: 1,
        pageSize
      }
    },
    changeCurrent(state, current) {
      return {
        ...state,
        current
      }
    }
  }
})

const initWsConf = ws => ({
  name: ws._id,
  state: ws.conf ? Object.assign({}, ws.conf) : {},
  reducers: {
    onChange(state, payload) {
      return {
        ...state,
        ...payload
      }
    }
  }
})

// 报表展示页-合并 labels 与 options
const zipLabels = zipWith((label, option) => ({
  title: label,
  key: option,
  value: option
}))
const mergeLabelsOptions = zipLabels

// 返回可以自证的列表
// const canIdentity = filter(identity)
const canIdentity = filter(compose(not, isEmpty))

const renderState = branch(
  props => props.state.loading,
  renderNothing
)

const renderWhileLoading = branch(
  props => props.data.loading,
  renderNothing
)

const renderWhileLoadingByName = name => branch(
  props => props[name].loading,
  renderNothing
)
const renderNothingByName = name => branch(
  props => props[name].loading,
  renderNothing
)
const renderWhileLoadingByTest = _test => branch(
  _test,
  renderComponent(Loading)
)
const renderNothingByTest = _test => branch(
  _test,
  renderNothing
)

// 工作台
const flattenGroup = compose(
  uniq,
  flatten,
  pluck('reportIds')
)

// 通过 _id 更新数组
const mergeById = converge(
  mergeDeepRight,
  [indexById, indexById]
)
const updateById = compose(
  values,
  mergeById
)

// 通过 _id 删除数组中的某一项
const removeByIdFirst = converge(
  dissoc,
  [nthArg(0), pipe(nthArg(1), indexById)]
)
const removeById = compose(
  values,
  removeByIdFirst
)

const filterId = filter(identity)
const findIdxBy = propKey => converge(
  findIndex,
  [pipe(nthArg(0), propEq(propKey)), nthArg(1)]
)

const with404 = testFn => branch(
  testFn,
  () => window.location.href = '#/404'
)

const tryNum = (val) => {
  const r = Number(val)

  return Number.isNaN(r) || !Number.isSafeInteger(Math.floor(r))
    ? val
    : r
}
const tryDate = (val) => {
  if (typeof val === 'number') {
    return val
  }
  try {
    const d = Date.parse(val)
    const _d = moment(d).utcOffset(0).format('YYYY.MM.DD')
    return _d !== 'Invalid date'
      ? _d
      : val
  } catch (e) {
    return val
  }
}
const tryDateClear = (val) => {
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
const tryNumOrDateClear = compose(tryDateClear, tryNum)
// [["A", "B"], [1, 2]] => {"A": [1], "B": [2]}
const mapExcelData = (data, columns) => {
  if (!data || !data.length) {
    return null
  }
  const init = columns.map(col => ({ [col]: [] }))
  const res = data.reduce((acc, item) => {
    item.forEach((i, idx) => {
      const key = columns[idx]
      acc[key].push(i)
    })

    return acc
  }, mergeAll(init))

  return res
}

const getCol = (data, idx, itemFilter) => {
  const _filter = itemFilter ? itemFilter.split(',') : []
  const res = data
    .map(row => row.filter((i, _idx) => _idx === idx)[0])
    .filter(item => !_filter.includes(item))
    .map(tryNumOrDateClear)

  return uniq(res)
}
const mapStackData = ({
  columns, item, percent, aggregate = 'sum', itemFilter, data, col, val
}) => {
  const itemIdx = columns.findIndex(i => i === item)
  const fields = getCol(data, itemIdx, itemFilter)
  const res = data.reduce((acc, _item) => {
    const __item = _item.map((i, idx) => {
      const key = columns[idx]

      return { [key]: tryNumOrDateClear(i) }
    })

    return [...acc, mergeAll(__item)]
  }, [])

  const _aggregate = aggregate || 'sum'
  const state = {
    col,
    val
  }

  const ds = new DataSet({ state })

  const dv = ds.createView().source(res)
    .transform({
      type: 'aggregate',
      fields: [percent],
      operations: [_aggregate],
      as: 'percent',
      groupBy: [item]
    })
    .transform({
      type: 'filter',
      callback(row) {
        if (!ds.state.col) {
          return true
        } else if (ds.state.val && ds.state.val.length) {
          return ds.state.val.includes(row[ds.state.col])
        }
        return true
      }
    })
    .transform({
      type: 'filter',
      callback(row) {
        return fields.includes(row[item])
      }
    })
    .transform({
      type: 'filter',
      callback(row) {
        if (!ds.state.col) {
          return true
        } else if (ds.state.val && ds.state.val.length) {
          return ds.state.val.includes(row[ds.state.col])
        }
        return true
      }
    })
    .transform({
      type: 'percent',
      field: 'percent',
      dimension: item,
      as: 'percent'
    })

  // console.log('_aggregate', _aggregate, percent)
  const total = ds.createView().source(res)
    .transform({
      type: 'aggregate',
      fields: [percent],
      operations: [_aggregate],
      as: 'count',
      groupBy: [item]
    })
    .transform({
      type: 'filter',
      callback(row) {
        return fields.includes(row[item])
      }
    })


  return {
    dv,
    ds,
    total
  }
}
const mapIntervalData = (x, y) => (data) => {
  const columns = data[0]
  const _data = drop(1, data)
  // [["A", "B"], [1, 2]] => [{ "A": 1, "B": 2 }]
  const res = _data.reduce((acc, item) => {
    const _item = item.map((i, idx) => {
      const key = columns[idx]

      return { [key]: tryNumOrDateClear(i) }
    })

    return [...acc, mergeAll(_item)]
  }, [])
  const dv = ds.createView().source(res)
    .transform({
      type: 'fold',
      fields: y,
      key: 'name',
      value: 'yAxis'
    })
  return dv
}


const mapChartData = ({
  columns,
  item,
  aggregate = ['sum'],
  fields,
  groupBy,
  itemFilter,
  key = 'color',
  value = 'yAxis',
  col = '',
  val = []
}) => (data) => {
  const itemIdx = columns.findIndex(i => i === item)
  const colFields = getCol(data, itemIdx, itemFilter)
  const res = data.reduce((acc, _item) => {
    const __item = _item.map((i, idx) => {
      const key = columns[idx]

      return { [key]: tryNumOrDateClear(i) }
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
      type: 'filter',
      callback(row) {
        return !col
          ? true
          : val && val.length
            ? val.includes(row[col])
            : true
      }
    })
    .transform({
      type: 'aggregate',
      fields: _fields,
      operations,
      as: _fields,
      groupBy: [...groupBy]
    })
    .transform({
      type: 'fold',
      fields: _fields,
      // 展开字段集
      key,
      // key字段
      value
    })

  return dv
}

const mapCardData = ({
  columns,
  item,
  aggregate,
  itemFilter,
  value = 'yAxis',
  groupBy = []
}) => (data) => {
  const itemIdx = columns.findIndex(i => i === item)
  const colFields = getCol(data, itemIdx, itemFilter)
  const res = data.reduce((acc, _item) => {
    const __item = _item.map((i, idx) => {
      const key = columns[idx]

      return { [key]: tryNumOrDateClear(i) }
    })

    return [...acc, mergeAll(__item)]
  }, [])

  const dv = ds.createView().source(res)
    .transform({
      type: 'filter',
      callback(row) {
        return colFields.includes(row[item])
      }
    })
    .transform({
      type: 'aggregate',
      fields: [item],
      operations: [aggregate],
      as: [value],
      groupBy
    })
    .transform({
      type: 'sort',
      callback(a, b) {
        return moment(a[groupBy]).isBefore(b[groupBy])
          ? -1
          : 1
      }
    })

  return dv
}


const asMap = ['y1', 'y2']

const mapTimelineData = ({
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

      return { [key]: tryNumOrDateClear(i) }
    })

    return [...acc, mergeAll(__item)]
  }, [])

  const _fields = fields.filter(i => i)
  const operations = _fields
    .map((i, idx) => aggregate[idx] || 'sum')

  const as = _fields.map((field, idx) => asMap[idx])

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
      as,
      groupBy: [...groupBy]
    })

  return dv
}


const getChartId = path(['data', 'user', 'updateChart', 'data', '_id'])
const getChartAllData = pathOr([], ['chartData', 'user', 'chart', 'data', 'data'])
const getChartData = pathOr([], ['chart', 'data', 'data'])

const getChartsFromUser = compose(
  flatten,
  filter(length),
  pluck('charts'),
  path(['user', 'reports'])
)

const renderWhileIsMobile = Comp => branch(
  () => isMobile,
  renderComponent(Comp)
)
const renderNothingWhileIsMobile = branch(
  () => isMobile,
  renderNothing
)

export {
  renderNothingByTest,
  renderNothingWhileIsMobile,
  renderWhileIsMobile,
  mapCardData,
  mapTimelineData,
  initWsConf,
  getChartAllData,
  getChartData,
  getChartsFromUser,
  mapStackData,
  getChartId,
  mapChartData,
  mapIntervalData,
  mapExcelData,
  with404,
  filterId,
  removeById,
  updateById,
  flattenGroup,
  initReport,
  initReports,
  tap,
  debug,
  findBy,
  findIdxBy,
  renderState,
  renderWhileLoading,
  renderWhileLoadingByName,
  renderNothingByName,
  findByPath,
  getRoutes,
  take,
  formatToYuan,
  pinyin,
  lessThanThree,
  takeThreeComponents,
  indexById,
  indexByKey,
  canIdentity,
  mergeLabelsOptions,
  beforeSubmit,
  mapDataSource,
  mapColumn,
  initComponent,
  isEmpty,
  groupByName,
  tryNumOrDate,
  renderWhileLoadingByTest
}

