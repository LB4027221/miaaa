import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { withGridList } from '@gql'
import { renderWhileLoadingByTest } from '@lib'
import { pathOr, pickAll, map } from 'ramda/src'
import { Card, Col, Row, Icon, List, Table, Divider, Badge } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

import Empty from './empty'
import Create from './create'
import withStyles from './styles'

const getData = pathOr([], ['gridList', 'user', 'gridList'])

const renderCard = grid => (
  <Col span={8} key={grid._id}>
    <Card
      cover={<img src={`${process.env.OSSURL}${grid.snapshot}`} />}
      actions={[
        // <Icon type='setting' />,
        <Link to={`/dashboard/list/${grid._id}?type=edit`}><Icon type='edit' /></Link>,
        <Link to={`/dashboard/list/${grid._id}`}><Icon type='eye' /></Link>
      ]}
    >
      <Card.Meta
        title={grid.title}
        description={grid.description}
      />
    </Card>
  </Col>
)

const renderItem = item => (
  <List.Item
    actions={[
      <Link to={`/dashboard/list/${item._id}?type=edit`}><Icon type='edit' /></Link>,
      <Link to={`/dashboard/list/${item._id}`}><Icon type='eye' /></Link>
    ]}
  >
    <List.Item.Meta
      title={item.title}
      description={item.item}
    />
  </List.Item>
)

const titleI18n = {
  status: '状态',
  title: '标题',
  description: '描述'
}

const statusMap = {
  1: {
    type: 'success',
    text: '运行中'
  },
  0: {
    type: 'default',
    text: '关闭'
  }
}

const status = {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  filters: [
    { text: '运行中', value: 1 },
    { text: '关闭', value: 0 }
  ],
  onFilter: (value, record) => {
    console.log(record.status === Number(value))
    return record.status === Number(value)
  },
  render: val => (
    <Badge status={statusMap[val].type} text={statusMap[val].text} />
  )
}

const actions = {
  title: '操作',
  key: 'actions',
  dataIndex: 'actions',
  render: (_, row) => (
    <span>
      <Link to={`/dashboard/list/${row._id}?type=edit`}><Icon type='edit' /></Link>
      <Divider type='vertical' />
      <Link to={`/dashboard/list/${row._id}`}><Icon type='eye' /></Link>
    </span>
  )
}

const mapColumns = compose(
  map(key => ({
    key,
    dataIndex: key,
    title: titleI18n[key]
  })),
  Object.keys,
  pickAll(['title', 'description'])
)

const ListPage = (props) => {
  const list = getData(props)
  const columns = mapColumns(list[0])

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Create />
      </Col>
      <br />
      <br />
      <Col span={24}>
        <Card>
          <Table columns={[...columns, status, actions]} dataSource={[...list]} />
        </Card>
      </Col>
    </Row>
  )
}

const renderWhileEmpty = branch(
  props => !getData(props) || !getData(props).length,
  renderComponent(Empty)
)

export default compose(
  withStyles,
  withGridList,
  renderWhileLoadingByTest(props => props.gridList && props.gridList.loading),
  renderWhileEmpty
)(ListPage)
