import React, { Fragment, createElement } from 'react'
import { renderRoutes } from 'react-router-config'

const showChildren = ({ pathname, length = 3 }) => pathname.includes('View')
  || pathname.split('/').length > length

const View = BaseComp => (props) => {
  const { route, location } = props

  return (
    <Fragment>
      {!showChildren(location) && createElement(BaseComp, props)}
      {renderRoutes(route.routes)}
    </Fragment>
  )
}

export default View
