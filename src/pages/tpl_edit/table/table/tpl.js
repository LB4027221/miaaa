import React, { Component } from 'react'
import { HotTable } from '@lib/handsontable'
import { connect } from 'react-redux'
import { take, multiply, length, add } from 'ramda/src'
import { compose } from 'recompose'
import withResizeObserverProps from '@hocs/with-resize-observer-props'
import { Divider } from 'antd'
import Charts from './charts'

import Conf from './conf'

const conf = {
  stretchH: 'all',
  // width: 806,
  // height: 300,
  autoWrapRow: true,
  rowHeaders: true,
  colHeaders: true,
  manualRowMove: true,
  manualColumnMove: true,
  contextMenu: true,
  allowEmpty: true,
  filters: true,
  fixedRowsTop: true,
  dropdownMenu: ['filter_by_condition', 'filter_action_bar', 'filter_by_value'],
  formulas: true,
  language: 'zh-CN'
}
let i = 0

const getHeight = compose(
  multiply(35),
  add(2),
  length
)

class Tpl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      charts: props.worksheet.charts ? props.worksheet.charts : [],
      cards: []
    }
  }

  onChange = idx => chartType =>
    this.setState(state =>
      ({ charts: state.charts.map((i, _idx) => (_idx === idx ? { ...i, chartType } : i)) }))

  addChart = () => {
    return this.setState(state => ({ charts: [...state.charts, {}] }))
  }


  componentWillReceiveProps(nextProps) {
    const charts = nextProps.worksheet.charts ? nextProps.worksheet.charts : []
    if (JSON.stringify(this.state.charts)
      !== JSON.stringify(charts)) {
      this.setState({ charts })
      this.forceUpdate()
    }
  }

  componentDidMount() {
    if (!i) {
      this.HotTable.Handsontable.hooks.add('afterFilter', this.props.up)
      i++
    }
    if (this.HotTable) {
      const conf = this.props.worksheet.conf
      if (conf && conf.filter) {
        const filtersPlugin = this.HotTable.hotInstance.getPlugin('filters')

        conf.filter.forEach(({ conditions, column }) => {
          conditions.forEach((col) => {
            filtersPlugin.addCondition(column, col.name, col.args)
          })
        })
      }
      this.HotTable.hotInstance.worksheet = this.props.worksheet
    }
  }

  render() {
    const { data } = this.props.worksheet
    const d = [...data]
    const cols = d.shift()
    const _data = d.length
      ? take(1000, d).map(i => [...i])
      : [cols.map(() => '')]
    const height = getHeight(_data)

    return (
      <div ref={this.props.onRef}>
        <HotTable
          ref={ref => this.HotTable = ref}
          data={_data}
          {...conf}
          colHeaders={cols}
          width={this.props.containerWidth}
          height={height > 1000 ? 1000 : height}
        />
        <Divider />
        <Conf
          hot={() => this.HotTable}
          ws={this.props.worksheet}
          dataSource={cols}
          tpl={this.props.tpl}
        />
        <Divider />
        <Charts
          charts={this.state.charts}
          reportId={this.props.reportId}
          worksheet={this.props.worksheet}
          tpl={this.props.tpl}
          cols={cols}
          _data={_data}
          tplFn={this.props.tplFn}
        />
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatch
})

export default compose(
  connect(null, mapDispatch),
  withResizeObserverProps(({ width, height }) => ({
    containerWidth: width,
    containerHeight: height
  }))
)(Tpl)
