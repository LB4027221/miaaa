import React from 'react'
import { Icon, Layout } from 'antd'
import { withUserReports } from '@gql'
import { compose } from 'recompose'
import withStyles from './styles'
import User from './user'

const { Header } = Layout

const View = (props) => {
  const {
    classes,
    collapsed,
    toggle,
    user,
    refetch,
    refetching,
    userReports
  } = props

  const icon = collapsed ? 'menu-unfold' : 'menu-fold'
  return (
    <Header className={classes.container}>
      <div role='button' className={classes.trigger} onClick={toggle}>
        <Icon
          type={userReports.loading ? 'loading' : icon}
        />
      </div>
      <User user={user} refetch={refetch} refetching={refetching} />
    </Header>
  )
}

export default compose(
  withStyles,
  withUserReports
)(View)
