import R from 'ramda/src'

import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

const ALIAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
const addIndex = R.addIndex(R.map)

export const findIndexById = id => R.findIndex(R.propEq('_id', id))

export const findById = R.converge(
  R.find,
  [R.pipe(R.nthArg(0), R.propEq('_id')), R.nthArg(1)]
)

export const findByCname = R.converge(
  R.find,
  [R.pipe(R.nthArg(0), R.propEq('cname')), R.nthArg(1)]
)

export const findByAlias = R.converge(
  R.find,
  [R.pipe(R.nthArg(0), R.propEq('alias')), R.nthArg(1)]
)

export const converTarget = targets => item => ({
  ...item,
  key: base64(Date.now().toString()),
  alias: getAlias(targets)
})

const getAlias = (targets) => {
  if (targets.length && targets.length !== 1) {
    let lastTarget = targets[targets.length - 1]
    let lastTargetAliasIndex = ALIAS.indexOf(lastTarget.alias)

    return ALIAS[lastTargetAliasIndex + 1]
  }

  return ALIAS[targets.length]
}

export const tranTargetTreeData = R.reduce((acc, item) => {
  item.tables.forEach(table => {
    let i = {}

    i.database = item.database
    i.table = table.table
    i.children = table.children

    acc = acc.concat(i)
  })

  return acc
}, [])

export const mergeTargetTreeData = (x, y) => {
  return ({
    value: x.key,
    label: x.alias,
    children: y.children
  })
}

export const isTabType = ({ tags }) => tags.includes('detailTab')

export const findInTreeData = value => R.compose(
  R.find(R.propEq('value', value[1])),
  R.ifElse(
    R.isNil,
    R.assoc('children', []),
    R.prop('children')
  ),
  R.find(R.propEq('value', value[0]))
)

export const flattenTreeData = R.compose(
  R.uniq,
  R.map(
    tree => tree.reduce((acc, item) => {
      acc.value = item.value
      acc.label = item.label
      acc.children = acc.children
        ? [...acc.children, ...item.children]
        : [...item.children]

      return acc
    }, {})
  ),
  R.groupWith((a, b) => a.value === b.value)
)

export const base64 = i => Buffer.from(i, 'utf8').toString('base64')

export const regionTemplate = () => ({
  key: base64(Date.now().toString()),
  name: 'cityAndStoreHouse',
  active: false,
  show: false
})

export const metaTemplate = () => ({
  key: base64(Date.now().toString()),
  name: '',
  cname: '',
  alias: '',
  type: 'function',
  annotate: ''
})

export const joinTemplate = () => ({
  key: base64(Date.now().toString()),
  type: 'inner'
})

export const orderByTemplate = () => ({
  key: base64(Date.now().toString()),
  type: 'asc'
})
export const havingByTemplate = () => ({
  key: base64(Date.now().toString()),
  type: 'exp'
})

export const groupByComponentTemplate = () => ({
  key: base64(Date.now().toString()),
  options: [],
  text: []
})

export const addKeys = key => addIndex((item, index) =>
  ({ ...item, key: base64(`${key}:${index}`) })
)

export const componentTemplate = {
  RangePicker: () => ({
    key: base64(Date.now().toString()),
    name: 'RangePicker',
    show: true,
    independent: {
      useToday: true
    },
    where: [
      `'${moment(Date.now()).format('YYYY-MM-DD')} 00:00:00'`,
      `'${moment(Date.now()).format('YYYY-MM-DD')} 23:59:59'`
    ]
  }),
  Search: () => ({
    key: base64(Date.now().toString()),
    name: 'Search',
    show: true,
    label: '',
    independent: {
      placeholder: ''
    },
    where: []
  }),
  SelectIn: () => ({
    key: base64(Date.now().toString()),
    name: 'SelectIn',
    show: true,
    independent: {
      labels: [],
      options: []
    },
    where: []
  }),
  SSelectIn: () => ({
    key: base64(Date.now().toString()),
    name: 'SSelectIn',
    show: true,
    independent: {
      labels: [],
      options: []
    },
    where: []
  }),
  SelectInAuto: () => ({
    key: base64(Date.now().toString()),
    name: 'SelectInAuto',
    show: true,
    independent: {
      labels: [],
      options: []
    },
    where: []
  }),
  $in: () => ({
    key: base64(Date.now().toString()),
    name: '$in',
    show: false,
    where: []
  }),
  $nin: () => ({
    key: base64(Date.now().toString()),
    name: '$nin',
    show: false,
    where: []
  }),
  $equals: () => ({
    key: base64(Date.now().toString()),
    name: '$equals',
    show: false,
    where: []
  }),
  $ne: () => ({
    key: base64(Date.now().toString()),
    name: '$ne',
    show: false,
    where: []
  }),
  $lt: () => ({
    key: base64(Date.now().toString()),
    name: '$lt',
    show: false,
    where: []
  }),
  $gt: () => ({
    key: base64(Date.now().toString()),
    name: '$gt',
    show: false,
    where: []
  }),
  $lte: () => ({
    key: base64(Date.now().toString()),
    name: '$lte',
    show: false,
    where: ''
  }),
  $gte: () => ({
    key: base64(Date.now().toString()),
    name: '$gte',
    show: false,
    where: []
  })
}

