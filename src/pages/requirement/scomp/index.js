import React, { Fragment } from 'react'
import { renderRoutes } from 'react-router-config'

import List from './list'

const showChildren = ({ pathname }) => pathname.includes('View')
  || pathname.split('/').length > 3

const View = ({ route, location }) => (
  <Fragment>
    {!showChildren(location) && <List />}
    {renderRoutes(route.routes)}
  </Fragment>
)

export default View
