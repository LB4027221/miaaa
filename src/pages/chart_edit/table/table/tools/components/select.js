import React from 'react'
import {
  Select,
  Col
} from 'antd'
import { mergeLabelsOptions } from '@lib'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import { handleSelect, mapWhere } from './action'
import withStyles from './styles'

const { Option } = Select

const renderOption = ({ title, key, value }) => (
  <Option title={title} key={key} value={value}>{title}</Option>
)

const View = ({
  id,
  _id,
  where,
  independent = {},
  classes
}) => (
  <Col xxl={4} md={6} sm={24}>
    <div
      className={classes.formItem}
    >
      <Select
        allowClear
        placeholder={independent.placeholder}
        value={mapWhere(where)}
        onChange={handleSelect(id, _id)}
      >
        {mergeLabelsOptions(independent.labels, independent.options).map(renderOption)}
      </Select>
    </div>
  </Col>
)


const mapProps = (state, ownProps) => ({
  id: ownProps.id,
  where: state[ownProps.id].components[ownProps._id]
})

const EnhanceView = compose(
  withStyles,
  connect(mapProps)
)(View)

export default id => item => <EnhanceView id={id} key={item._id} {...item} />
