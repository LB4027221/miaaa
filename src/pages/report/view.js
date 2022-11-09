import React, { Fragment } from 'react'
import { renderRoutes } from 'react-router-config'
import { Layout } from 'antd'
import PageHeader from '@component/page_header'
import Title from '@component/page_header/title'
import { compose } from 'recompose'
import { withUser } from '@gql'
import { Provider } from 'react-redux'
import withErrorHandler from '@component/error'
import { renderNothingWhileIsMobile } from '@lib'

import withStyle from './styles'
import store from './store'
import HeaderContent from './header'

const { Content } = Layout

const MyHeader = ({ route }) => (
  <HeaderContent>
    <PageHeader route={route}>
      <Title />
    </PageHeader>
  </HeaderContent>
)
const EnhanceHeader = renderNothingWhileIsMobile(MyHeader)

const View = ({ classes, route }) => (
  <Content className={classes.container} id='tab-ctx'>
    <Provider store={store}>
      <Fragment>
        <EnhanceHeader route={route} />
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
