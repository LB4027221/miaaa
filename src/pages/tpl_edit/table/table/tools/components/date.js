import React from 'react'
import {
  Col,
  DatePicker,
  Tooltip
} from 'antd'
import moment from 'moment'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import withStyles from './styles'
import { handlePickDate } from './action'

const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'

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
        <RangePicker
          allowClear
          format={dateFormat}
          onChange={handlePickDate(id, _id)}
          placeholder={['开始时间', '结束时间']}
          value={where
            .map(item => item.replace(/'/g, ''))
            .map(item => moment(item))}
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

export default id => item => <EnhanceView key={item._id} id={id} {...item} />
