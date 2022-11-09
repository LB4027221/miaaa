import React, { Component } from 'react'
import { message, Table, DatePicker, Select, Button } from 'antd'
import axios from 'axios'

const { RangePicker } = DatePicker
const Option = Select.Option
const dateFormat = 'YYYY/MM/DD'

const columns = [{
  title: '操作人',
  dataIndex: 'user',
  key: '_id',
  align: 'center',
  width: 50,
  render: val => (
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
  title: '操作次数',
  dataIndex: 'count',
  key: 'user',
  align: 'center',
  width: 50
}]

export default class Ranking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statistics: [],
      list: [],
      statisticsHeader: [],
      current: 1,
      pageSize: 10,
      userList: [],
      startDate: undefined,
      endDate: undefined,
      actionType: 0,
      UserId: undefined,
      dataSource: {},
      options: {}
    }
  }
  componentDidMount() {
    this.fetchRanking()
  }

  fetchRanking = async (q = {}) => {
    let { data: { success, body } } = await axios.get('/records/ranking/list', {
      params: {
        ...q
      }
    })
    if (!success) return message.error('获取统计数据失败,请刷新重试')
    this.setState({
      list: body
    })
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

  handleSearch = () => {
    let dataSource = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      actionType: this.state.actionType
    }
    this.fetchRanking(dataSource)
  }
  renderFilter = () => (
    <div style={{ margin: 20 }}>
      <span>操作时间: </span>
      <RangePicker
        format={dateFormat}
        style={{ marginLeft: 10 }}
        onChange={this.handleDateChange}
      />
      <span style={{ marginLeft: 200 }}>操作类型:</span>
      <Select
        style={{ width: 200, marginLeft: 10 }}
        defaultValue='0'
        onChange={this.handleActionChange}
      >
        <Option value='0'>全部</Option>
        <Option value='1'>查询</Option>
        <Option value='4'>导出</Option>
      </Select>
      <Button style={{ marginLeft: 200 }} className='searchBtn' type='primary' onClick={this.handleSearch}>搜索</Button>
    </div>
  )

  render() {
    const { list } = this.state
    return (
      <div>
        <h1 style={{
textAlign: 'center', fontSize: 18, marginTop: 30, marginBottom: 25
}}
        >报表操作次数排行
        </h1>
        {this.renderFilter()}
        <Table
          columns={columns}
          dataSource={this.state.list}
          pagination={{
          total: list.length
        }}
        />
      </div>
    )
  }
}
