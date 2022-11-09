import React from 'react'
import { compose } from 'recompose'
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
      layout='inline'
    >
      <Row>
        <Comp components={components} id={id} />
      </Row>
    </Form>
  </div>
)

export default compose(
  withStyles,
  Form.create()
)(View)
