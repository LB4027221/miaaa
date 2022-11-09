/* eslint-disable */
import React, { Component } from 'react'
import { Select, Form, Button, Input } from 'antd'
import { withUpdateChart, withRemoveChart } from '@gql'
import { compose, renderNothing, branch } from 'recompose'
import mutate from '@lib/mutate'
import { mapExcelData } from '@lib'
import { drop, path, isEmpty } from 'ramda/src'
import { ChartCard, Field } from 'ant-design-pro/lib/Charts'
// import { isEmpty } from 'ramda/src'

const { Option } = Select
const FormItem = Form.Item

const getId = path(['data', 'user', 'updateChart', 'data', '_id'])

class Card extends Component {
  constructor(props) {
    super(props)
    const chart = props.chart
    const conf = !isEmpty(chart) && chart.conf ? chart.conf : {}

    const body = !isEmpty(conf) ? conf.body : null
    const data = mapExcelData(props.dataSource, props.cols)

    this.state = {
      _id: !isEmpty(chart) && chart._id,
      title: !isEmpty(conf) && conf.title,
      titleCol: !isEmpty(conf) && conf.titleCol,
      bodyCol: !isEmpty(conf) && conf.bodyCol,
      body,
      data,
      row: !isEmpty(conf) ? conf.row : 0,
      chart: conf.chart
    }
  }

  updateState = key => value => this.setState({
    [key]: value,
    [`${key}Col`]: value
  })
  updateTState = key => e => this.setState({ [key]: e.target.value })

  submit = () => {
    const variables = {
      tplId: this.props.tpl._id,
      worksheet: this.props.worksheet.name,
      reportId: this.props.reportId,
      conf: {
        _id: this.state._id,
        chartType: 'card',
        title: this.state.title,
        conf: {
          row: this.state.row,
          body: this.state.body,
          bodyCol: this.state.bodyCol,
          titleCol: this.state.titleCol,
          title: this.state.title
        }
      }
    }
    this.props.updateChartHoc.submit(variables, this.afterRes)
  }

  del = () => {
    const variables = {
      chartId: this.state._id
    }
    this.props.removeChartHoc.submit(variables, () => this.props.tplFn.refetch())
  }

  afterRes = res => this.setState(() => ({ _id: getId(res) }))

  render() {
    const { dataSource, cols } = this.props
    const columns = cols
    const {
      title, body, row, titleCol, bodyCol, data
    } = this.state

    if (!this.state.data) {
      return (
        <div>
          <Button
            style={{ marginLeft: 15 }}
            type='danger'
            onClick={this.del}
            loading={this.props.removeChartHoc.loading}
          >
            删除
          </Button>
        </div>
      )
    }

    const total = title && data[titleCol]
      ? data[titleCol].length > this.state.row
        ? data[titleCol][this.state.row]
        : null
      : null

    const footer = body && data[bodyCol]
      ? data[bodyCol].length && data[bodyCol][this.state.row]
        ? data[bodyCol].length > this.state.row
          ? data[bodyCol][this.state.row]
          : null
        : data[bodyCol][this.state.row]
      : null

    return (
      <div>
        <FormItem label='行号'>
          <Select
            showSearch
            allowClear
            value={row}
            placeholder='行号'
            style={{ width: '100%' }}
            onChange={this.updateState('row')}
          >
            {dataSource.map((d, idx) => (<Option key={`${idx}`} value={idx}>{idx}</Option>))}
          </Select>
        </FormItem>
        <FormItem>
          <Select
            showSearch
            allowClear
            value={titleCol}
            placeholder='一级标题数据'
            style={{ width: '100%' }}
            onChange={this.updateState('title')}
          >
            {columns.map(column => (<Option key={column} value={column}>{column}</Option>))}
          </Select>
          <Input
            placeholder='标题'
            value={title}
            onChange={this.updateTState('title')}
          />
        </FormItem>
        <FormItem label='二级标题数据'>
          <Select
            showSearch
            allowClear
            value={bodyCol}
            placeholder='二级标题'
            style={{ width: '100%' }}
            onChange={this.updateState('body')}
          >
            {columns.map(column => (<Option key={column} value={column}>{column}</Option>))}
          </Select>
          <Input
            placeholder='标题'
            value={body}
            onChange={this.updateTState('body')}
          />
        </FormItem>
        <br />
        <div
          style={{
            position: 'absolute',
            right: 'calc(-100% - 100px)',
            top: -57 - 24 - 32
          }}
        >
          {this.props.preview({
            chart: {
              data: {
                data: [this.props.cols, ...this.props.dataSource]
              },
              reportId: this.props.reportId,
              _id: this.state._id,
              chartType: 'card',
              title: this.state.title,
              conf: {
                row: this.state.row,
                body: this.state.body,
                bodyCol: this.state.bodyCol,
                titleCol: this.state.titleCol,
                title: this.state.title
              }
            },
            type: this.props.type
          })}
        </div>
        <br />
        <br />
        <Button
          type='primary'
          onClick={this.props.submit
            ? () => this.props.submit(this.state, this.props)
            : this.submit}
          loading={this.props.updateChartHoc.loading}
        >
          保存
        </Button>
        {this.state._id && <Button
          style={{ marginLeft: 15 }}
          type='danger'
          onClick={this.del}
          loading={this.props.removeChartHoc.loading}
        >
          删除
        </Button>}
      </div>
    )
  }
}

const renderWhileError = branch(
  props => !props.type,
  renderNothing
)

export default compose(
  renderWhileError,
  withUpdateChart,
  withRemoveChart
)(Card)
