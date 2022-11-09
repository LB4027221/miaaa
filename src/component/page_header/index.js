import React from 'react'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { compose } from 'recompose'
import { take, getRoutes, renderNothingByTest, indexById } from '@lib'
import { withUser, withUserReports } from '@gql'
import withStyles from './styles'
import Content from './content'

const _renderPath = (route, reports) => (path) => {
  const id = path.split('/').pop()
  const flat = reports[id]
    ? { title: reports[id].cname, path: `/report/${reports[id]._id}` }
    : getRoutes(route, path)

  if (flat) {
    return (
      <Breadcrumb.Item key={flat.path}>
        <Link to={path}>
          {flat.title}
        </Link>
      </Breadcrumb.Item>
    )
  }

  return <span key='123' />
}

const View = ({
  route,
  location,
  data,
  children,
  renderPath,
  userReports
}) => {
  const paths = location.pathname
    .split('/')
    .filter(item => item)

  const newPaths = paths
    .reduce((acc, item, index) => {
      const path = take(index + 1, paths)

      return [...acc, `/${path.join('/')}`]
    }, [])
    .slice(1)

  const reports = indexById(userReports.user.reports)

  return (
    <Content>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>
            <Icon type='home' />
            {' 首页'}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {route.icon && <Icon type={route.icon} />}
          {` ${route.title}`}
        </Breadcrumb.Item>
        {newPaths.filter(item => item).map(renderPath || _renderPath(route, reports))}
      </Breadcrumb>
      {children}
    </Content>
  )
}

export default compose(
  withStyles,
  withRouter,
  withUser,
  withUserReports,
  renderNothingByTest(props => props.userReports.loading)
)(View)

export { Content }
