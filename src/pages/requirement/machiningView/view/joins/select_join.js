import React from 'react'
import {
  Select,
  Table,
  Input,
  AutoComplete
} from 'antd'
import R from 'ramda/src'
import { connect } from 'react-redux'

// import {
//   addTarget,
//   delTarget,
//   addTreeData,
//   setReport,
//   delTreeData
// } from '../../action'
import { converTarget } from '../../util'

const { Option } = AutoComplete
// const formatValue = name => R.compose(
//   R.map(R.prop('label')),
//   R.filter(item => item.label !== name)
// )

const { TextArea } = Input

const SelectJoin = (props) => {
  let {
    database, dispatch, targets, treeData, report
  } = props
  let { expJoin } = report
  let dataSource = R.map(R.compose(R.pick(['database', 'table', 'alias'])))(targets)
  dataSource = dataSource.map((item, index) => ({
    key: `${Date.now()}${index}`,
    name: `${item.database}.${item.table}`,
    alias: item.alias
  }))

  const columns = [{
    title: '别名',
    key: 'alias',
    dataIndex: 'alias'
  }, {
    title: '数据库',
    key: 'name',
    dataIndex: 'name'
  }, {
    title: 'Action',
    key: 'action',
    render: (text, v) => (
      <span onClick={() => {
        v = v.name
        v = v.split('.')
        v = R.zipObj(['database', 'table'])(v)

        const findTarget = R.findIndex(R.and(
            R.propEq('database', v.database),
            R.propEq('table', v.table)
          ))

        let targetIndex = findTarget(targets)
        let target = targets[targetIndex]

        const findTreeData = R.findIndex(R.propEq('key', target.key))

        let treeDataIndex = findTreeData(treeData)

        // dispatch(delTarget({ index: targetIndex }))
        // dispatch(delTreeData({ index: treeDataIndex }))
        dispatch.targets.deleteTarget({ index: targetIndex })
        dispatch.treeData.deleteTreeData({ index: treeDataIndex })
      }}
      >
        删除
      </span>
    )
  }]
  let options = R.compose(
    R.flatten,
    R.map(({ value, children }) => R.map(child => `${value}.${child.value}`)(children))
  )(database)
  options = options.map(item =>
    (<Option key={item} value={item}>{item}</Option>))
  return (
    <div className='form-item'>
      <div>
        <Select
          showSearch
          style={{ width: 368, marginBottom: 10 }}
          placeholder='添加其他库的字段'
          onSelect={(value) => {
           
            value = value.split('.')
            value = R.zipObj(['database', 'table'])(value)
            value = converTarget(targets)(value)

            let databaseName = [value.database]
            let tableName = [value.table]

            // dispatch(addTreeData({ databaseName, tableName, target: value }))
            // dispatch(addTarget(value))
            dispatch.targets.addTarget(value)
            dispatch.treeData.addTreeDataSync({ databaseName, tableName, target: value })
          }}
        >
          {options}
        </Select>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </div>
      <TextArea
        autosize
        style={{
          marginLeft: 100,
          width: 328
        }}
        value={expJoin}
        onChange={({ target }) => {
          let { value } = target
          report.expJoin = value
          report = { ...report }

          dispatch.editReport.setReport({ ...report })
        }}
      />
      <br />

    </div>
  )
}

export default connect(state => ({
  targets: state.targets,
  report: state.editReport,
  treeData: state.treeData,
  database: state.database || []
}))(SelectJoin)
