import React from 'react'
import { Button, Icon } from 'antd'
import { Link } from 'react-router-dom'

const EmptyPage = () => (
  <Button type='dashed' block>
    <Link to='/dashboard/list/new?type=edit'>
      <Icon type='plus' /> 新建看板
    </Link>
  </Button>
)


export default EmptyPage
