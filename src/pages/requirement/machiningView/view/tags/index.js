import React from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
// import { setReport } from '../../action'

const { Option } = Select
const Tags = (props) => {
  let { report, dispatch } = props
  let { tags } = report

  return (
    <Select
      style={{ width: 320 }}
      value={tags}
      mode='multiple'
      onChange={(value) => {
        report.tags = value

        dispatch.editReport.setReport({ ...report })
      }}
    >
      <Option value='rukou'>入口</Option>
      <Option value='tongji'>统计</Option>
      <Option value='jiugongge'>九宫格</Option>
      <Option value='detail'>详情</Option>
      <Option value='detailTab'>详情Tab</Option>
    </Select>
  )
}

export default connect(state => ({
  report: state.editReport
}))(Tags)
