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
  <Col xxl={2} xl={4} md={6} sm={24} style={{ minWidth: 250 }}>
    <Tooltip title={label || '日期'} autoAdjustOverflow={false}>
      <div
        className={classes.formItem}
      >
        <RangePicker
          allowClear
          style={{
            width: '100%'
          }}
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
  id: state.id,
  where: state[state.id].components[ownProps._id]
})

const EnhanceView = compose(
  withStyles,
  connect(mapProps)
)(View)

export default item => <EnhanceView key={item._id} {...item} />
