import React from 'react'
import { Pagination, Skeleton } from 'antd'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withReportCount } from '@gql'
import { pathOr } from 'ramda/src'

import withStyle from '../styles'

const totalVal = pathOr(0, ['report', 'total'])

const mapState = state => ({
  current: state[state.id].current,
  pageSize: state[state.id].pageSize,
  components: state[state.id].submitComponents,
  __typename: state[state.id].__typename
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
  onShowSizeChange,
  style
}) => (
  <div className={classes.pagination} style={style}>
    {(total && total.loading) && <Skeleton active paragraph={{ rows: 0 }} width={300} /> }
    {(total && !total.loading) && <Pagination
      showTotal={_total => `总共 ${_total} 条`}
      showQuickJumper
      current={current}
      onChange={onChange}
      pageSize={pageSize}
      pageSizeOptions={['15', '25', '50', '100']}
      onShowSizeChange={onShowSizeChange}
      showSizeChanger
      size='small'
      total={totalVal(total)}
    />}
  </div>
)

export default compose(
  withStyle,
  connect(mapState, mapDispatch),
  withReportCount
)(View)
