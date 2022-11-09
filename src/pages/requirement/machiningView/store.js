import { init } from '@rematch/core'
import axios from 'axios'
import R from 'ramda/src'
import { initEditedReportQuery, queryTargets } from './gql/query'
import {
  base64,
  componentTemplate,
  joinTemplate,
  regionTemplate,
  metaTemplate,
  orderByTemplate,
  havingByTemplate,
  groupByComponentTemplate,
  tranTargetTreeData
} from './util'


const editReport = {
  state: {},
  reducers: {
    setReport: (state, payload) => payload,
    initEditedReport: (state, payload) => payload
  },
  effects: {
    async initEditedReportAsync(_id) {
      const { data: { data } } = await axios.post('/graphql', {
        query: initEditedReportQuery(JSON.stringify(_id))
      })
      const { report } = data
      data.groupBy = report.groupBy
      data.metaList = report.metaList.map((item, index) => ({
        ...item,
        key: base64(`Meta:${index}`)
      }))
      data.regionComponent = report.regionComponent.map((item, index) => ({
        ...item,
        key: base64(`RegionComponent:${index}`)
      }))

      data.where = report.fullComponents.map((item, index) => ({
        ...item,
        key: base64(`Component:${index}`)
      }))
      data.having = report.having.map((item, index) => ({
        ...item,
        key: base64(`Having:${index}`)
      }))

      data.joins = report.joins.map((item, index) => ({
        ...item, key: base64(`Join:${index}`)
      }))

      data.orderBy = report.orderBy.map((item, index) => ({
        ...item, key: base64(`Join:${index}`)
      }))

      data.metaList = data.metaList.length
        ? data.metaList
        : [metaTemplate()]

      data.regionComponent = data.regionComponent.length
        ? data.regionComponent
        : [regionTemplate()]

      data.where = data.where.length
        ? data.where
        : [componentTemplate.Search()]

      data.having = data.having.length
        ? data.having
        : [havingByTemplate()]

      data.joins = data.joins.length
        ? data.joins
        : [joinTemplate()]

      data.orderBy = data.orderBy.length
        ? data.orderBy
        : [orderByTemplate()]
      data.target = report.target
      data.cname = report.cname
      data.usedOn = report.usedOn
      data.targets = report.targets
      data.alias = report.alias
      data.isRealTime = report.isRealTime
      data.tags = report.tags
      data.restApi = report.restApi
      data.expJoin = report.expJoin
      data.optGroupBy = report.optGroupBy
      data.limit = report.limit
      data.table = report.table
      data.name = report.name
      data.tabBrothers = report.tabBrothers
      data.databaseArr = report.databaseArr
      report.groupByComponents = report.groupByComponents.length
        ? report.groupByComponents
        : [groupByComponentTemplate()]
      data.groupByComponents = report.groupByComponents
      data.child = report.child
      data.friend = report.friend
      data.pickHouse = report.pickHouse
      data.sort = report.sort
      data.databases = data.database
      data.database = data.report.database
      this.initEditedReport(data)
    }
  }
}
const database = {
  state: [],
  reducers: {
    'editReport/initEditedReport': (state, payload) => payload.databases
  }
}
const metaList = {
  state: [],
  reducers: {
    initMetalist: (state, payload) => ([...payload]),
    addMetaList: (state, payload) => {
      state.splice(payload.index, 0, payload.item)
      return [...state]
    },
    // eslint-disable-next-line
    setMetaList: (state, payload) => state.map(((item, index) => (index === payload.index ? payload.item : item))),
    delMeta: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    }
  }
}

const regionComponent = {
  state: [],
  reducers: {
    'editReport/initEditedReport': (state, payload) => payload.regionComponent,
    // eslint-disable-next-line
    setRegion: (state, payload) => state.map(((item, index) => (index === payload.index ? payload.item : item))),
    addRegion: (state, payload) => {
      state.splice(payload.index, 0, payload.item)
      return [...state]
    },
    delRegion: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    }
  }
}


const where = {
  state: [componentTemplate.Search()],
  reducers: {
    initWhere: (state, payload) => ([...payload]),
    // eslint-disable-next-line
    setWhere: (state, payload) => state.map(((item, index) => (index === payload.index ? payload.item : item))),
    addWhere: (state, payload) => {
      state.splice(payload.index, 0, payload.item)
      return [...state]
    },
    delWhere: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    }

  }
}
const having = {
  state: [],
  reducers: {
    'editReport/initEditedReport': (state, payload) => payload.having,
    setOrderBy: (state, payload) => state.map(((item, index) => (index === payload.index ? payload.item : item))),
    addOrderBy: (state, payload) => {
      state.splice(payload.index, 0, payload.item)
      return [...state]
    },
    delOrderBy: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    }
  }
}
const join = {
  state: [],
  reducers: {
    'editReport/initEditedReport': (state, payload) => payload.joins,
    setJoin: (state, payload) => {
      const a = state.map(((item, index) => (index === payload.index ? payload.item : item)))
      console.log(a)
      return a
    },
    addJoin: (state, payload) => {
      state.splice(payload.index, 0, payload.item)
      return [...state]
    },
    delJoin: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    }
  }
}

const groupBy = {
  state: [],
  reducers: {
    'editReport/initEditedReport': (state, payload) => payload.groupBy,
    setGroupBy: (state, payload) => payload,
    addGroupBy: (state, payload) => {
      state.splice(payload.index, 0, payload.item)
      return [...state]
    },
    delGroupBy: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    }
  }
}

const orderBy = {
  state: [],
  reducers: {
    'editReport/initEditedReport': (state, payload) => payload.orderBy,
    setOrderBy: (state, payload) => state.map(((item, index) => (index === payload.index ? payload.item : item))),
    addOrderBy: (state, payload) => {
      state.splice(payload.index, 0, payload.item)
      return [...state]
    },
    delOrderBy: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    }
  }
}
const targets = {
  state: [],
  reducers: {
    setTargets: (state, payload) => payload,
    deleteTarget: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    },
    addTarget: (state, payload) => {
      state.push(payload)
      return [...state]
    }
  }
}
const treeData = {
  state: [],
  reducers: {
    setTreeData: (state, payload) => payload,
    deleteTreeData: (state, payload) => {
      state.splice(payload.index, 1)
      return [...state]
    },
    addTreeData: (state, payload) => {
      state.push(payload)
      return [...state]
    }

  },
  effects: {
    async setTreeDataSync(payload) {
      const databaseNames = R.pluck('database')(payload)
      const tablesNames = R.pluck('table')(payload)
      const { data: { data } } = await axios.post('/graphql', {
        query: queryTargets(
          JSON.stringify(databaseNames),
          JSON.stringify(tablesNames)
        )
      })
      let treeData = tranTargetTreeData(data.treeData)
      treeData = payload.map((item) => {
        let treeNode = {}
        const i = R.find(R.and(
          R.propEq('database', item.database),
          R.propEq('table', item.table)
        ))(treeData)
        treeNode = {
          ...i,
          value: item.key,
          label: item.alias
        }

        return treeNode
      })
      const diff = (a, b) => (a.label > b.label ? 1 : -1)
      treeData = R.sort(diff, treeData)
      this.setTreeData(treeData)
    },
    async addTreeDataSync(payload) {
      const { databaseName, tableName, target } = payload
      let { data: { data } } = await axios.post('/graphql', {
        query: queryTargets(
          JSON.stringify(databaseName),
          JSON.stringify(tableName)
        )
      })
      let treeData = R.compose(
        R.nth(0),
        tranTargetTreeData
      )(data.treeData)
      treeData.value = target.key
      treeData.label = target.alias

      treeData = R.pick(['value', 'label', 'children'])(treeData)
      this.addTreeData(treeData)
    }
  }
}

const store = init({
  models: {
    having,
    editReport,
    targets,
    treeData,
    metaList,
    groupBy,
    orderBy,
    where,
    regionComponent,
    join,
    database
  }
})

export default store
