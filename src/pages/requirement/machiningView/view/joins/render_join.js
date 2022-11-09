import React from 'react'
import {
  // Select,
  // TreeSelect,
  Cascader,
  Radio
  // AutoComplete
} from 'antd'
import { connect } from 'react-redux'
// import { setJoin, addJoin, delJoin } from '../../action'
import R from 'ramda/src'

import { joinTemplate } from '../../util'

// const { Option } = AutoComplete
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
// const { SHOW_ALL } = TreeSelect

const Join = ({
  treeData, targets, report, item, index, dispatch
}) => {
  let valueLeft = item.leftTarget && item.leftColumn
    ? [item.leftTarget, item.leftColumn]
    : []
  let valueRight = item.rightTarget && item.rightColumn
    ? [item.rightTarget, item.rightColumn]
    : []

  return (
    <div className='form-item'>
      <RadioGroup
        value={item.type}
        style={{ marginRight: 10 }}
        onChange={({ target }) => {
          item = { ...item, type: target.value }
          // dispatch(setJoin({ item, index }))
          dispatch.join.setJoin({ item, index })
        }}
      >
        <RadioButton value='inner'>INNER</RadioButton>
        <RadioButton value='left'>LEFT</RadioButton>
        <RadioButton value='right'>RIGHT</RadioButton>
      </RadioGroup>
      <Cascader
        showSearch
        allowClear
        style={{ width: 300, marginRight: 10 }}
        value={valueLeft}
        options={treeData}
        placeholder='连接的字段'
        onChange={(value) => {
          value = value.length
            ? value
            : ['', '']

          value = R.zipObj(['leftTarget', 'leftColumn'])(value)
          let t = R.find(R.propEq('key', value.leftTarget))(targets)

          item = { ...item, ...value, target: t }

          // dispatch(setJoin({ item, index }))
          dispatch.join.setJoin({ item, index })
        }}
      />
      <span style={{ marginTop: 3, marginRight: 10 }}>=</span>
      <Cascader
        showSearch
        allowClear
        style={{ width: 300, marginRight: 10 }}
        value={valueRight}
        options={treeData}
        placeholder='连接的字段'
        onChange={(value) => {
          value = value.length
            ? value
            : ['', '']

          value = R.zipObj(['rightTarget', 'rightColumn'])(value)
          let t = R.find(R.propEq('key', value.leftTarget))(targets)

          item = { ...item, ...value, target: t }

          // dispatch(setJoin({ item, index }))
          dispatch.join.setJoin({ item, index })
        }}
      />
      <div
        className='action'
        style={{ marginLeft: 5 }}
        onClick={(e) => {
        let _item = joinTemplate()
        let _index = index + 1

        // dispatch(addJoin({ item: _item, index: _index }))
        dispatch.join.addJoin({ item: _item, index: _index })
      }}
      >插入
      </div>
      {index
        ? <div
          className='action'
          style={{ marginLeft: 5 }}
          onClick={(e) => {
          // dispatch(delJoin({ index }))
        dispatch.join.delJoin({ index })
        }}
        >删除
        </div>
        : ''
      }
    </div>
  )
}

export default connect(state => ({
  targets: state.targets,
  treeData: state.treeData,
  report: state.editReport
}))(Join)
