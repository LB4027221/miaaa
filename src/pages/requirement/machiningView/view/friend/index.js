import React from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'
import { findById } from '../../util'

const { Option } = Select

const Friend = (props) => {
  let { report, dispatch, reports } = props
  let { friend = {} } = report
  friend = friend || {}
  return (
    <Select
      allowClear
      showSearch
      style={{ width: 320 }}
      value={friend._id}
      onChange={(value) => {
        let friend = findById(value, reports)
        report.friend = friend

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
}))(Friend)
