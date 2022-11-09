import React, { Component } from 'react'
import { Layout } from 'antd'
import Header from '@component/header'
import Sider from '@component/sider'

import withStyle from './styles'

const { localStorage } = window

class SiderLayout extends Component {
  state = {
    collapsed: localStorage.getItem('miaaa_sider')
      ? true /* eslint-disable-line */
      : false
  }

  toggle = () => {
    const { collapsed } = this.state
    localStorage.setItem('miaaa_sider', !collapsed ? 'rua' : '')
    this.setState({ collapsed: !collapsed })
  }

  render() {
    return (
      <Layout>
        <Sider
          collapsed={this.state.collapsed}
          toggle={this.toggle}
          routes={this.props.routes}
        />
        <Layout className={this.props.classes.layout}>
          <Header
            user={this.props.user}
            collapsed={this.state.collapsed}
            toggle={this.toggle}
            refetch={this.props.refetch}
            refetching={this.props.refetching}
          />
          {this.props.children}
        </Layout>
      </Layout>
    )
  }
}

export default withStyle(SiderLayout)
