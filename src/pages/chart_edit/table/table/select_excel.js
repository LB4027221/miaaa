import React from 'react'
import { Select } from 'antd'
import { withExcelList } from '@gql'
import { renderWhileLoadingByName } from '@lib'
import { connect } from 'react-redux'
import { compose } from 'recompose'

const Option = Select.Option

const mapOption = (item, idx) => (
  <Option key={idx} value={item._id}>{item.title}</Option>
)

const SelectExcel = ({
  excelList,
  excel,
  handleChange
}) => {
  console.log(excelList)
  return (
    <Select
      mode='multiple'
      showSearch
      style={{ width: '100%' }}
      placeholder='需要用到的库'
      defaultValue={excel}
      onChange={handleChange}
    >
      {excelList.user.excelList.map(mapOption)}
    </Select>
  )
}

const mapState = state => ({
  excel: state.excel
})

const mapAction = dispatch => ({
  handleChange: dispatch.excel.onChange
})

export default compose(
  withExcelList,
  renderWhileLoadingByName('excelList'),
  connect(mapState, mapAction)
)(SelectExcel)

