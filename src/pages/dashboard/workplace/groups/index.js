import React from 'react'
import { Card, List, Icon } from 'antd'
import { withUser } from '@gql'
import { compose } from 'recompose'
import withStyles from '../../styles'

import Del from './del'
import store from '../store'

// const toggle = () => store.dispatch({
//   type: 'visible/toggle'
// })

const open = () => store.dispatch({
  type: 'visible/open'
})

const edit = group => () => store.dispatch({
  type: 'visible/edit',
  payload: group
})

const renderGroup = item => (
  <List.Item
    actions={[
      <Icon onClick={edit(item)} type='edit' />,
      <Del group={item} />
    ]}
  >
    <List.Item.Meta
      title={item.name}
    />
  </List.Item>
)

const View = ({
  data,
  classes
}) => (
  <Card
    extra={<a onClick={open}>添加</a>}
    title={<span><Icon type='folder' /> 报表分组</span>}
    bordered={false}
    className={classes.groupsCard}
  >
    <List
      itemLayout='horizontal'
      dataSource={data.groups}
      renderItem={renderGroup}
    />
  </Card>
)

export default compose(
  withStyles,
  withUser
)(View)
