import React, { Component } from 'react'
import {
  Input,
  Button,
  Cascader,
  Select,
  Modal
} from 'antd'
import R from 'ramda/src'
import { connect } from 'react-redux'
// import { setMeta, addMeta, delMeta } from '../../action'
import { metaTemplate, findIndexById, findById } from '../../util'
import { template } from 'lodash'

const { Option } = Select

class Meta extends Component {
  state = {
    double: null,
    visible: false,
    child: {}
  }

  componentDidMount() {
    const { metaList, item, reports } = this.props
    if (item.double && item._id) {
      let double = findIndexById(item.double)(metaList)

      if (double !== -1) {
        double++
        double = `${double}`
        this.setState({ double })
      }
    }
    let { child } = item
    child = findById(child)(reports) || {}
    this.setState({ child })
  }

  resetMetaChild = (value) => {
    const {
      reports, dispatch, item, index
    } = this.props
    let { child } = this.state

    item.child = value
    child = value
      ? findById(value)(reports)
      : {}
    // dispatch(setMeta({ item, index }))
    dispatch.metaList.setMetaList({ item, index })
    this.setState({ child })
  }

  _inputPassWhere = ({ target }) => {
    const { dispatch, item, index } = this.props
    const { value } = target
    item.passWhere = value

    // dispatch(setMeta({ item, index }))
    dispatch.metaList.setMetaList({ item, index })
  }

  _renderModalBody = () => {
    const { reports, item } = this.props
    let { child } = this.state

    return (
      <div>
        <Select
          allowClear
          showSearch
          placeholder='子报表'
          style={{ width: 200 }}
          value={child.cname}
          onChange={this.resetMetaChild}
        >
          {reports.map(item => <Option key={item._id} value={item._id}>{item.cname}</Option>)}
        </Select>
        <br />
        <Input.TextArea
          style={{ marginTop: 10, minHeight: 100 }}
          autosize
          placeholder={'下段逻辑，使用模板语言：{表别名.字段:值} \n值如果是字符串的话需要带引号\'\n如果想使用当前字段值的话，用@_@表示'}
          className='annotate'
          value={item.passWhere}
          onChange={this._inputPassWhere}
        />
        <div>{template}</div>
      </div>
    )
  }

  showModal = () => this.setState({ visible: true })
  handleOk = e => this.setState({ visible: false })
  handleCancel = e => this.setState({ visible: false })

  render() {
    let {
      metaList, treeData, item, index, dispatch
    } = this.props
    let name = item.target && item.name
      ? [item.target, item.name]
      : []
    return (
      <div className='form-item'>
        <Modal
          title={`${item.alias} 下段逻辑`}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this._renderModalBody()}
        </Modal>
        <div className='index'>{index + 1}</div>

        <div style={{ marginRight: 10 }}>
          <Select
            value={item.type}
            style={{ marginRight: 0, width: 100 }}
            onChange={(value) => {
              item.type = value
              // dispatch(setMeta({ item, index }))
              dispatch.metaList.setMetaList({ item, index })
            }}
          >
            <Select.Option value='function'>EXPRESSION</Select.Option>
            <Select.Option value='select'>SELECT</Select.Option>
            <Select.Option value='sum'>SUM</Select.Option>
            <Select.Option value='sum100'>SUM/100</Select.Option>
            <Select.Option value='date'>日期</Select.Option>
          </Select>
        </div>
        <Input
          placeholder='字段中文名'
          className='cname'
          value={item.alias}
          onChange={({ target }) => {
          item.alias = target.value
          // dispatch(setMeta({ item, index }))
          dispatch.metaList.setMetaList({ item, index })
        }}
        />

        {item.type !== 'function' && <Cascader
          showSearch
          style={{ width: 300, marginRight: 10 }}
          value={name}
          options={treeData}
          placeholder='字段英文名'
          onChange={(values) => {
            values = R.zipObj(['target', 'name'])(values)
            item = { ...item, ...values }

            // dispatch(setMeta({ item, index }))
            dispatch.metaList.setMetaList({ item, index })
          }}
        />}
        {item.type === 'function' && <Input.TextArea
          autosize
          style={{ width: 300, marginRight: 10 }}
          value={item.expression}
          placeholder='输入函数'
          onChange={({ target }) => {
            item.expression = target.value
            // dispatch(setMeta({ item, index }))
            dispatch.metaList.setMetaList({ item, index })
          }}
        />}
        <Input
          style={{ width: 80, marginRight: 10 }}
          value={item.unit}
          placeholder='单位'
          onChange={({ target }) => {
            item.unit = target.value
            // dispatch(setMeta({ item, index }))
            dispatch.metaList.setMetaList({ item, index })
          }}
        />
        <Select
          allowClear
          showSearch
          placeholder='双行次行行号'
          style={{ width: 50 }}
          value={this.state.double || null}
          onChange={(value) => {
            item.double = value
            // dispatch(setMeta({ item, index }))
            dispatch.metaList.setMetaList({ item, index })
            this.setState({ double: value })
          }}
        >
          {metaList.map((item, index) => <Option key={`${index + 1}`} value={item._id}>{index + 1}</Option>)}
        </Select>
        <Button
          style={{ marginLeft: 10 }}
          onClick={this.showModal}
        >
          添加下段
        </Button>
        <Input.TextArea
          style={{ marginLeft: 10 }}
          autosize
          placeholder='字段逻辑'
          className='annotate'
          value={item.annotate}
          onChange={({ target }) => {
            item.annotate = target.value
            item = { ...item }
            // dispatch(setMeta({ item, index }))
            dispatch.metaList.setMetaList({ item, index })
          }}
        />
        <div
          className='action'
          style={{ marginLeft: 5 }}
          onClick={(e) => {
            let m = metaTemplate()
            let i = index + 1
            // dispatch(addMeta({ item: m, index: i }))
            dispatch.metaList.addMetaList({ item: m, index: i })
          }}
        >
          插入
        </div>
        {index
          ? <div
            className='action'
            onClick={(e) => {
    dispatch.metaList.delMeta({ index })
          }}
          >删除
          </div>
          : ''
        }
      </div>
    )
  }
}
export default connect(state => ({
  report: state.editReport,
  treeData: state.treeData,
  metaList: state.metaList,
  reports: state.editReport.reports || []
}))(Meta)
