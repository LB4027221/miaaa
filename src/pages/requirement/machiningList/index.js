import React, { Fragment } from 'react'
import { renderRoutes } from 'react-router-config'
import List from './list'
import Provider from './context'

const showChildren = ({ pathname, length = 3 }) => pathname.includes('View')
  || pathname.split('/').length > length

const View = ({ route, location }) => (
  <Fragment>
    <Provider>
      {!showChildren(location) && <List />}
      {renderRoutes(route.routes)}
    </Provider>
  </Fragment>
)

export default View
