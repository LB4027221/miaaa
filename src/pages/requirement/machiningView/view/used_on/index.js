import React from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'

const { Option } = Select
const UsedOn = (props) => {
  let { report, dispatch } = props
  let { usedOn } = report

  return (
    <Select
      style={{ width: 320 }}
      mode='multiple'
      value={usedOn}
      onChange={(value) => {
        report.usedOn = value
        dispatch.editReport.setReport({ ...report })
      }}
    >
      <Option value='songxiaofu'>宋小福</Option>
      <Option value='songxiaocai'>宋小菜</Option>
      <Option value='songxiaocang'>宋小仓</Option>
      <Option value='caimi'>采秘</Option>
      <Option value='maidaishu'>麦大蔬</Option>
      <Option value='songxiaocaisiji'>宋小菜司机</Option>
      <Option value='yunzhanggui'>云掌柜</Option>
    </Select>
  )
}

export default connect(state => ({
  report: state.editReport
}))(UsedOn)
