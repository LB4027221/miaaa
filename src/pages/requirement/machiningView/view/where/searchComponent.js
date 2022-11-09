import React, { Component } from 'react'
import {
  Input,
  // Checkbox,
  Select,
  Radio,
  Cascader
  // TreeSelect
} from 'antd'
import R from 'ramda/src'
import { connect } from 'react-redux'
// import { setWhere, addWhere, delWhere } from '../../action'
import { componentTemplate } from '../../util'

// const RadioButton = Radio.Button
const { Option } = Select
const RadioGroup = Radio.Group
const radioStyle = {
  display: 'block',
  fontSize: '12px',
  height: '18px',
  lineHeight: '18px'
}

class WhereComponent extends Component {
  state = {
    expType: 'select',
    inputTarget: ''
  }

  toggleExp = expType => this.setState({ expType })

  componentDidMount() {
    const { item = {} } = this.props

    if (item.target && item.target.length < 5) {
      const inputTarget = `${item.target}.${item.column}`
      this.setState({ expType: 'exp', inputTarget })
    }
  }

  render() {
    let {
      item, index, treeData, dispatch
    } = this.props
    let value = item.target && item.column
      ? [item.target, item.column]
      : []

    return (
      <div className='where-item'>
        <Select
          value={this.state.expType}
          onChange={this.toggleExp}
        >
          <Option value='select'>选项</Option>
          <Option value='exp'>自定义</Option>
        </Select>
        {this.state.expType === 'select'
          ? <Cascader
            showSearch
            value={value}
            style={{ width: 300, marginRight: 10 }}
            options={treeData}
            placeholder='连接的字段'
            onChange={(value) => {
              value = R.zipObj(['target', 'column'])(value)
              item = { ...item, ...value }

              // dispatch(setWhere({ item, index }))
              dispatch.where.setWhere({ item, index })
            }}
          />
          : <Input
            style={{
              width: 200
            }}
            value={this.state.inputTarget}
            onChange={({ target }) => {
              let { value } = target
              this.setState({ inputTarget: value })

              value = value.split('.')

              if (value.length === 2) {
                value = R.zipObj(['target', 'column'])(value)
                item = { ...item, ...value }

                // dispatch(setWhere({ item, index }))
                dispatch.where.setWhere({ item, index })
              }
            }}
          />
        }
        <Input
          style={{ width: 195, marginRight: 10 }}
          placeholder='默认搜索值'
          onChange={({ target }) => {
            item = { ...item, where: [target.value] }

            // dispatch(setWhere({ item, index }))
            dispatch.where.setWhere({ item, index })
          }}
        />
        <Input
          style={{ width: 200 }}
          value={item.independent.placeholder}
          placeholder='搜索框 placeholder'
          onChange={({ target }) => {
            item.independent.placeholder = target.value
            item = { ...item }

            // dispatch(setWhere({ item, index }))
            dispatch.where.setWhere({ item, index })
          }}
        />
        <RadioGroup
          value={item.show}
          onChange={({ target }) => {
            item = { ...item, show: target.value }
            // dispatch(setWhere({ item, index }))
            dispatch.where.setWhere({ item, index })
          }}
        >
          <Radio style={radioStyle} value>显示</Radio>
          <Radio style={radioStyle} value={false}>隐藏</Radio>
        </RadioGroup>
        <span style={{ flex: 1 }} />
        <span
          className='action'
          style={{ marginLeft: 5 }}
          onClick={(e) => {
          let _item = componentTemplate.Search()
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
}

export default connect(state => ({
  treeData: state.treeData
}))(WhereComponent)
