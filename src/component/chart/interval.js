import React, { Component } from 'react'
import { Select, Form, Button, Input } from 'antd'
import { compose, renderNothing, branch } from 'recompose'
import { withUpdateChart, withRemoveChart } from '@gql'
import { getChartId } from '@lib'
import { isEmpty } from 'ramda/src'
import mutate from '@lib/mutate'
import { aggregates } from './'

const { Option } = Select
const FormItem = Form.Item

class Interval extends Component {
  constructor(props) {
    super(props)
    const chart = props.chart
    const conf = !isEmpty(chart) && chart.conf
      ? chart.conf
      : {}
    this.state = {
      _id: !isEmpty(chart) && chart._id,
      title: !isEmpty(chart) && chart.title,
      xAxis: !isEmpty(conf) && conf.xAxis,
      yAxis: !isEmpty(conf) ? conf.yAxis : [null],
      item: !isEmpty(conf) && conf.item,
      aggregate: !isEmpty(conf) && conf.aggregate,
      itemFilter: !isEmpty(conf) && conf.itemFilter
    }
  }

  updateState = (key, idx) => value => (key === 'yAxis'
    ? this.setState(state => ({ yAxis: state.yAxis.map((i, _idx) => (_idx === idx ? value : i)) }))
    : this.setState({ [key]: value }))

  addYAxis = () => {
    const { yAxis } = this.state

    return this.setState({ yAxis: [...yAxis, null] })
  }

  delYAxis = key =>
    this.setState(state => ({ yAxis: state.yAxis.filter((i, idx) => idx !== key) }))

  updateTState = key => e => this.setState({ [key]: e.target.value })

  submit = () => {
    const variables = {
      tplId: this.props.tpl._id,
      worksheet: this.props.worksheet.name,
      reportId: this.props.reportId,
      conf: {
        _id: this.state._id,
        chartType: 'interval',
        title: this.state.title,
        conf: {
          xAxis: this.state.xAxis,
          yAxis: this.state.yAxis
        }
      }
    }
    this.props.updateChartHoc.submit(variables, this.afterRes)
  }

  afterRes = res => this.setState(() => ({ _id: getChartId(res) }))

  del = () => {
    const variables = {
      chartId: this.state._id
    }
    this.props.removeChartHoc.submit(variables, () => this.props.tplFn.refetch())
  }

  render() {
    const { cols } = this.props
    const columns = cols
    const {
      xAxis, yAxis = [null], title, item, aggregate, itemFilter
    } = this.state

    return (
      <div>
        <FormItem label='标题'>
          <Input value={title} onChange={this.updateTState('title')} />
        </FormItem>
        <FormItem label='统计方法'>
          <Select
            showSearch
            allowClear
            placeholder='统计值'
            style={{ width: '100%' }}
            value={aggregate}
            onChange={this.updateState('aggregate')}
          >
            {aggregates.map((_item, idx) => (<Option key={`${idx}`} value={_item.type}>{_item.title}</Option>))}
          </Select>
        </FormItem>
        <FormItem label='分组'>
          <Select
            showSearch
            allowClear
            placeholder='分组'
            style={{ width: '100%' }}
            value={item}
            onChange={this.updateState('item')}
          >
            {columns.map((column, idx) => (<Option key={`${idx}`} value={column}>{column}</Option>))}
          </Select>
        </FormItem>
        <FormItem label='分组过滤字段'>
          <Input
            placeholder='分组过滤字段,多个字段用,号隔开'
            style={{ width: '100%' }}
            value={itemFilter}
            onChange={this.updateTState('itemFilter')}
          />
        </FormItem>
        <FormItem label='x轴'>
          <Select
            showSearch
            allowClear
            placeholder='x轴'
            style={{ width: '100%' }}
            value={xAxis}
            onChange={this.updateState('xAxis')}
          >
            {columns.map((column, idx) => (<Option key={`${idx}`} value={column}>{column}</Option>))}
          </Select>
        </FormItem>
        {yAxis && yAxis.map((val, key) => (
          <FormItem label='y轴' key={val}>
            <Select
              showSearch
              allowClear
              placeholder='y轴'
              style={{ width: 'calc(100% - 80px)' }}
              value={val}
              onChange={this.updateState('yAxis', key)}
            >
              {columns && columns.map((column, idx) => (<Option key={`${idx}`} value={column}>{column}</Option>))}
            </Select>
            <Button
              size='small'
              icon='plus'
              shape='circle'
              onClick={this.addYAxis}
              style={{ marginLeft: 10 }}
            />
            <Button
              size='small'
              icon='minus'
              shape='circle'
              onClick={() => this.delYAxis(key)}
              style={{ marginLeft: 10 }}
            />
          </FormItem>
        ))}
        <div
          style={{
            width: 500,
            height: 400,
            position: 'absolute',
            right: 'calc(-100% - 200px)',
            top: -57 - 24 - 32
          }}
        >
          {this.props.preview({
            chart: {
              data: {
                data: [this.props.cols, ...this.props.dataSource]
              },
              tplId: this.props.tpl._id,
              worksheet: this.props.worksheet.name,
              reportId: this.props.reportId,
              _id: this.state._id,
              chartType: 'area',
              title: this.state.title,
              conf: {
                xAxis: this.state.xAxis,
                yAxis: this.state.yAxis
              }
            },
            type: this.props.type
          })}
        </div>
        <br />
        <br />
        <Button
          type='primary'
          onClick={this.submit}
          loading={this.props.updateChartHoc.loading}
        >
          保存
        </Button>
        {this.state._id && (
        <Button
          style={{ marginLeft: 15 }}
          type='danger'
          onClick={this.del}
          loading={this.props.removeChartHoc.loading}
        >
          删除
        </Button>)}
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
  mutate({ mutationName: 'updateChart', name: 'updateChartHoc' }),
  withRemoveChart
)(Interval)
