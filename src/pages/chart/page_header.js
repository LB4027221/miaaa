import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

const PageHeader = ({ title }) => (
  <Breadcrumb>
    <Breadcrumb.Item>首页</Breadcrumb.Item>
    <Breadcrumb.Item><Link to='/dashboard'>工作站</Link></Breadcrumb.Item>
    <Breadcrumb.Item><Link to='/dashboard/analysis'>分析页</Link></Breadcrumb.Item>
    <Breadcrumb.Item>{title}</Breadcrumb.Item>
  </Breadcrumb>
)

export default PageHeader
