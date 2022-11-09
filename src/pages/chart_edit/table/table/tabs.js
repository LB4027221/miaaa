import React, { Fragment, Component } from 'react'
import { withReport, withUser, withReportCharts, withUpdateReportChart } from '@gql'
import { compose, withProps } from 'recompose'
import { connect } from 'react-redux'
import { mapDataSource, tryNumOrDate, renderWhileLoadingByTest, getChartData } from '@lib'
import { dissoc } from 'ramda/src'
import { Card, Button, Select } from 'antd'
import Preview from '@component/chart/views'
import Form from '@component/chart'

const mapRow = compose(
  Object.values,
  dissoc('key')
)

const conf = {
  stretchH: 'all',
  width: '100%',
  height: 0,
  autoWrapRow: true,
  rowHeaders: true,
  manualRowMove: true,
  manualColumnMove: true,
  contextMenu: true,
  filters: false,
  fixedRowsTop: true,
  readOnly: false,
  // dropdownMenu: true,
  formulas: true,
  language: 'zh-CN'
}

const { Option } = Select

class Demo extends Component {
  constructor(props) {
    super(props)
    const charts = props.reportCharts.report.ncharts || []

    this.state = {
      charts
    }
  }

  addChart = () => this.setState(state => ({ charts: [...state.charts, {}] }))

  onChange = idx => chartType =>
    this.setState(state =>
      ({ charts: state.charts.map((i, _idx) => (_idx === idx ? { ...i, chartType } : i)) }))

  submit = (state) => {
    const variables = {
      reportId: this.props.data.report._id,
      conf: {
        _id: state._id,
        chartType: state.chartType,
        title: state.title,
        conf: {
          ...state
        }
      }
    }

    this.props.updateReportChartHoc.submit(variables)
  }

  render() {
    const { data } = this.props
    const cols = data.report
      ? data.report.metaList.map(i => i.alias || '无')
      : []

    const rows = data.report
      ? mapDataSource(data.report.dataSource || [])
      : []

    const d = rows.map(mapRow)
    const dataSource = d.length > 0
      ? d.map(row => row.map(tryNumOrDate))
      : [cols.map(() => '')]

    return (
      <Fragment>
        {this.state.charts.map((chart, idx) => (
          <Card
            title='图表编辑'
            key={`${idx}`}
            style={{ width: 300 }}
          >
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
              submit={this.submit}
              dataSource={dataSource}
              tplFn={this.props.tplFn}
              preview={_props => <Preview {..._props} getChartData={getChartData} />}
            />
          </Card>
        ))}
        <Button onClick={this.addChart}>
          添加卡片
        </Button>
      </Fragment>
    )
  }
}

const mapState = state => ({
  id: state.id,
  columns: state.columns,
  visible: state.visible,
  current: state[state.id].current,
  __typename: state[state.id].__typename,
  pageSize: state.pageSize,
  components: state[state.id].submitComponents,
  componentsData: state[state.id].components
})

const mapDispatch = ({
  pageSize
}) => ({
  setPageSize: pageSize.onChange
})

export default compose(
  withUser,
  withProps(_props => ({ user: _props.data.user })),
  connect(mapState, mapDispatch),
  withReport,
  renderWhileLoadingByTest(props => props.data.loading),
  withProps(_props => ({ reportId: _props.data.report._id })),
  connect(null, x => x),
  withReportCharts,
  renderWhileLoadingByTest(props => props.reportCharts.loading),
  withUpdateReportChart
)(Demo)
