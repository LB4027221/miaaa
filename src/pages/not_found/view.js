import React from 'react'
import Lottie from 'react-lottie'
import withTitle from '@component/title'
import { compose } from 'recompose'

import animationData from './data.json'
import withStyle from './styles'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}

const NotFound = ({
  classes
}) => (
  <div className={classes.container}>
    {/* <div className={classes.header}>
      Four oh Four! 你好像迷路了
    </div> */}
    <div
      style={{
        width: 430,
        height: 360,
        marginLeft: 200,
        marginTop: -100,
        backgroundImage: 'url("https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg")'
      }}
    />
    <div className={classes.context}>
      <div className={classes.title}>
        <title>4</title>
        <div className={classes.animation}>
          <Lottie options={defaultOptions} />
        </div>
        <title>4</title>
      </div>
      <div className={classes.footer}>
        <div className={classes.description}>抱歉，你访问的页面不存在</div>
        <div className={classes.btn}>
          返回首页
        </div>
      </div>
    </div>
  </div>
)

export default compose(
  withTitle('404'),
  withStyle
)(NotFound)
