import React from 'react'
import { renderRoutes } from 'react-router-config'
import { Layout } from 'antd'
// import PageHeader from '@component/page_header'
// import Title from '@component/page_header/title'
import { compose } from 'recompose'
import { withUser } from '@gql'
import { Provider } from 'react-redux'
import withErrorHandler from '@component/error'
// import Chard from '@component/chart'

import withStyle from './styles'
import store from './store'
// import HeaderContent from './header'

const { Content } = Layout

const View = ({ classes, route }) => (
  <Content className={classes.container}>
    <Provider store={store}>
      {renderRoutes(route.routes)}
    </Provider>
  </Content>
)

export default compose(
  withErrorHandler,
  withStyle,
  withUser
)(View)
