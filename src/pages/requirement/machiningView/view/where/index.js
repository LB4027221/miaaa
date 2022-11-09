import React from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
import SearchComponent from './searchComponent'
import RangePickerComponent from './rangePickerComponent'
import SelectInComponent from './selectInComponent'
import SSelectInComponent from './sselect'
import In from './in'
import Equation from './equation'
// import { setWhere } from '../../action'
import { componentTemplate } from '../../util'

const { Option } = Select
const componentSwitch = {
  Search: ({ item, index }) => (<SearchComponent item={item} index={index} />),
  RangePicker: ({ item, index }) => (<RangePickerComponent item={item} index={index} />),
  SelectIn: ({ item, index }) => (<SelectInComponent item={item} index={index} />),
  SSelectIn: ({ item, index }) => (<SSelectInComponent item={item} index={index} />),
  $gt: ({ item, index }) => (<Equation item={item} index={index} />),
  $lt: ({ item, index }) => (<Equation item={item} index={index} />),
  $lte: ({ item, index }) => (<Equation item={item} index={index} />),
  $gte: ({ item, index }) => (<Equation item={item} index={index} />),
  $ne: ({ item, index }) => (<Equation item={item} index={index} />),
  $equals: ({ item, index }) => (<Equation item={item} index={index} />),
  $in: ({ item, index }) => (<In item={item} index={index} />),
  $nin: ({ item, index }) => (<In item={item} index={index} />)
}

const SelectWhere = ({ item, index, dispatch }) => {
  if (item.name === '$equal') item.name = '$equals'
  return (
    <div className='form-item' key={item.key}>
      <div className='index'>{index + 1}</div>
      <Select
        value={item.name}
        onChange={(value) => {
  
          let _item = componentTemplate[value]()
          item = { ..._item }

          // dispatch(setWhere({ item, index }))
          dispatch.where.setWhere({ item, index })
        }}
        style={{
          marginRight: 10,
          width: 110
        }}
      >
        <Option value='Search'>搜索</Option>
        <Option value='RangePicker'>日期</Option>
        <Option value='SelectIn'>下拉菜单手动</Option>
        <Option value='SSelectIn'>下拉关联业务</Option>
        {/* <Option value='SelectInAuto'>下拉菜单自动</Option> */}
        <Option value='$in'>IN</Option>
        <Option value='$nin'>NIN</Option>
        <Option value='$lt'>小于</Option>
        <Option value='$gt'>大于</Option>
        <Option value='$lte'>小于等于</Option>
        <Option value='$gte'>大于等于</Option>
        <Option value='$equals'>等于</Option>
        <Option value='$ne'>不等于</Option>
      </Select>
      {componentSwitch[item.name]({ item, index })}
    </div>
  )
}

export default connect()(SelectWhere)
