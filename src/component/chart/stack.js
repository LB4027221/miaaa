import React, { Component } from 'react'
import { Select, Form, Button, Input } from 'antd'
import { compose, renderNothing, branch } from 'recompose'
import { withUpdateChart, withRemoveChart } from '@gql'
import { getChartId } from '@lib'
import mutate from '@lib/mutate'
import { isEmpty } from 'ramda/src'
import { aggregates } from './'

const { Option } = Select
const FormItem = Form.Item

class Stack extends Component {
  constructor(props) {
    super(props)
    const chart = props.chart
    const conf = !isEmpty(chart) && chart.conf
      ? chart.conf
      : {}

    this.state = {
      _id: !isEmpty(chart) && chart._id,
      title: !isEmpty(chart) && chart.title,
      percent: !isEmpty(conf) && conf.percent,
      item: !isEmpty(conf) && conf.item,
      aggregate: !isEmpty(conf) && conf.aggregate,
      itemFilter: !isEmpty(conf) && conf.itemFilter,
      options: !isEmpty(conf) && conf.options && conf.options.length ? conf.options : []

    }
  }

  updateState = (key, idx) => value => (key === 'yAxis'
    ? this.setState(state => ({ [key]: state[key].map((i, _idx) => (_idx === idx ? value : i)) }))
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
        chartType: 'stack',
        title: this.state.title,
        conf: {
          item: this.state.item,
          percent: this.state.percent,
          aggregate: this.state.aggregate,
          itemFilter: this.state.itemFilter,
          options: this.state.options.filter(i => i)
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
      item, percent, title, aggregate, itemFilter, options
    } = this.state

    return (
      <div>
        <FormItem label='??????'>
          <Input value={title} onChange={this.updateTState('title')} />
        </FormItem>
        <FormItem label='?????????'>
          <Select
            showSearch
            allowClear
            placeholder='?????????'
            style={{ width: '100%' }}
            value={percent}
            onChange={this.updateState('percent')}
          >
            {columns.map((column, idx) => (<Option key={`${idx}`} value={column}>{column}</Option>))}
          </Select>
        </FormItem>
        <FormItem label='????????????'>
          <Select
            showSearch
            allowClear
            placeholder='?????????'
            style={{ width: '100%' }}
            value={aggregate}
            onChange={this.updateState('aggregate')}
          >
            {aggregates.map((_item, idx) => (<Option key={`${idx}`} value={_item.type}>{_item.title}</Option>))}
          </Select>
        </FormItem>
        <FormItem label='??????'>
          <Select
            showSearch
            allowClear
            placeholder='??????'
            style={{ width: '100%' }}
            value={item}
            onChange={this.updateState('item')}
          >
            {columns.map((column, idx) => (<Option key={`${idx}`} value={column}>{column}</Option>))}
          </Select>
        </FormItem>
        <FormItem label='??????????????????'>
          <Input
            placeholder='??????????????????,???????????????,?????????'
            style={{ width: '100%' }}
            value={itemFilter}
            onChange={this.updateTState('itemFilter')}
          />
        </FormItem>
        <FormItem label='????????????'>
          <Select
            showSearch
            allowClear
            mode='multiple'
            placeholder='?????????'
            style={{ width: '100%' }}
            value={options}
            onChange={this.updateState('options')}
          >
            {columns.map((column, idx) => (<Option key={`${idx}`} value={column}>{column}</Option>))}
          </Select>
        </FormItem>
        <div
          style={{
            width: 500,
            height: 500,
            position: 'absolute',
            right: -600,
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
              chartType: 'stack',
              title: this.state.title,
              conf: {
                item: this.state.item,
                percent: this.state.percent,
                aggregate: this.state.aggregate,
                itemFilter: this.state.itemFilter,
                options: options.filter(i => i)
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
          ??????
        </Button>
        {this.state._id && (
        <Button
          style={{ marginLeft: 15 }}
          type='danger'
          onClick={this.del}
          loading={this.props.removeChartHoc.loading}
        >
          ??????
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
)(Stack)
