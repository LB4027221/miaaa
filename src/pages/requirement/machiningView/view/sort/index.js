import React from 'react'
import {
  Input
} from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'

const Sort = (props) => {
  let { report, dispatch } = props
  let { sort } = report

  return (
    <Input
      type='number'
      placeholder='填入数字'
      style={{
        width: 320
      }}
      onChange={({ target }) => {
        const sort = target.value
        report.sort = sort

        // dispatch(setReport({ ...report }))
        dispatch.editReport.setReport({ ...report })
      }}
      value={sort}
    />
  )
}

export default connect(
  (state) => ({
    report: state.editReport
  })
)(Sort)
