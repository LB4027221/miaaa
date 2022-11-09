import React, { Component } from 'react'
import {
  // Checkbox,
  Input,
  DatePicker,
  // TreeSelect,
  Cascader,
  Select,
  Radio
} from 'antd'
import R from 'ramda/src'
import moment from 'moment'
// import { setWhere, addWhere, delWhere } from '../../action'
import { componentTemplate } from '../../util'
import { connect } from 'react-redux'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

const { Option } = Select

const dateFormat = 'YYYY-MM-DD HH:mm:ss'
// const RadioButton = Radio.Button
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
    let where = item.where.map((item) => {
      if (R.type(item) !== 'Number') return moment(item.replace(/'/g, ''))
      return item
    })
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
        <DatePicker.RangePicker
          allowClear={false}
          value={where}
          format={dateFormat}
          placeholder={['默认开始日期', '默认结束日期']}
          style={{
            width: 300,
            marginRight: 10
          }}
          onChange={(e, value) => {
            value = [`'${value[0]}'`, `'${value[1]}'`]
            item.independent.useToday = false
            item = { ...item, where: [...value] }
            item = { ...item }
            // dispatch(setWhere({ item, index }))
            dispatch.where.setWhere({ item, index })
          }}
        />
        <Input
          style={{ width: 80 }}
          value={item.label}
          placeholder='label'
          onChange={({ target }) => {
            item.label = target.value
            item = { ...item }
            // dispatch(setWhere({ item, index }))
            dispatch.where.setWhere({ item, index })
          }}
        />
        <RadioGroup
          value={item.show}
          onChange={({ target }) => {
            item.show = target.value
            // dispatch(setWhere({ item, index }))
            dispatch.where.setWhere({ item, index })
          }}
        >
          <Radio style={radioStyle} value>显示</Radio>
          <Radio style={radioStyle} value={false}>隐藏</Radio>
        </RadioGroup>
        <RadioGroup
          value={item.independent.useToday}
          onChange={({ target }) => {
            let { value } = target
            let today = [
              `'${moment(Date.now()).format('YYYY-MM-DD')} 00:00:00'`,
              `'${moment(Date.now()).format('YYYY-MM-DD')} 23:59:59'`
            ]
            item.where = today
            item.independent.useToday = value
            item = { ...item }
            // dispatch(setWhere({ item, index }))
            dispatch.where.setWhere({ item, index })
          }}
        >
          <Radio style={radioStyle} value>默认当天</Radio>
          <Radio style={radioStyle} value={false}>否</Radio>
        </RadioGroup>
        <span style={{ flex: 1 }} />
        <span
          className='action'
          style={{ marginLeft: 5 }}
          onClick={(e) => {
          let _item = componentTemplate.RangePicker()
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

export default connect((state) => ({
  treeData: state.treeData
}))(WhereComponent)
