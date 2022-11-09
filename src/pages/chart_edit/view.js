import React from 'react'
import { Layout } from 'antd'
import { compose } from 'recompose'
import { withUser } from '@gql'
import { Provider } from 'react-redux'
import withErrorHandler from '@component/error'

import Ctx from './content'

import withStyle from './styles'
import store from '../report/store'


const { Content } = Layout

const View = ({ classes }) => (
  <Content className={classes.container}>
    <Provider store={store}>
      <Ctx />
    </Provider>
  </Content>
)

export default compose(
  withErrorHandler,
  withStyle,
  withUser
)(View)
