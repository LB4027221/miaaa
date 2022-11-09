import React, { Fragment } from 'react'
import { renderRoutes } from 'react-router-config'
import { Layout } from 'antd'
import { compose } from 'recompose'
import { withUser } from '@gql'
import { Provider } from 'react-redux'
import withErrorHandler from '@component/error'

import withStyle from './styles'
import store from './store'

const { Content } = Layout

const View = ({ classes, route }) => (
  <Content className={classes.container}>
    <Provider store={store}>
      <Fragment>
        <Content className={classes.content}>
          {renderRoutes(route.routes)}
        </Content>
      </Fragment>
    </Provider>
  </Content>
)

export default compose(
  withErrorHandler,
  withStyle,
  withUser
)(View)
