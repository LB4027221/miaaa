import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import withTitle from '@component/title'


import store from './store'
import Meta from './view/index'

const View = props => (
  <Provider store={store}>
    <Fragment>
      <Meta {...props} />
    </Fragment>
  </Provider>
)

export default withTitle('编辑报表')(View)
