import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './logo.svg'
import Full from './full.svg'
import withStyle from './styles'

const View = ({
  classes,
  collapsed
}) => (
  <div key='logo' className={classes.logo}>
    <Link to='/'>
      <div
        style={{
          transform: `scale(0.45) translateX(-${collapsed ? '0' : '55'}px)`
        }}
        className={classes.full}
      >
        {!collapsed && <Full />}
        {collapsed && <Logo />}
      </div>
    </Link>
  </div>
)

export default withStyle(View)
