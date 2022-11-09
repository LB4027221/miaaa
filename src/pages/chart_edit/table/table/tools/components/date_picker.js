import React from 'react'
import {
  Col,
  DatePicker,
  Tooltip
} from 'antd'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import moment from 'moment'

import withStyles from './styles'
import { handleDateChange } from './action'

const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const View = ({
  id,
  _id,
  label,
  where,
  classes
}) => (
  <Col xxl={4} md={6} sm={24}>
    <Tooltip title={label || '日期'} autoAdjustOverflow={false}>
      <div
        className={classes.formItem}
      >
        <DatePicker
          allowClear
          showTime
          showToday
          format={dateFormat}
          onChange={handleDateChange(id, _id)}
          value={where
            .map(item => item.replace(/'/g, ''))
            .map(item => moment(item))
            .pop()}
        />
      </div>
    </Tooltip>
  </Col>
)

const mapProps = (state, ownProps) => ({
  id: ownProps.id,
  where: state[ownProps.id].components[ownProps._id]
})

const EnhanceView = compose(
  withStyles,
  connect(mapProps)
)(View)

export default id => item => <EnhanceView key={item._id} {...item} id={id} />
