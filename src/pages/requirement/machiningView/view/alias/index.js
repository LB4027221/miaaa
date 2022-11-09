import React from 'react'
import { Input } from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'

const Alias = (props) => {
  let { report } = props
  let { alias } = report
  return (
    <Input
      style={{ width: 320 }}
      value={alias}
      onChange={({ target }) => {
        report.alias = target.value
        // dispatch(setReport({ ...report }))
        props.dispatch.editReport.setReport({ ...report })
      }}
    />
  )
}
export default connect(({ editReport }) => ({
  report: editReport
}))(Alias)
