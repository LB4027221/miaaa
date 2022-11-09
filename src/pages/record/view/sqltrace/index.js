
import React, { Component } from 'react'
import { Table, Tag, DatePicker, Select, Button } from 'antd'
import axios from 'axios'
import moment from 'moment'
import withStyles from './styles'

const { RangePicker } = DatePicker
const Option = Select.Option

const typeMap = ['查询', '导出']
const stateMap = ['失败', '成功']
const columns = [
  {
    title: '报表名称',
    dataIndex: 'reportName',
    key: 'reportName'
  },
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
    render: val => (
      <div>{typeMap[val]}</div>
    )
  },
  {
    title: '查询时间',
    dataIndex: 'opratorTime',
    key: 'opratorTime',
    render: val => (
      <div>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</div>
    )
  },
  {
    title: '查询时长',
    dataIndex: 'durationTime',
    key: 'durationTime',
    render: val => (
      <div>{`${val}ms`}</div>
    )
  },
  {
    title: '平均时长',
    dataIndex: 'averageTime',
    key: 'averageTime',
    render: val => (
      <div>{`${val}ms`}</div>
    )
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    render: val => (
      <Tag color={val === 1 ? 'green' : 'red'}>{stateMap[val]}</Tag>
    )
  }
]

class Sqltrace extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageSize: 15,
      current: 1,
      list: [],
      reportList: [],
      dataSource: {}
    }
  }
  async componentDidMount() {
    await this.getData(1)
    await this.getReportList()
  }
  getData = async (page, q = {}) => {
    let { data: { success, body } } = await axios.get('/sqltrace', {
      params: {
        current: page,
        pageSize: this.state.pageSize,
        ...q
      }
    })
    if (success) {
      this.setState({
        list: body.list,
        total: body.count,
        current: page
      })
    }
  }
  getReportList = async () => {
    let { data: { success, body } } = await axios.get('/report/list')
    this.setState({
      reportList: body.list
    })
  }
  handleTypeChange = (value) => {
    this.setState({
      type: Number(value)
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
      type: this.state.type,
      reportId: this.state.reportId
    }
    this.getData(1, dataSource)
    this.setState({
      dataSource
    })
  }

  handleDateChange = (data) => {
    this.setState({
      startDate: data[0],
      endDate: data[1]
    })
  }
  selectPage = (page) => {
    this.getData(page.current, this.state.dataSource)
  }
  render() {
    return (
      <div>
        <div className={this.props.classes.selectWraper}>
          <RangePicker onChange={this.handleDateChange} />
          <Select
            style={{ width: 300, marginLeft: 10 }}
            showSearch
            allowClear
            placeholder='请选择报表'
            optionFilterProp='children'
            onChange={this.handleReportChange}
          >
            {this.state.reportList.map(report => <Option key={report._id} value={report._id}>{report.cname}</Option>)}
          </Select>
          <Select
            style={{ width: 300, marginLeft: 10 }}
            placeholder='请选择操作类型'
            onChange={this.handleTypeChange}
          >
            <Option key='0' value='0'>查询</Option>
            <Option key='1' value='1'>导出</Option>
          </Select>
          <Button style={{ marginLeft: 30 }} className='searchBtn' type='primary' onClick={this.handleSearch}>搜索</Button>
        </div>
        <Table
          columns={columns}
          onChange={this.selectPage}
          expandedRowRender={record => <p style={{ margin: 0 }}>{record.sql}</p>}
          dataSource={this.state.list}
          pagination={{
            pageSize: this.state.pageSize,
            current: this.state.current,
            total: this.state.total
          }}
        />
      </div>
    )
  }
}
export default withStyles(Sqltrace)
