import React from 'react'
import { Empty, Button } from 'antd'
import { Link } from 'react-router-dom'

const EmptyPage = () => (
  <Empty
    style={{ marginTop: 50 }}
    image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
    description={
      <span>
        现在一个看板都没有
      </span>
    }
  >
    <Button type='primary'>
      <Link to='/dashboard/list/new'>
        新建看板
      </Link>
    </Button>
  </Empty>
)


export default EmptyPage
