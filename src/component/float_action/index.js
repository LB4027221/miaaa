import React from 'react'
import withStyles from './styles'

const View = ({ classes, children, extra }) => (
  <div className={classes.container} >
    <div className={classes.left}>{extra}</div>
    <div className={classes.right}>{children}</div>
  </div>
)

export default withStyles(View)
