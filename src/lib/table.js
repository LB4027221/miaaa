import { mergeAll, map, compose } from 'ramda/src'
import { mapIndexed } from 'ramda-extension'

const mapCol = col => ({ title: col, dataIndex: col, key: col })

// [a, b] => [{ key: a, title: a, dataIndex: a }, { key: b, title: b, dataIndex: b }]
export const mapToAntdTableCols = cols => cols.map(mapCol)

// [a, b] => [c, d] => [{a: c, b: d, key: idx}]
const mapRow = cols => compose(
  mergeAll,
  mapIndexed((col, idx) => ({ [cols[idx]]: col }))
)
export const mapToAntdTableDataSource = cols => data =>
  data.map((row, idx) => ({ key: `${idx}`, ...mapRow(cols)(row) }))
