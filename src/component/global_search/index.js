import React from 'react'
import { compose } from 'recompose'
import { renderWhileLoading, renderNothingWhileIsMobile } from '@lib'
import { Provider } from 'react-redux'

import Complete from './complete'
import withData from './gql'
import store from './store'
import withStyles from './styles'

const View = props => (
  <Provider store={store}>
    <Complete {...props} />
  </Provider>
)

export default compose(
  renderNothingWhileIsMobile,
  withStyles,
  withData,
  renderWhileLoading
)(View)
