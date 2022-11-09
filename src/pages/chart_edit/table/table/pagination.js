import React from 'react'
import { Pagination } from 'antd'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withStyle from '../styles'

const mapState = state => ({
  current: state[state.id].current,
  pageSize: state[state.id].pageSize
})

const mapDispatch = (state, ownProps) => ({
  onShowSizeChange: state[ownProps.id].onShowSizeChange,
  onChange: state[ownProps.id].changeCurrent
})

const View = ({
  total,
  current,
  onChange,
  pageSize,
  classes,
  onShowSizeChange
}) => (
  <div className={classes.pagination}>
    <Pagination
      showTotal={_total => `总共 ${_total} 条`}
      showQuickJumper
      current={current}
      onChange={onChange}
      pageSize={pageSize}
      pageSizeOptions={['15', '25', '50', '100']}
      onShowSizeChange={onShowSizeChange}
      showSizeChanger
      total={total || 0}
    />
  </div>
)

export default compose(
  withStyle,
  connect(mapState, mapDispatch)
)(View)
