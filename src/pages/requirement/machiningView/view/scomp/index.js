import React from 'react'
import {
  Radio
} from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'

const RadioGroup = Radio.Group

const Scomp = (props) => {
  let { report, dispatch } = props
  let { pickHouse } = report

  return (
    <RadioGroup
      style={{ width: 320 }}
      value={pickHouse}
      onChange={(e) => {
        const value = e.target.value
        report.pickHouse = value

        dispatch.editReport.setReport({ ...report })
      }}
    >
      <Radio value>启用</Radio>
      <Radio value={false}>不用</Radio>
    </RadioGroup>
  )
}

export default connect(state => ({ report: state.editReport }))(Scomp)
