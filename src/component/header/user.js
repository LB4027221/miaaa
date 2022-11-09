import React from 'react'
import { Menu, Icon, Avatar, Dropdown, Button } from 'antd'
import { branch, renderNothing, compose, renderComponent } from 'recompose'
import axios from '_axios'
import GlobalSearch from '@component/global_search'
import Notice from './notice'

import withStyles from './styles'

const logout = userId =>
  axios(`/logout?userId=${userId}`)
    .then(() => {
      setTimeout(() => {
        const { location } = window
        location.href = `${process.env.GATEWAY}/login/login.htm?goto_page=${location}`
      }, 500)
    })

const userMenu = (classes, userId) => (
  <Menu className={classes.menu} selectedKeys={[]} onClick={() => {}}>
    <Menu.Item disabled>
      <Icon type='user' />个人中心
    </Menu.Item>
    <Menu.Item disabled>
      <Icon type='setting' />设置
    </Menu.Item>
    <Menu.Item key='triggerError' disabled>
      <Icon type='close-circle' />触发报错
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key='logout'>
      <div role='button' onClick={() => logout(userId)}>
        <Icon type='logout' />退出登录
      </div>
    </Menu.Item>
  </Menu>
)

const View = ({
  user,
  classes,
  refetch,
  refetching
}) => (
  <div className={classes.rightTools}>
    <GlobalSearch />
    <Notice variables={{ userId: user._id }} />
    <Dropdown overlay={userMenu(classes, user.userId)}>
      <span className={`${classes.action} ${classes.account}`}>
        <Avatar size='small' className={classes.avatar} src={user.dingding.avatar} />
        <span className={classes.userName}>{user.userName}</span>
      </span>
    </Dropdown>
    <Button
      style={{ marginRight: 20 }}
      shape='circle'
      icon='reload'
      loading={refetching}
      onClick={refetch}
    />
  </div>
)

const NoDingView = ({ user, classes }) => (
  <div className={classes.rightTools}>
    <GlobalSearch />
    <Dropdown overlay={userMenu(classes, user.userId)}>
      <span className={`${classes.action} ${classes.account}`}>
        <span className={classes.userName}>{user.userName}</span>
      </span>
    </Dropdown>
  </div>
)

const renderWhileNoUser = branch(
  props => !props.user || !props.user.userName,
  renderNothing
)
const renderWhileNoDingding = branch(
  props => !props.user.dingding,
  renderComponent(NoDingView)
)

export default compose(
  withStyles,
  renderWhileNoUser,
  renderWhileNoDingding
)(View)
