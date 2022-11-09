import React from 'react'
import { Card, Icon, Tag } from 'antd'
import { withUser } from '@gql'
import { compose } from 'recompose'
import withStyles from '../../styles'

const renderRoles = item => (
  <span key={item.roleId}>
    <Tag style={{ marginBottom: 8 }}>{item.roleName}</Tag>
  </span>
)

const View = ({
  data,
  classes
}) => (
  <Card
    title={<span><Icon type='user' /> 我的角色</span>}
    bordered={false}
    className={classes.roles}
  >
    {!data.user.roles.length && '暂无角色'}
    {data.user.roles.map(renderRoles)}
  </Card>
)

export default compose(
  withStyles,
  withUser
)(View)
