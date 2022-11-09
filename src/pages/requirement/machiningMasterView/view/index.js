import React from 'react'
import { compose, lifecycle } from 'recompose'
import { connect } from 'react-redux'
import R from 'ramda/src'
import { Controlled as CodeMirror } from 'react-codemirror2'
import {
  Icon,
  Button,
  Input,
  Table,
  message
} from 'antd'
import RangePicker from './components/rangePicker'
import DatePicker from './components/datePicker'
import { withUser } from '@gql'
import withInitMaster from '../gql/query'
import withUpdateMaster from '../gql/mutation'

import('codemirror/lib/codemirror.css')
import('codemirror/theme/material.css')
import('codemirror/theme/neat.css')
import('../lib/mysql')


const inputSQL = dispatch => (editor, data, value) => dispatch.SQL.writeSQL(value)
const inputcountSQL = dispatch => (editor, data, value) => dispatch.countSQL.writeCountSQL(value)
const inputCname = dispatch => ({ target }) => dispatch.cname.writeCname(target.value)
let count = 0
const removeTypename = (value) => {
  if (value === null || value === undefined) {
    return value
  } else if (Array.isArray(value)) {
    return value.map(v => removeTypename(v))
  } else if (typeof value === 'object') {
    const newObj = {}
    Object.entries(value).forEach(([key, v]) => {
      if (key !== '__typename' && key !== '_id') {
        newObj[key] = removeTypename(v)
      }
    })
    return newObj
  }
  return value
}

const columns = dispatch => [
  {
    title: '组件名',
    dataIndex: 'cname',
    key: 'cname'
  },
  {
    title: '占位符',
    dataIndex: 'key',
    key: 'key',
    render: (text, val) => (
      <div>:{val.key}</div>
    )
  },
  {
    title: '组件标题',
    dataIndex: 'label',
    key: 'label'
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue'
  },
  {
    title: '操作',
    key: 'action',
    render: (text, val) => (
      <div>
        <span
          onClick={(e) => {
            dispatch.editComp.updateComponent(val)
            dispatch.modal.toggleDatePicker()
          }}
          style={{
            marginRight: 10
          }}
        >
          编辑
        </span>
        <span onClick={e => dispatch.component.delComponent(val.key)}>删除</span>
      </div>
    )
  }
]

const submit = ({
  countSQL, cname, SQL, components, mutate, _id
}) => async (e) => {
  const res = await mutate({
    variables: {
      _id,
      data: {
        components: removeTypename(components),
        SQL,
        countSQL,
        cname
      }
    }
  })
  console.log('====================================')
  console.log(res)
  console.log('====================================')

  message.info('保存完成')
}

const options = {
  tabSize: 2,
  mode: 'mysql',
  theme: 'material',
  lineNumbers: true
}

const View = ({
  data,
  match,
  dispatch,
  SQL,
  countSQL,
  components,
  mutate,
  cname
}) => {
  let _id = match.params.reportId
  if (data && data.master && count < 1) {
    count++
    let fillterComponents = R.indexBy(R.prop('key'), data.master.fullComponents)
    fillterComponents = R.values(fillterComponents)
    dispatch.SQL.writeSQL(data.master.SQL)
    dispatch.cname.writeCname(data.master.cname)
    dispatch.countSQL.writeCountSQL(data.master.countSQL)
    dispatch.component.init(fillterComponents)
  }
  return (
    <div className='master-edit-container'>
      <RangePicker />
      <DatePicker />
      <div className='master-aside'>
        <div className='list'>
          <div className='title'>组件列表</div>
          <div className='item' onClick={e => dispatch.modal.toggleDatePicker()}>
            <Icon type='calendar' style={{ color: '#2196F3' }} />
            日期选择
          </div>
        </div>
      </div>
      <div className='master-content'>
        <div className='master-pre'>
          <div className='title'>输入报表名称</div>
          <Input
            placeholder='中文名称'
            value={cname}
            onChange={inputCname(dispatch)}
            style={{
              width: 300
            }}
          />
          <div className='title'>可用组件</div>
          <Table columns={columns(dispatch)} dataSource={components} pagination={false} />

          <div className='title'>输入查询 SQL</div>
          <div id='SQL-input'>
            <CodeMirror
              options={options}
              value={SQL}
              onBeforeChange={inputSQL(dispatch)}
            />
          </div>
          <div className='title'>输入统计 SQL (用于分页)</div>
          <div id='SQL-input'>
            <CodeMirror
              options={options}
              value={countSQL}
              onBeforeChange={inputcountSQL(dispatch)}
            />
          </div>
          <div className='master-footer'>
            <Button
              type='primary'
              onClick={submit({
 countSQL, cname, SQL, components, mutate, _id
})}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
      <div className='master-right-side' />
    </div>
  )
}
const mapState = state => ({
  components: state.component,
  SQL: state.SQL,
  cname: state.cname,
  countSQL: state.countSQL,
  modal: state.modal,
  editComp: state.editComp
})

export default compose(
  withUser,
  withInitMaster,
  withUpdateMaster,
  connect(mapState),
)(View)
