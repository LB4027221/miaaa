import React from 'react'
import { compose, withProps } from 'recompose'
import {
  Row,
  Form
} from 'antd'

import Comp from './components'
import withStyles from '../../styles'

const View = ({
  classes,
  components,
  submit,
  id
}) => (
  <div className={classes.form}>
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <Row>
        <Comp components={components} id={id} />
      </Row>
    </Form>
  </div>
)

const mapComponents = withProps(props => ({
  components: props.components,
  isLessThanThree: true
}))

export default compose(
  mapComponents,
  withStyles,
  Form.create()
)(View)
