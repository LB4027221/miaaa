import React, { Component } from 'react'
import { Select, Card, Col, Row, Button } from 'antd'
import { HotTable } from '@lib/handsontable'
import { connect } from 'react-redux'
import { take } from 'ramda/src'
import Preview from '@component/chart/views'
import Form from '@component/chart'
import { getChartData } from '@lib'
import Conf from './conf'

const conf = {
  stretchH: 'all',
  width: 806,
  height: 300,
  autoWrapRow: true,
  rowHeaders: true,
  colHeaders: true,
  manualRowMove: true,
  manualColumnMove: true,
  contextMenu: true,
  allowEmpty: false,
  filters: true,
  fixedRowsTop: true,
  dropdownMenu: ['filter_by_condition', 'filter_action_bar', 'filter_by_value'],
  formulas: true,
  language: 'zh-CN'
}
let i = 0

const { Option } = Select

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

    const homePage = document.querySelector('.home-page')
    const width = homePage.clientWidth - 40 - 64
    const height = (_data.length * 24) + 25

    return (
      <div id='hot-table' style={{ marginTop: -16 }}>
        <Conf ws={this.props.worksheet} dataSource={cols} />
        <HotTable
          ref={ref => this.HotTable = ref}
          data={_data}
          {...conf}
          colHeaders={cols}
          width={width}
          height={300}
        />
        <br />
        <Row gutter={16}>
          <Col span={8}>
            {this.state.charts.map((chart, idx) => (
              <Card title='图表编辑' key={`${idx}`}>
                <Select
                  defaultValue={chart.chartType}
                  style={{ width: '100%' }}
                  onChange={this.onChange(idx)}
                  placeholder='请选择你的图表类型'
                >
                  <Option value='area'>折线图</Option>
                  {/* <Option value='interval'>柱状图</Option> */}
                  <Option value='stack'>饼图</Option>
                  <Option value='card'>卡片</Option>
                  {/* <Option value='timeline'>带时间线的折线</Option> */}
                </Select>
                <Form
                  type={chart.chartType}
                  chart={chart}
                  reportId={this.props.reportId}
                  worksheet={this.props.worksheet}
                  tpl={this.props.tpl}
                  cols={cols}
                  dataSource={_data}
                  tplFn={this.props.tplFn}
                  preview={_props => <Preview {..._props} getChartData={getChartData} />}
                />
              </Card>
            ))}
            <br />
            <Button onClick={this.addChart}>
              添加图表
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatch
})

export default connect(null, mapDispatch)(Tpl)
