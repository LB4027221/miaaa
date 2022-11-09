import React, { Component } from 'react'
import { Transfer, message } from 'antd'
import axios from 'axios'
import R from 'ramda/src'
import { onlyUpdateForKeys, compose } from 'recompose'
// import { setReport } from '../../action'
import { connect } from 'react-redux'

const QUERY_REPORT = `
{
  reports{
    cname
    _id
    usedOn
  }
}
`

class TabBrothers extends Component {
  state = {
    reportsList: [],
    targetKeys: [],
    selectedKeys: []
  }

  componentDidMount() {
    this.fetchList()
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    let { dispatch, report } = this.props

    report.tabBrothers = [...nextTargetKeys]
    dispatch.editReport.setReport({ ...report })

    this.setState({ targetKeys: nextTargetKeys })
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
  }

  fetchList = async () => {
    const { data } = await axios.post('/graphql', {
      query: QUERY_REPORT
    })
    if (data.errors) return message.error('获取报表列表错误')

    const { data: _data = {} } = data
    const { reports = [] } = _data
    // const findHasUsedOn = R.filter(R.compose(
    //   R.length,
    //   R.prop('usedOn')
    // ))
    const formatReportList = R.map(({ _id, cname }) => ({
      key: _id,
      title: cname,
      value: _id
    }))

    const reportsList = R.compose(formatReportList)(reports)

    let targetKeys = this.props.report.tabBrothers || []
    targetKeys = R.pluck('_id')(targetKeys)

    this.setState({ reportsList, targetKeys })

    let { dispatch, report } = this.props

    report.tabBrothers = [...targetKeys]
    dispatch.editReport.setReport({ ...report })
  }

  render() {
    const state = this.state

    return (
      <Transfer
        showSearch
        dataSource={state.reportsList}
        titles={['报表列表', '组合']}
        targetKeys={state.targetKeys}
        selectedKeys={state.selectedKeys}
        onChange={this.handleChange}
        onSelectChange={this.handleSelectChange}
        render={item => item.title}
      />
    )
  }
}
const mapState = state => ({
  report: state.editReport
})
export default compose(
  connect(mapState),
  onlyUpdateForKeys(['report'])
)(TabBrothers)
