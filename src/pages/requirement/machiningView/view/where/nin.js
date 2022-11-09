import React from 'react'
import {
  Input,
  Cascader,
  Radio
  // TreeSelect
} from 'antd'
import R from 'ramda/src'
import { connect } from 'react-redux'
// import { setWhere, addWhere, delWhere } from '../../action'
import { componentTemplate } from '../../util'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

const Component = ({
  item, index, treeData, dispatch
}) => {
  let value = item.target && item.column
    ? [item.target, item.column]
    : []

  return (
    <div className='where-item'>
      <Cascader
        showSearch
        value={value}
        style={{ width: 300, marginRight: 10 }}
        options={treeData}
        placeholder='连接的字段'
        onChange={(value) => {
          value = R.zipObj(['target', 'column'])(value)
          item = { ...item, ...value }
          item = { ...item }

          // dispatch(setWhere({ item, index }))
          dispatch.where.setWhere({ item, index })
        }}
      />
      <Input
        style={{ width: 195, marginRight: 10 }}
        value={item.where.toString()}
        placeholder='多个值用,隔开'
        onChange={({ target }) => {
          let w = target.value.split(',')
          item.where = w
          item = { ...item }

          // dispatch(setWhere({ item, index }))
          dispatch.where.setWhere({ item, index })
        }}
      />
      <span style={{ flex: 1 }} />
      <span
        className='action'
        style={{ marginLeft: 5 }}
        onClick={(e) => {
        let _item = componentTemplate.$nin()
        let _index = index + 1

        // dispatch(addWhere({ item: _item, index: _index }))
        dispatch.where.addWhere({ item: _item, index: _index })
      }}
      >插入
      </span>
      {
        index
          ? <span
            className='action'
            onClick={(e) => {
            // dispatch(delWhere({ index }))
            dispatch.where.delWhere({ index })
          }}
          >删除
          </span>
          : ''
      }
    </div>
  )
}

export default connect((state) => ({
  treeData: state.treeData
}))(Component)
