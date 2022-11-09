import React from 'react'
import { Radio } from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const IsRealTime = (props) => {
  let { report, dispatch } = props
  let { isRealTime } = report

  return (
    <RadioGroup
      onChange={({ target }) => {
        const { value } = target

        report.isRealTime = value

        dispatch.editReport.setReport({ ...report })
      }}
      value={isRealTime}
    >
      <RadioButton value>实时数据报表</RadioButton>
      <RadioButton value={false}>离线数据报表</RadioButton>
    </RadioGroup>
  )
}

export default connect(state => ({
  report: state.editReport
}))(IsRealTime)
