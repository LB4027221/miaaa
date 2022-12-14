import React, { PureComponent } from 'react'
import { Layout, Menu, Icon, Drawer } from 'antd'
import Logo from '@component/logo'
import { withProps, compose, branch, renderComponent } from 'recompose'
import { Link } from 'react-router-dom'
import { findBy, flattenGroup, renderNothingByName } from '@lib'
import { withUser, withGridList, withUserReports } from '@gql'
import { pathOr } from 'ramda/src'

import withStyles from './styles'
import renderGroup from './groups'

const { SubMenu } = Menu
const { Sider } = Layout
const findById = findBy('_id')

export const renderMenuItem = (props, index) => (
  <Menu.Item key={props._id || props.path || index}>
    <Link to={props.path}>{props.title}</Link>
  </Menu.Item>
)

export const renderFavorite = props => (
  <Menu.Item key={props._id}>
    <Link to={`/report/${props._id}`}>{props.cname}</Link>
  </Menu.Item>
)

export const renderSubMenu = props => (
  <SubMenu
    key={`${props.title}`}
    title={<span><Icon type={props.icon} /><span>{props.title}</span></span>}
  >
    {props.routes
      .filter(item => !item.hide)
      .map(renderMenuItem)
    }
  </SubMenu>
)

const getData = pathOr([], ['gridList', 'user', 'gridList'])

const renderGrid = props => (
  <Menu.Item key={props._id}>
    <Link to={`/dashboard/list/${props._id}`}>{props.title}</Link>
  </Menu.Item>
)

class SiderMenu extends PureComponent {
  state = {
    ids: []
  }

  onOpenChange = ids => this.setState({ ids })

  render() {
    const {
      collapsed,
      classes,
      routes,
      groups,
      extra,
      favorite,
      toggle
    } = this.props
    const gridData = getData(this.props)

    return (
      <Drawer
        visible={collapsed}
        placement='left'
        onClose={() => toggle()}
        style={{
          padding: 0,
          height: '100vh'
        }}
        bodyStyle={{
          padding: 0
        }}
      >
        <Sider
          width={256}
          trigger={null}
          collapsible
          className={classes.sider}
        >
          <Logo collapsed={collapsed} />
          <Menu
            onOpenChange={this.onOpenChange}
            theme='dark'
            mode='inline'
          >
            <SubMenu
              key='bar-chart'
              title={<span><Icon type='bar-chart' /><span>???????????????</span></span>}
            >
              {gridData.filter(i => i && i._id).map(renderGrid)}
            </SubMenu>
            {routes
              .filter(item => item.routes && !item.hide)
              .map(renderSubMenu)
            }
            <SubMenu
              key='_favorite'
              title={<span><Icon type='star-o' /><span>????????????</span></span>}
            >
              {favorite.filter(i => i && i._id).map(renderFavorite)}
            </SubMenu>
            {groups.map(renderGroup(this.state.ids))}
            <SubMenu
              key='my_own_reports'
              title={<span><Icon type='file-text' /><span>??????</span></span>}
            >
              {extra
                .map(item => ({
                  _id: item._id,
                  title: item.cname,
                  path: `/report/${item._id}`
                }))
                .map(renderMenuItem)
              }
            </SubMenu>
          </Menu>
        </Sider>
      </Drawer>
    )
  }
}

const mapGroups = withProps((props) => {
  const groupedIds = flattenGroup(props.data.groups)
  const getICanSeeGroup = group => ({
    ...group,
    reportIds: group.reportIds
      .filter(_id => findById(_id, props.userReports.user.reports))
  })
  const removeEmpty = group => group.reportIds.length

  const mapGroup = group => ({
    _id: group._id,
    name: group.name,
    reports: group.reportIds
      .map(_id => findById(_id, props.userReports.user.reports))
  })

  const mapFavorite = ({ favorite }) => favorite
    .map(_id => findById(_id, props.userReports.user.reports))

  return {
    favorite: mapFavorite(props.data.user),
    groups: props.data.groups
      .map(getICanSeeGroup)
      .filter(removeEmpty)
      .map(mapGroup),
    extra: props.userReports.user.reports
      .filter(item => !groupedIds.includes(item._id))
  }
})

const Loading = ({
  collapsed,
  classes,
  routes,
  toggle
}) => (
  <Drawer
    visible={collapsed}
    placement='left'
    onClose={() => toggle()}
    style={{
      padding: 0,
      height: '100vh'
    }}
    bodyStyle={{
      padding: 0
    }}
  >
    <Sider
      width={256}
      trigger={null}
      collapsible
      className={classes.sider}
    >
      <Logo collapsed={collapsed} />
      <Menu
        theme='dark'
        mode='inline'
      >
        <SubMenu
          key='bar-chart'
          title={<span><Icon type='loading' /><span>???????????????</span></span>}
        >
          {null}
        </SubMenu>
        {routes
          .filter(item => item.routes && !item.hide)
          .map(renderSubMenu)
        }
        <SubMenu
          key='_favorite'
          title={<span><Icon type='loading' /><span>????????????</span></span>}
        >
          {null}
        </SubMenu>
        <SubMenu
          key='my_own_reports'
          title={<span><Icon type='loading' /><span>??????</span></span>}
        >
          {null}
        </SubMenu>
      </Menu>
    </Sider>
  </Drawer>
)

const renderWhileLoading = branch(
  props => props.userReports.loading,
  renderComponent(Loading)
)

export default compose(
  withStyles,
  withUser,
  withUserReports,
  renderWhileLoading,
  mapGroups,
  withGridList
)(SiderMenu)
