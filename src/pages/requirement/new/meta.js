/* eslint-disable */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { Card, Form, Input, AutoComplete, Row, Button, message, Radio } from 'antd'
import axios from '_axios'
import withTitle from '@component/title'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class Requirement extends Component {
  constructor(props) {
    super(props)
    this.baseRecordId = 0
    this.state = {
      reportName: '',
      remarks: '',
      isRealTime: false,
      placeholder: '备注：\n 报表的使用场景\n 报表的统计纬度',
      tablefields: [{
        recordId: 0,
        alias: '',
        annotate: ''
      }]
    }
    this.reportId = null
    // @test 可能不需要了
    this.metaList = []
    this.metaNameList = []
  }
  setRecordId (data) {
    return data.map(item => {
      this.baseRecordId += 1
      item.recordId = this.baseRecordId++
      return item
    })
  }
  componentDidMount () {
    // this.getMetaList()
    const title = document.querySelector('title')
    title.innerText = '提交报表需求'
    const { params: { id: reportId } } = this.props.match
    this.reportId = reportId
    if (reportId) {
      this.getEdit(reportId)
    }
  }
  async getMetaList (cb) {
    const { data: { success, metaList } } = await axios.get('/api/v0/metaList')
    if (success !== 1) {
      message.error('获取元数据字段出错')
    } else {
      this.metaList = metaList
      this.metaNameList = this.metaList.map(meta => meta.alias)
      if (typeof cb === 'function') cb()
    }
  }
  async getEdit (reportId) {
    const res = await axios.get(`/api/v0/reports/${reportId}`)
    const { success, body: { cname: reportName, metaList } } = res.data
    if (success === 1) {
      let editData = {
        reportName,
        tablefields: metaList
      }

      editData.tablefields = this.setRecordId(editData.tablefields, this.baseRecordId)
      this.setState(editData)
    } else {
      message.error('获取编辑数据失败', 1)
    }
  }
  handleAddField = (recordId) => () => {
    let newTablefields = []
    this.baseRecordId += 1
    this.state.tablefields.forEach(tablefield => {
      newTablefields.push(tablefield)
      if (tablefield.recordId === recordId) {
        newTablefields.push({
          recordId: this.baseRecordId,
          id: null,
          annotate: ''
        })
      }
    })
    this.setState({
      tablefields: newTablefields
    })
  }
  handleDelField = (recordId) => () => {
    const newTablefields = this.state.tablefields.filter(tablefield => tablefield.recordId !== recordId)
    this.setState({
      tablefields: newTablefields
    })
  }
  /**
   * val 可能是文本 有可能是 输入的evt
   */
  handleChange = ({type, recordId}) => (val) => {
    switch (type) {
      case 'field-alias': {
        let tablefield = this.state.tablefields.find(tablefield => tablefield.recordId === recordId)
        tablefield.alias = val
        break
      }
      case 'field-annotate': {
        let tablefield = this.state.tablefields.find(tablefield => tablefield.recordId === recordId)
        tablefield.annotate = val.target.value
        break
      }
      case 'reportName': {
        this.state.reportName = val.target.value
        break
      }
      case 'remarks': {
        this.state.remarks = val.target.value
        break
      }
      default:
        break
    }
  }
  /**
   * @param {formValues} 表单的项目
   */
  formatFields (formValues) {
    // { reportName, tablefields: [{ alias, annotate }] } tablefields-alias tablefields-annotate
    let tablefields = []
    let data = {}
    // 获取tableFileds的值
    Object.keys(formValues).forEach((key, index) => {
      if (/tablefields/g.test(key)) {
        const [ , tableFieldsProp, tableFieldsIndex ] = key.split('-')
        tablefields[tableFieldsIndex] = tablefields[tableFieldsIndex] || {}
        tablefields[tableFieldsIndex][tableFieldsProp] = formValues[key]
      }
    })
    // reportName
    data.reportName = formValues.reportName
    data.tablefields = tablefields
    return data
  }
  handleSubmit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // let submitData = this.formatFields(values)
        const { reportName, tablefields, remarks, isRealTime } = this.state
        let submitData = { reportName, tablefields, remarks, isRealTime }
        let res = {}
        if (this.reportId) {
          submitData._id = this.reportId
          res = await axios.put('/requirement', submitData)
        } else {
          res = await axios.post('/requirement', submitData)
        }
        let { data: { success, msg } } = res
        if (success) {
          message.success('保存成功！！静待高级人肉数据仓库运维工程师的佳音！！', 2, () => {
            this.props.history.push('/requirement/new')
          })
        } else {
          message.error(`${msg}`, 2)
        }
      }
    })
  }

  toggleRealTime = value => {
    let { isRealTime } = this.state
    isRealTime = value
    this.setState({ isRealTime })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Card bordered={false} hoverable title='基本信息'>

        <Form layout='vertical' id='newRequirement'>
          <FormItem label='报表名'>
            {getFieldDecorator('reportName', {
              initialValue: this.state.reportName,
              rules: [{ required: true, message: '请输入报表名称' }]
            })(
              <div className='reportName'>
                <Input placeholder='报表名' onChange={this.handleChange({type: 'reportName'})} />
                <RadioGroup
                  onChange={this.toggleRealTime}
                  defaultValue={this.state.isRealTime}
                >
                  <RadioButton value={false}>非实时数据分析</RadioButton>
                  <RadioButton value>实时数据分析</RadioButton>
                </RadioGroup>
              </div>
            )}
          </FormItem>

          <Row type='flex'>
            <label className='ant-form-item-required fields' title='报表字段'>报表字段</label>
          </Row>
          {
            this.state.tablefields.map((tablefield, index) => {
              let { recordId } = tablefield
              return (
                <Row key={recordId} type='flex' align='middle'>
                  <FormItem>
                    <span className='field-order'>{index + 1} </span>
                  </FormItem>
                  <FormItem key={`tablefields-alias-${recordId}`} className='field-alias'>
                    {getFieldDecorator(`tablefields-alias-${recordId}`, {
                      initialValue: tablefield.alias,
                      rules: [{ required: true, message: '请输入字段名' }]
                    })(
                      <AutoComplete
                        dataSource={[]}
                        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                        placeholder='请录入报表字段'
                        onChange={this.handleChange({type: 'field-alias', recordId})}
                      />
                    )}
                  </FormItem>
                  <FormItem key={`tablefields-annotate-${recordId}`} className='field-annotate'>
                    {getFieldDecorator(`tablefields-annotate-${recordId}`, {
                      initialValue: tablefield.annotate,
                      rules: [{ required: true, message: '请输入字段描述' }]
                    })(
                      <Input placeholder='请输入字段描述' onChange={this.handleChange({type: 'field-annotate', recordId})} />
                    )}
                  </FormItem>
                  <FormItem>
                    <span className='operationItem' onClick={this.handleAddField(recordId)}>插入</span>
                    <span className='operationItem' onClick={this.handleDelField(recordId)}>删除</span>
                  </FormItem>
                </Row>
              )
            })
          }
          <FormItem label='备注' className='remarks'>
            {getFieldDecorator('remarks', {
              initialValue: this.state.remarks,
              rules: [{ required: true, message: '请输入报表备注' }]
            })(
              <Input.TextArea
                autosize
                style={{width: '100%'}}
                placeholder={this.state.placeholder}
                onChange={this.handleChange({type: 'remarks'})}
              />
            )}
          </FormItem>
          <Button type='primary' onClick={this.handleSubmit} >提交报表需求</Button>
        </Form>
      </Card>
    )
  }
}

export default compose(
  withTitle('提个新需求'),
  withRouter,
  Form.create()
)(Requirement)
