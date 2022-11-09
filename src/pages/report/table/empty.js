import React from 'react'
import { Empty } from 'antd'

const EmptyComp = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: '50%'
    }}
  >
    <Empty
      image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
      description={
        <span>
          没有数据
        </span>
      }
    />
  </div>
)

export default EmptyComp
