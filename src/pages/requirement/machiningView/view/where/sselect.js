import React, { Component } from 'react'
import {
  Input,
  Select,
  Cascader
} from 'antd'
import R from 'ramda/src'
import { compose, renderNothing, branch } from 'recompose'
import { connect } from 'react-redux'
import { withScomp } from '@gql'
// import { setWhere, addWhere, delWhere } from '../../action'
import { componentTemplate } from '../../util'

const { Option } = Select

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
          style={{ width: 100 }}
          value={item.independent.placeholder}
          placeholder='placeholder'
          onChange={({ target }) => {
            item.independent.placeholder = target.value
            item = { ...item }

            dispatch.where.setWhere({ item, index })
          }}
        />
        <span style={{ flex: 1 }} />
        <Select
          value={item.source}
          style={{ width: 150 }}
          placeholder='已有业务组件'
          onChange={(_value) => {
            item.source = _value
            item = { ...item }

            dispatch.where.setWhere({ item, index })
          }}
        >
          {this.props.scomp.scomp.map(scomp => (
            <Option key={scomp.key} value={scomp.key}>{scomp.cname}</Option>
          ))}
          {/* <Option value='pickHouse'>销售服务站</Option>
          <Option value='userPickHouse'>用户服务站</Option>
          <Option value='userNode'>用户节点（下属）</Option> */}
          {/* <Option value='salerCat'>销售品类</Option> */}
          {/* <Option value='pmCat'>pm品类</Option> */}
        </Select>
        <Input
          style={{ width: 155, marginRight: 10 }}
          value={item.sourceKey}
          placeholder='用户对应的key'
          onChange={({ target }) => {
            let w = target.value
            item.sourceKey = w
            item = { ...item }

            dispatch.where.setWhere({ item, index })
          }}
        />
        <Select
          allowClear
          mode='multiple'
          value={item.roles}
          style={{ width: 150 }}
          placeholder='应用角色,不选就默认全部'
          onChange={(_value) => {
            item.roles = _value
            item = { ...item }

            dispatch.where.setWhere({ item, index })
          }}
        >
          <Option value='saler'>销售</Option>
          <Option value='warden'>主管</Option>
          <Option value='manager'>经理</Option>
          <Option value='cityManager'>城市总</Option>
          <Option value='pm'>PM</Option>
        </Select>
        <span
          className='action'
          style={{ marginLeft: 5 }}
          onClick={(e) => {
          let _item = componentTemplate.SelectIn()
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

const mapState = state => ({
  treeData: state.treeData
})

const renderNothingWhileLoading = branch(
  props => props.scomp.loading,
  renderNothing
)

export default compose(
  connect(mapState),
  withScomp,
  renderNothingWhileLoading
)(WhereComponent)
