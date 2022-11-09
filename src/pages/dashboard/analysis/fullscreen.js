import React from 'react'
import { Button } from 'antd'
import withStyles from './styles'

const Fullscreen = ({
  classes
}) => (
  <Button
    className={classes.fullscreen}
    icon='fullscreen'
    shape='circle'
    size='large'
  />
)

export default withStyles(Fullscreen)
