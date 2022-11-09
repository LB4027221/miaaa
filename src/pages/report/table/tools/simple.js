import React from 'react'
import { compose, withProps } from 'recompose'
import {
  Row,
  Col,
  Form,
  Icon,
  Button
} from 'antd'

import { takeThreeComponents, lessThanThree } from '@lib'

import Comp from './components'
import withStyles from '../../styles'

const View = ({
  classes,
  components,
  toggle,
  isLessThanThree,
  submit,
  reset
}) => (
  <div className={classes.form}>
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <Row>
        <Comp components={components} />
        <Col xxl={2} xl={4} md={6} sm={24} style={{ minWidth: 250 }}>
          <div className={classes.submitButtons}>
            <Button type='primary' htmlType='submit'>
              查询
            </Button>
            <Button onClick={reset} style={{ marginLeft: 8 }}>
              重置
            </Button>
            {!isLessThanThree &&
              <span className={classes.toggleButton} onClick={toggle} role='button'>
                展开
                <Icon type='down' />
              </span>
            }
          </div>
        </Col>
      </Row>
    </Form>
  </div>
)

const mapComponents = withProps(props => ({
  components: takeThreeComponents(props.width)(props.components),
  isLessThanThree: lessThanThree(props.width)(props.components)
}))

export default compose(
  mapComponents,
  withStyles,
  Form.create()
)(View)
