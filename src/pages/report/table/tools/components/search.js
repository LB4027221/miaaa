import React from 'react'
import {
  Col,
  Input,
  Icon
} from 'antd'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import { handleInput, mapInput } from './action'
import withStyles from './styles'

const View = ({
  independent,
  id,
  _id,
  where,
  classes
}) => (
  <Col xxl={2} xl={4} md={6} sm={24} style={{ minWidth: 250 }}>
    <div
      className={classes.formItem}
    >
      <Input
        suffix={<Icon type='search' />}
        onChange={handleInput(id, _id)}
        placeholder={independent.placeholder}
        value={mapInput(where)}
      />
    </div>
  </Col>
)

const mapProps = (state, ownProps) => ({
  id: state.id,
  where: state[state.id].components[ownProps._id]
})

const EnhanceView = compose(
  withStyles,
  connect(mapProps)
)(View)

export default item => <EnhanceView key={item._id} {...item} />
