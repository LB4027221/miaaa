import React from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'

const { Option } = Select
const Limit = (props) => {
  let { report, dispatch } = props
  let { limit } = report
  limit = String(limit)
  return (
    <Select
      style={{ width: 320 }}
      value={limit}
      onChange={(value) => {
        report.limit = Number(value)
        // dispatch(setReport({ ...report }))
        dispatch.editReport.setReport({ ...report })
      }}
    >
      <Option value='10'>10</Option>
      <Option value='15'>15</Option>
      <Option value='25'>25</Option>
      <Option value='35'>35</Option>
      <Option value='50'>50</Option>
      <Option value='1000'>1000</Option>
    </Select>
  )
}

export default connect(state => ({
  report: state.editReport
}))(Limit)
