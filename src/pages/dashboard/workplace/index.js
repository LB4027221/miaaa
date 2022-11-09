import React from 'react'
import { Provider } from 'react-redux'
import { withUser, withUserReports } from '@gql'
import { compose } from 'recompose'
import withTitle from '@component/title'
import { renderWhileLoadingByTest } from '@lib'

import withStyles from '../styles'
import Cards from './cards'
import Groups from './groups/index'
import Modal from './modal'
import store from './store'
import Roles from './roles'
import Favorite from './favorite'
import History from './history'

const View = ({ classes, data }) => {
  const isAdmin = data.user.roles.map(item => item.roleId).includes(500)

  return (
    <Provider store={store}>
      <div className={classes.body}>
        <Modal />
        <Favorite />
        <div className={classes.reports}>
          <History />
          <br />
          <Cards />
        </div>
        <div className={classes.groups}>
          {isAdmin && <Groups />}
          <Roles />
        </div>
      </div>
    </Provider>
  )
}

export default compose(
  withTitle('工作台'),
  withStyles,
  withUser,
  withUserReports,
  renderWhileLoadingByTest(props => props.userReports.loading)
)(View)
