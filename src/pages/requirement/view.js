import React, { Fragment } from 'react'
import { renderRoutes } from 'react-router-config'
import { Layout } from 'antd'
import PageHeader from '@component/page_header'
import withStyle from './styles'

const { Content } = Layout

const View = ({ route, classes }) => (
  <Fragment>
    <PageHeader route={route} />
    <Content className={classes.container}>
      {renderRoutes(route.routes)}
    </Content>
  </Fragment>
)

export default withStyle(View)
