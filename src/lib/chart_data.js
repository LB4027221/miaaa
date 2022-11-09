import mergeAll from 'ramda/src/mergeAll'
import uniq from 'ramda/src/uniq'
import compose from 'ramda/src/compose'
import DataSet from '@antv/data-set'
import moment from 'moment'

const getCol = (data, idx, itemFilter) => {
  const _filter = itemFilter ? itemFilter.split(',') : []
  const res = data
    .map(row => row.filter((i, _idx) => _idx === idx)[0])
    .filter(item => !_filter.includes(item))

  return uniq(res)
}

const mapTimelineData = ({
  columns,
  item,
  aggregate = ['sum'],
  fields,
  groupBy,
  itemFilter,
  key = 'color',
  value = 'yAxis',
  col = '',
  xAxis,
  val = [],
  data
}) => {
  const itemIdx = columns && columns.findIndex(i => i === item)
  const colFields = getCol(data, itemIdx, itemFilter)
  const _source = data.reduce((acc, _item) => {
    const __item = _item.map((i, idx) => {
      const key = columns[idx]

      return { [key]: i }
    })

    return [...acc, mergeAll(__item)]
  }, [])
  const source = _source.sort((a, b) => (moment(a[xAxis]).isBefore(b[xAxis]) ? -1 : 1))
  const _fields = fields.filter(i => i)
  const operations = _fields
    .map((i, idx) => aggregate[idx] || 'sum')
  const state = {
    start: source && source.length ? source[0][xAxis] : '',
    end: source && source[source.length - 1]
      ? source[source.length - 1][xAxis]
      : '',
    col,
    val
  }

  return {
    columns,
    item,
    aggregate,
    groupBy,
    itemFilter,
    key,
    value,
    col,
    val,
    colFields,
    operations,
    fields: _fields,
    xAxis,
    source,
    state
  }
}

const createDS = ({
  item,
  groupBy,
  source,
  key = 'color',
  value = 'yAxis',
  state,
  colFields,
  operations,
  fields,
  xAxis
}) => {
  const ds = new DataSet({ state })
  const dv = ds.createView()
  // console.log('source', source)
  dv.source(source)
    .transform({
      type: 'filter',
      callback(row) {
        return colFields.includes(row[item])
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
      type: 'filter',
      callback(row) {
        return moment(row[xAxis]).isSameOrAfter(ds.state.start)
        && moment(row[xAxis]).isSameOrBefore(ds.state.end)
      }
    })
    .transform({
      type: 'sort',
      callback: (a, b) => (moment(a[xAxis]).isBefore(b[xAxis])
        ? -1
        : 1)
    })
    .transform({
      type: 'aggregate',
      fields,
      operations,
      as: fields,
      groupBy: [...groupBy]
    })
    .transform({
      type: 'fold',
      fields,
      // 展开字段集
      key,
      // key字段
      value
    })
  // console.log(dv)
  // console.log(ds)
  // console.log(operations)
  return {
    dv,
    ds
  }
}

export { createDS }
export default compose(
  createDS,
  mapTimelineData
)
