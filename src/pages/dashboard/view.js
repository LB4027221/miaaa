import React, { createContext, Component } from 'react'
import { Layout, Breadcrumb } from 'antd'
import { renderRoutes } from 'react-router-config'
import PageHeader from '@component/page_header'
import { compose } from 'recompose'
import withErrorHandler from '@component/error'
import { getRoutes } from '@lib'
import { Link } from 'react-router-dom'

import withStyles from './styles'

const { Content } = Layout

export const BreadcrumbContext = createContext({})

const renderPath = route => (path) => {
  const flat = getRoutes(route, path) || {}

  return (
    <BreadcrumbContext.Consumer key={flat.path || '123'}>
      {val => (
        <Breadcrumb.Item>
          <Link to={path}>
            {flat.title || val.breadcrumb.title}
          </Link>
        </Breadcrumb.Item>
      )}
    </BreadcrumbContext.Consumer>
  )
}

class Dashboard extends Component {
  state = {
    breadcrumb: {}
  }

  setBreadcrumb = breadcrumb => this.setState({ breadcrumb })

  render() {
    const { classes, route } = this.props
    return (
      <BreadcrumbContext.Provider
        value={{
          breadcrumb: this.state.breadcrumb,
          setBreadcrumb: this.setBreadcrumb
        }}
      >
        <Content className={classes.container}>
          <PageHeader route={route} renderPath={renderPath(route)} />
          <Content className={classes.content}>
            {renderRoutes(route.routes)}
          </Content>
        </Content>
      </BreadcrumbContext.Provider>
    )
  }
}

export default compose(
  withErrorHandler,
  withStyles
)(Dashboard)
