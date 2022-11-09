import React from 'react'
import { Menu } from 'antd'
import { withGridList } from '@gql'
import { pathOr } from 'ramda/src'
import { Link } from 'react-router-dom'

const getData = pathOr([], ['gridList', 'user', 'gridList'])

export const renderGrid = props => (
  <Menu.Item key={props._id}>
    <Link to={`/dashboard/list//${props._id}`}>{props.title}</Link>
  </Menu.Item>
)

const Dashboard = (props) => {
  const data = getData(props)
  return data.filter(i => i && i._id).map(renderGrid)
}

export default withGridList(Dashboard)
