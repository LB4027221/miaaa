import React from 'react'
import { withUser } from '@gql'
import { findBy, initReport, with404 } from '@lib'
import { compose, withProps } from 'recompose'
import withTitle from '@component/title'

import store from '../store'
import withStyle from '../styles'

import Table from './table'
import Tabs from './tabs'

const findById = findBy('_id')

const defaultConf = report => ({
  panes: [
    {
      title: report.cname,
      content: <Table />,
      key: report.cname,
      closable: false
    }
  ]
})

const View = (props) => {
  const { classes } = props
  const { report } = props
  try {
    const reducer = initReport(report)
    store.model(reducer)
    store.dispatch({ type: '@@RESET' })
    store.dispatch({
      type: 'id/onChange',
      payload: props.match.params.id
    })

    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <div className={classes.table}>
          <Tabs {...defaultConf(report)} />
        </div>
      </div>
    )
  } catch (e) {
    return (
      <div>
        <h1>这张表有点问题，可以问下旺张</h1>
      </div>
    )
  }
}

const withReport = withProps(props => ({
  report: props.match.params.id
    ? findById(props.match.params.id, props.data.user.reports)
    : ''
}))

export default compose(
  withStyle,
  withUser,
  withReport,
  with404(props => !props.report),
  withTitle(props => (props.report ? props.report.cname : ''))
)(View)
