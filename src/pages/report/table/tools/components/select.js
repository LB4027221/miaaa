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
  independent,
  classes
}) => (
  <Col xxl={2} xl={4} md={6} sm={24} style={{ minWidth: 250 }}>
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
  id: state.id,
  where: state[state.id].components[ownProps._id]
})

const EnhanceView = compose(
  withStyles,
  connect(mapProps)
)(View)

export default item => <EnhanceView key={item._id} {...item} />
