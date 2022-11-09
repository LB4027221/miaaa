import React from 'react'
import {
  Select,
  Cascader,
  Input
} from 'antd'
import { connect } from 'react-redux'
import R from 'ramda/src'
import { havingByTemplate } from '../../util'
// import {
//   addOrderBy,
//   delOrderBy,
//   setOrderBy
// } from '../../action'

const { Option } = Select

const OrderBy = ({
  index, item, treeData, dispatch
}) => {
  let value = item.target && item.column
    ? [item.target, item.column]
    : []

  return (
    <div className='form-item'>
      <div className='index'>{index + 1}</div>
      <Select
        value={item.type}
        style={{ marginRight: 0, width: 100 }}
        onChange={(value) => {
          item.type = value
          item = { ...item }
          // dispatch(setOrderBy({ item, index }))
          dispatch.having.setOrderBy({ item, index })
        }}
      >
        <Option value='exp'>自定义</Option>
      </Select>
      <div style={{ width: 10 }} />
      {
        item.type !== 'exp'
          ? <Cascader
            showSearch
            style={{ width: 300, margxinLeft: 10 }}
            value={value}
            options={treeData}
            placeholder='字段英文名'
            onChange={(values) => {
              values = R.zipObj(['target', 'column'])(values)
              item = { ...item, ...values }

              // dispatch(setOrderBy({ item, index }))
              dispatch.having.setOrderBy({ item, index })
            }}
          />
          : <Input.TextArea
            autosize
            style={{ width: 300 }}
            placeholder='字段逻辑'
            value={item.column}
            onChange={({ target }) => {
              item.column = target.value
              item = { ...item }
              // dispatch(setOrderBy({ item, index }))
              dispatch.having.setOrderBy({ item, index })
            }}
          />
      }
      <div
        className='action'
        style={{ marginLeft: 5 }}
        onClick={(e) => {
          let m = havingByTemplate()
          let i = index + 1
          // dispatch(addOrderBy({ item: m, index: i }))
          dispatch.having.addOrderBy({ item: m, index: i })
        }}
      >
        插入
      </div>

      {index
        ? <div
          className='action'
          onClick={(e) => {
          // dispatch(delOrderBy({index}))
          dispatch.having.delOrderBy({ index })
        }}
        >删除
        </div>
        : ''
      }
    </div>
  )
}

export default connect(state => ({
  report: state.editedReport,
  treeData: state.treeData
}))(OrderBy)
