import React from 'react'
import { Input } from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'

const RestApi = (props) => {
  let { report, dispatch } = props
  let { restApi } = report

  return (
    <Input
      style={{ width: 320 }}
      value={restApi}
      onChange={({ target }) => {
        report.restApi = target.value
        dispatch.editReport.setReport({ ...report })
      }}
    />
  )
}

export default connect(state => ({
  report: state.editReport
}))(RestApi)
