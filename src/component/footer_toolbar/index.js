import React, { createElement } from 'react'
import withStyles from './styles'

const View = ({ classes, children, extra }) => (
  <div className={classes.container} >
    <div className={classes.left}>{children}</div>
    <div className={classes.right}>{createElement(extra)}</div>
  </div>
)

export default withStyles(View)
