import React from 'react'
// import { withUser } from '@gql'
// import { mapProps, compose } from 'recompose'
// import { findBy } from '@lib'
import { Menu, Icon } from 'antd'

import { renderMenuItem } from './index'

// const findById = findBy('_id')
const { SubMenu } = Menu

export default ids => group => (
  <SubMenu
    key={group._id}
    title={<span><Icon type={`${ids.includes(group._id) ? 'folder-open' : 'folder'}`} /><span>{group.name}</span></span>}
  >
    {group.reports
      .map(item => ({
        _id: item._id,
        title: item.cname,
        path: `/report/${item._id}`
      }))
      .map(renderMenuItem)
    }
  </SubMenu>
)
