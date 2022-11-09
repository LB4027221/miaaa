import React from 'react'
import { withProps, compose } from 'recompose'
import { pinyin } from '@lib'
import head from 'ramda/src/head'
import { withUser, withUserReports } from '@gql'
import { Layout } from 'antd'

import withStyles from './styles'
import Results from './results'

const { Content } = Layout
const queryString = require('query-string')

const View = ({ reports, classes, isAdmin }) => (
  <Content className={classes.container}>
    <Content className={classes.content}>
      <Results data={reports} isAdmin={isAdmin} />
    </Content>
  </Content>
)

const mapQuery = withProps((props) => {
  const { q } = queryString.parse(props.location.search)
  const isAdmin = props.data.user.roles.map(item => item.roleId).includes(500)
  const reports = props.userReports.user.reports.filter(item =>
    item.cname.toLowerCase().includes(q.toLowerCase())
    || pinyin(item.cname).map(head).join('').includes(q.toLowerCase())
    || item._id === q)

  return { reports, isAdmin }
})

export default compose(
  withUser,
  withUserReports,
  mapQuery,
  withStyles
)(View)
