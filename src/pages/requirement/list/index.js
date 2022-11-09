import React, { Fragment } from 'react'
import { renderRoutes } from 'react-router-config'
import List from './list'
import Provider from './context'

const showChildren = ({ pathname }) => pathname.split('/').length > 3

const View = ({ route, location }) => (
  <Fragment>
    <Provider>
      {!showChildren(location) && <List />}
      {renderRoutes(route.routes)}
    </Provider>
  </Fragment>
)

export default View
