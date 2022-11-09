import React, { Fragment } from 'react'
import renderRangePicker from './date'
// import renderSearch from './search'
// import renderSelectIn from './select'
// import renderDatePicker from './date_picker'

export const formStyle = {
  style: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    flexDirection: 'column'
  },
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 14,
    offset: 1
  }
}

const View = ({
  components,
  id
}) => (
  <Fragment>
    {/* {components.SelectIn && Object.values(components.SelectIn).map(renderSelectIn(id))} */}
    {/* {components.Search && Object.values(components.Search).map(renderSearch(id))} */}
    {components.RangePicker && Object.values(components.RangePicker).map(renderRangePicker(id))}
  </Fragment>
)

export default View
