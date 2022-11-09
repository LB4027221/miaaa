import React from 'react'
import { AutoComplete } from 'antd'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators'
import { pinyin } from '@lib'
import head from 'ramda/src/head'

import { Link } from 'react-router-dom'

const { Option, OptGroup } = AutoComplete

const editDefault = {
  title: '编辑',
  children: []
}

const reportsDefault = {
  title: '我的报表',
  children: []
}

const visible = {
  state: false,
  reducers: {
    toggle(state) {
      return !state
    }
  }
}

// const requirementsDefault = {
//   title: '需求查看',
//   children: []
// }

const mapOpt = opt => (
  <Option key={opt.key} value={opt.value}>
    <Link to={opt.path} style={{ color: '#666', fontWeight: 200 }}>
      {opt.title}
    </Link>
  </Option>
)

const mapSuggesion = group => (
  <OptGroup
    label={group.title}
    key={group.title}
  >
    {group.children.map(mapOpt)}
  </OptGroup>
)

const reduceReports = (acc, item, index) => {
  const a = {
    title: item.cname,
    key: `${index + 1}`,
    value: item._id,
    path: `/report/${item._id}`
  }
  // const b = {
  //   title: item.cname,
  //   key: `${index + 2}`,
  //   path: `/requirement/machiningList/machiningView/${item._id}`
  // }

  const a1 = [...acc[0], a]
  // const a2 = [...acc[1], b]

  return [a1]
}

export const keyup$ = new Subject()
  .pipe(
    filter(text => text.length >= 1),
    debounceTime(300),
    distinctUntilChanged()
  )

const dataSource = {
  state: [[], []],
  reducers: {
    init(state, payload) {
      return [payload, []]
    },
    onSearch: (state, payload) => {
      const source = payload.length < 1
        ? []
        : state[0]
          .filter(item => item.cname.toLowerCase().includes(payload.toLowerCase())
            || pinyin(item.cname).map(head).join('').includes(payload))
          .slice(0, 4)
          .reduce(reduceReports, [[], []])
          .map((children, index) => {
            const c = index === 0 ? reportsDefault : editDefault

            return { ...c, children }
          })
          .map(mapSuggesion)
      return [state[0], source]
    }
  }
}

const keywords = {
  state: '',
  reducers: {
    onSearch(state, payload) {
      let _payload = payload.replace(/ƒ/g, '')
      _payload = _payload.replace(/\s/g, '')
      keyup$.next(_payload)

      return _payload
    },
    'visible/toggle': () => ''
  }
}

export default {
  visible,
  dataSource,
  keywords
}
