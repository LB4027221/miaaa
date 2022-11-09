import React from 'react'
import {
  Cascader,
  Input,
  Table
} from 'antd'
import R from 'ramda/src'

import { connect } from 'react-redux'
// import { delGroupBy, setReport, addGroupBy } from '../../action'

const GroupBy = ({
  treeData, report, dispatch, groupBy
}) => {
  const { targets, optGroupBy } = report
  const getAlias = target => (targets.filter(t => t.key === target).length
    ? targets.filter(t => t.key === target)[0]
    : {})

  const dataSource = groupBy.map((item, index) => ({
    ...item,
    key: index,
    alias: getAlias(item.target).alias
  }))

  const columns = [{
    title: '别名',
    key: 'alias',
    dataIndex: 'alias'
  }, {
    title: '值',
    key: 'column',
    dataIndex: 'column'
  }, {
    title: 'Action',
    key: 'action',
    render: (text, v, index) => (
      <span onClick={() => {
        // dispatch(delGroupBy({ index }))
        dispatch.groupBy.delGroupBy({ index })
      }}
      >
        删除
      </span>
    )
  }]

  return (
    <div className='form-item'>
      <div>
        <Cascader
          showSearch
          style={{ width: 320 }}
          options={treeData}
          placeholder='选择要添加的字段'
          onChange={(values) => {
            values = R.zipObj(['target', 'column'])(values)

            // dispatch(addGroupBy({ item: values, index: groupBy.length }))
            dispatch.groupBy.addGroupBy({ item: values, index: groupBy.length })
          }}
        />
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </div>
      <Input.TextArea
        autosize
        placeholder='一些自定义的 groupBy'
        value={optGroupBy}
        style={{
          width: 322,
          marginLeft: 100
        }}
        onChange={({ target }) => {
          let value = target.value

          report.optGroupBy = value
          report = { ...report }
          dispatch.editReport.setReport({ ...report })
        }}
      />
    </div>
  )
}

export default connect(state => ({
  treeData: state.treeData,
  groupBy: state.groupBy || [],
  report: state.editReport
}))(GroupBy)
