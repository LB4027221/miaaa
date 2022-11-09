import React from 'react'
import { withUser, withUserReports } from '@gql'
import { findBy, initReport, with404, renderWhileLoadingByTest } from '@lib'
import { compose, withProps } from 'recompose'
import withTitle from '@component/title'

import FooterToolbar from './footer_toolbar'
import store from '../store'
import withStyle from '../styles'

import Table from './table'

const findById = findBy('_id')

const View = (props) => {
  const { classes } = props
  const { report } = props
  const reducer = initReport(report)
  store.model(reducer)
  store.dispatch({ type: '@@RESET' })
  store.dispatch({
    type: 'id/onChange',
    payload: props.match.params.id
  })

  return (
    <div style={{ width: '100%', position: 'relative', height: '100%' }}>
      <div className={classes.table}>
        <Table />
      </div>
      <FooterToolbar />
    </div>
  )
}

const withReport = withProps(props => ({
  report: props.match.params.id
    ? findById(props.match.params.id, props.userReports.user.reports)
    : ''
}))

export default compose(
  withStyle,
  withUser,
  withUserReports,
  renderWhileLoadingByTest(props => props.userReports.loading),
  withReport,
  with404(props => !props.report),
  withTitle(props => (props.report ? props.report.cname : ''))
)(View)
