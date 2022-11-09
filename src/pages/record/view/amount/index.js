
import React, { Component } from 'react'
import { Table, DatePicker, Select, Button, message, Card, Row, Col } from 'antd'
import axios from 'axios'
import _ from 'lodash'
import ReactEcharts from 'echarts-for-react'
import moment from 'moment'
import withStyles from './styles'

const {
  RangePicker
} = DatePicker
const Option = Select.Option
const dateFormat = 'YYYY/MM/DD'

const columns = [{
  title: '操作时间',
  dataIndex: 'time',
  key: 'time',
  align: 'center',
  width: 50
}, {
  title: '操作类型',
  dataIndex: 'actionName',
  key: 'actionName',
  align: 'center',
  width: 50,
  render: (val, rowData, index) => <span style={rowData.actionType === 4 ? { color: '#fa8c16' } : {}}>{val}</span>
}, {
  title: '操作人',
  dataIndex: 'userName',
  key: 'userName',
  align: 'center',
  width: 50,
  render: (val, rowData, index) => (
    <span
      style={{
          background: '#F06292',
          color: '#fff',
          padding: '1px 5px',
          borderRadius: '2px'
        }}
    >{val || 'admin'}
    </span>
  )
}, {
  title: '报表名称',
  dataIndex: 'reportName',
  key: 'reportName',
  align: 'center',
  width: 50
}, {
  title: '导出上限',
  dataIndex: 'count',
  key: 'count',
  align: 'center',
  width: 50,
  render: (val, rowData, index) => (
    <span style={val > 30000 ? { color: '#F44336' } : {}}>{val !== '-' ? `${val / 10000}w` : val}</span>
  )
}]

const sortColumn = [
  {
    title: '关键字',
    dataIndex: '_id',
    key: '_id',
    align: 'center',
    width: 50,
    render: (key, row) => {
      if (row.report) {
        return (
          <div>{row.report[0].cname}</div>
        )
      }
      if (row.user) {
        return (
          <div>{row.user[0].userName}</div>
        )
      }
    }
  },
  {
    title: '次数',
    dataIndex: 'count',
    key: 'count',
    align: 'center',
    width: 50
  }
]

export default class Amount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statistics: [],
      list: [],
      statisticsHeader: [],
      reportList: [],
      current: 1,
      pageSize: 10,
      userList: [],
      startDate: moment(),
      endDate: moment().add(1, 'day'),
      actionType: 0,
      UserId: undefined,
      reportId: undefined,
      dataSource: {},
      options: {},
      noHandlesReports: [],
      tableType: 1 // 1 搜索 2 排行
    }
    this.fetchUserlist()
    this.fetchReportList()
    this.fetchRecordDayCount()
  }

  async componentWillMount() {
    let [statistics, { count, list }] = [await this.fetchStatistic(), await this.fetchList(1, {
      startDate: this.state.startDate,
      endDate: this.state.endDate
    })]
    this.setState({
      statistics,
      list,
      statisticsHeader: ['报表总数', '本月新增报表', '本月报表更新统计', '历史报表导出次数'],
      total: count
    })
  }

  fetchStatistic = async () => {
    let { data: { success, body } } = await axios.get('/records/statistic')
    if (!success) message.error('获取统计数据失败,请刷新重试')
    return body
  }

  fetchReportList = async () => {
    let { data: { success, body: { list } } } = await axios('/report/list')
    if (success === 1) {
      list = list.map(report => ({
        id: report._id,
        name: report.cname,
        key: report._id
      }))
      this.setState({
        reportList: list
      })
    }
  }

  fetchUserlist = async () => {
    let { data: userList } = await axios('/records/userList')
    const list = []
    userList.forEach((user) => {
      if (user.userId) {
        list.push({
          id: user.userId,
          name: user.userName,
          key: user._id
        })
      }
    })
    this.setState({
      userList: list
    })
  }

  fetchList = async (page, q = {}) => {
    let { data: { success, body } } = await axios.get('/records/list', {
      params: {
        current: page,
        pageSize: this.state.pageSize,
        ...q
      }
    })
    if (!success) message.error('获取统计列表失败,请刷新重试')
    this.setState({
      list: body.list,
      total: body.count,
      current: page
    })
    return body
  }
  fetchSort = async (page, q = {}) => {
    let { data: { success, body } } = await axios.get('/records/sort', {
      params: {
        current: page,
        pageSize: this.state.pageSize,
        ...q
      }
    })
    if (!success) message.error('获取统计列表失败,请刷新重试')
    this.setState({
      list: body.list,
      total: body.count,
      noHandlesReports: body.noHandlesReports,
      current: page
    })
    return body
  }

  fetchRecordDayCount = async () => {
    let { data: { success, body } } = await axios.get('/records/dayCount')
    this.setState({
      options: {
        title: {
          text: '每日访问量导出量统计',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: _.map(body, item => moment(item.date).format('YYYY-MM-DD'))
        },
        yAxis: {
          splitLine: {
            show: false
          }
        },
        toolbox: {
          left: 'right',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [{
          startValue: '2018-10-10'
        }, {
          type: 'inside'
        }],

        series: [{
          name: '访问量',
          type: 'bar',
          data: _.map(body, item => item.accessCount),
          markLine: {
            silent: true,
            data: [{
              yAxis: 400
            }, {
              yAxis: 800
            }, {
              yAxis: 1200
            }, {
              yAxis: 1600
            }, {
              yAxis: 2000
            }]
          }
        },
        {
          name: '导出量',
          type: 'bar',
          data: _.map(body, item => item.exportCount),
          markLine: {
            silent: true,
            data: [{
              yAxis: 400
            }, {
              yAxis: 800
            }, {
              yAxis: 1200
            }, {
              yAxis: 1600
            }, {
              yAxis: 2000
            }]
          }
        }]
      }
    })
  }
  selectPage = (page) => {
    if (this.state.tableType === 1) {
      this.fetchList(page.current, this.state.dataSource)
    } else {
      this.fetchSort(page.current, this.state.dataSource)
    }
  }

  handleDateChange = (data, dataSource) => {
    this.setState({
      startDate: data[0],
      endDate: data[1]
    })
  }
  handleActionChange = (value) => {
    this.setState({
      actionType: Number(value)
    })
  }
  handleUserChange = (value) => {
    this.setState({
      userId: value
    })
  }
  handleReportChange = (value) => {
    this.setState({
      reportId: value
    })
  }
  handleSearch = () => {
    let dataSource = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      actionType: this.state.actionType,
      userId: this.state.userId,
      reportId: this.state.reportId
    }
    this.fetchList(1, dataSource)
    this.setState({
      dataSource,
      tableType: 1
    })
  }
  handleRanking = () => {
    let dataSource = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      actionType: this.state.actionType,
      userId: this.state.userId,
      reportId: this.state.reportId
    }
    this.fetchSort(1, dataSource)
    this.setState({
      dataSource,
      tableType: 2
    })
  }
  onShowSizeChange = (current, pageSize) => {
    let dataSource = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      actionType: this.state.actionType,
      userId: this.state.userId,
      reportId: this.state.reportId
    }
    this.setState({
      pageSize
    })
    this.fetchList(1, Object.assign({}, dataSource, {
      pageSize
    }))
  }
  goDetail = (id) => {
    window.open(`/#/report/${id}`)
  }

  renderStatistics = () => (
    <Row>
      {!_.isEmpty(this.state.statistics) && this.state.statisticsHeader.map((item, index) => (
        <Col key={index} span={6} ><Card title={item} bordered={false} style={{ textAlign: 'center', fontSize: 20 }}>{this.state.statistics[index]}</Card></Col>
            ))}
    </Row>
  )
  renderFilter = () => (
    <div style={{ margin: 20 }}>
      <span>操作时间: </span>
      <RangePicker
        defaultValue={[this.state.startDate, this.state.endDate]}
        format={dateFormat}
        style={{ marginLeft: 10 }}
        onChange={this.handleDateChange}
      />
      <span style={{ marginLeft: 20 }}>操作类型:</span>
      <Select
        style={{ width: 200, marginLeft: 10 }}
        defaultValue='0'
        onChange={this.handleActionChange}
      >
        <Option value='0'>全部</Option>
        <Option value='1'>查询</Option>
        <Option value='4'>导出</Option>
      </Select>
      <span style={{ marginLeft: 20 }}>操作人:</span>
      <Select
        style={{ width: 100, marginLeft: 10 }}
        showSearch
        allowClear
        optionFilterProp='children'
        placeholder='操作人姓名'
                // value={this.dealNullValue(this.state.submitterId)}
        onChange={this.handleUserChange}
      >
        {
          // eslint-disable-next-line
          this.state.userList.map((user, i) => <Option key={user.key} value={user.key}>{user.name}</Option>)
          }
      </Select>
      <span style={{ marginLeft: 20 }}>报表:</span>
      <Select
        style={{ width: 200, marginLeft: 10 }}
        showSearch
        allowClear
        optionFilterProp='children'
        placeholder='报表名称'
                // value={this.dealNullValue(this.state.submitterId)}
        onChange={this.handleReportChange}
      >
        {
          // eslint-disable-next-line
          this.state.reportList.map((report, i) => <Option key={report.key} value={report.id}>{report.name}</Option>)
          }
      </Select>
      <Button style={{ marginLeft: 30 }} className='searchBtn' type='primary' onClick={this.handleSearch}>搜索</Button>
      <Button style={{ marginLeft: 30 }} className='searchBtn' type='primary' onClick={this.handleRanking}>排行</Button>
    </div>
  )

  render() {
    console.log(this.state.noHandlesReports.filter(i => i.tags.includes('tongji')))
    return (
      <div>
        {this.state.options.tooltip && <ReactEcharts
          style={{ marginTop: 30 }}
          option={this.state.options}
          notMerge
          lazyUpdate
        />}
        {this.renderStatistics()}
        <h1 style={{ textAlign: 'center', fontSize: 18, marginBottom: 25 }}>报表操作详情</h1>
        {this.renderFilter()}
        <Table
          columns={this.state.tableType === 1 ? columns : sortColumn}
          dataSource={this.state.list}
          onChange={this.selectPage}
          pagination={{
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: this.state.pageSize,
          showSizeChanger: true,
          onShowSizeChange: this.onShowSizeChange,
          pageSizeOptions: ['10', '20', '40', '80', '100'],
          current: this.state.current,
          total: this.state.total
        }}
        />
        {this.state.tableType === 2 && <Card title='无操作记录报表'>
          {this.state.noHandlesReports.map(item => (
            <div>
              <Card.Grid style={(item.tags && item.tags.length > 0) ? { color: 'red' } : {}} key={item._id} onClick={() => this.goDetail(item._id)}>{item.cname} {item.tags.map(o => (
                <span>{o}</span>
              ))}</Card.Grid>
            </div>
          ))}
        </Card>}
      </div>
    )
  }
}

module.exports = withStyles(Amount)
