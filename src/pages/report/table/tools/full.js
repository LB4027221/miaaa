import React from 'react'
import { compose } from 'recompose'
import {
  Row,
  Col,
  Form,
  Icon,
  Button
} from 'antd'

import Comp from './components'
import withStyles from '../../styles'

const View = ({
  classes,
  components,
  toggle,
  submit,
  reset
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
        <Comp components={components} />
        <Col xxl={2} xl={4} md={6} sm={24} style={{ minWidth: 250 }} >
          <div className={classes.fullSubmit}>
            <span className={classes.submitButtons}>
              <Button type='primary' htmlType='submit'>
                查询
              </Button>
              <Button onClick={reset} style={{ marginLeft: 8 }}>
                重置
              </Button>
            </span>
            <span
              role='button'
              onClick={toggle}
              className={classes.toggleButton}
            >
              收起<Icon type='up' />
            </span>
          </div>
        </Col>
      </Row>
    </Form>
  </div>
)

export default compose(
  withStyles,
  Form.create()
)(View)
