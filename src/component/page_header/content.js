import React from 'react'
import withStyles from './styles'


const View = ({
  classes,
  children
}) => (
  <div className={classes.container}>
    {children}
  </div>
)

export default withStyles(View)
