import React from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'
import { findById } from '../../util'

const { Option } = Select

const Child = (props) => {
  let { report, dispatch, reports } = props
  let { child = {} } = report
  child = child || {}
  return (
    <Select
      allowClear
      showSearch
      style={{ width: 320 }}
      value={child._id}
      onChange={(value) => {
        let child = findById(value, reports)
        report.child = child

        // dispatch(setReport({ ...report }))
        dispatch.editReport.setReport({ ...report })
      }}
    >
      {reports.map(item => <Option key={item._id}>{item.cname}</Option>)}
    </Select>
  )
}

export default connect(state => ({
  reports: state.editReport.reports || [],
  report: state.editReport
}))(Child)
