import React from 'react'
import { Menu, Icon } from 'antd'
import { renderMenuItem } from './index'

const { SubMenu } = Menu

const View = ({ reports }) => (
  <SubMenu
    key='my_own_reports'
    title={<span><Icon type='file-text' /><span>我的报表</span></span>}
  >
    {reports
      .map(item => ({
        title: item.cname,
        path: `/report/${item._id}`
      }))
      .map(renderMenuItem)
    }
  </SubMenu>
)

export default View
