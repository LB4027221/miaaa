// import query from './tablesQuery.graphql'

// console.log(query)
export const queryDatabase = `
  database {
    value:name
    label:name
    children:tables {
      value:name
      label:name
    }
  }
`

export const queryTables = names => `
  {
    database(names: ${names}) {
      value:name
      label:name
      children:tables {
        value:name
        label:name
      }
    }
  }
`

export const queryColumns = (databaseNames, tablesNames) => `
  {
    treeData:database(names: ${databaseNames}) {
      value: name
      label: name
      children:tables(names: ${tablesNames}) {
        value: name
        label: name
        children:columns{
          value: name
          label: name
          type
        }
      }
    }
  }
`
export const queryTargets = (databaseNames, tablesNames) => `
  {
    treeData:database(names: ${databaseNames}) {
      database:name
      tables(names: ${tablesNames}) {
        table:name
        children:columns{
          value: name
          label: name
          type
        }
      }
    }
  }
`
export const queryReport = _id => `
  report(_id:${_id}){
    restApi
    alias
    usedOn
    friend{
      _id
      cname
    }
    child{
      _id
      cname
    }
    pickHouse
    name
    cname
    table
    isRealTime
    tags
    tabBrothers{
      _id
    }
    database
    databaseArr
    target
    targets {
      database
      table
      alias
      key
    }
    remarks
    metaList {
      _id
      double
      target
      expression
      name
      cname
      alias
      type
      annotate
      child
      unit
      passWhere
    }
    joins {
      type
      leftColumn
      leftTarget
      rightColumn
      rightTarget
    }
    having{
      target
      column
      type
    }
    components {
      target
      where
      column
      show
      name
      label
      appEntry
      source
      sourceKey
      roles
      independent {
        useToday
        placeholder
        labels
        options
      }
    }
    fullComponents {
      target
      where
      column
      show
      name
      label
      appEntry
      source
      sourceKey
      roles
      independent {
        useToday
        placeholder
        labels
        options
      }
    }
    groupBy{
      target
      column
    }
    orderBy{
      target
      column
      type
    }
    optOrderBy
    regionComponent{
      name
      show
      active
      options
      where
      cityTarget
      cityColumn
      storeHouseTarget
      storeHouseColumn
    }
    optGroupBy
    groupByComponents{
      key
      options
      text
    }
    expJoin
    status
    limit
    sort
  }
`

export const initEditedReportQuery = _id => `
  {
    ${queryDatabase}
    ${queryReport(_id)}
    reports{
      cname
      _id
      usedOn
    }
  }
`

export const initTreeDataAndDatabaseQuery = (databaseNames, tableNames) => `
  {
    database {
      value:name
      label:name
      children:tables {
        value:name
        label:name
      }
    }
    treeData:database(names: ${databaseNames}) {
      value: name
      label: name
      children:tables(names: ${tableNames}) {
        value: name
        label: name
        children:columns{
          value: name
          label: name
          type
        }
      }
    }
  }
`
