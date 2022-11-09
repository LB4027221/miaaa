import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Input, DatePicker } from 'antd'
import R from 'ramda/src'


const { RangePicker } = DatePicker

class RangePickerContainer extends Component {
  state = {
    label: ''
  }


  setDefaultRange = (e) => {

  }
  handleInputLabel = ({ target }) => {
    const { value } = target
    this.setState({ label: R.trim(value) })
  }

  render() {
    const { visible, dispatch } = this.props
    const { label } = this.state

    return (
      <div>
        <Modal
          title='日期范围选择'
          visible={visible}
          style={{ width: 1000 }}
          onOk={e => dispatch.modal.toggleRangePicker()}
          onCancel={e => dispatch.modal.toggleRangePicker()}
        >
          <div className='form-item'>
            <div className='label'>组件标题:</div>
            <div className='item'>
              <Input
                style={{ width: 276 }}
                onChange={this.handleInputLabel}
                value={label}
              />
            </div>
          </div>
          <div className='form-item'>
            <div className='label'>默认时间:</div>
            <div className='item'>
              <RangePicker onChange={this.setDefaultRange} />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

const setState = state => ({
  modal: state.modal,
  visible: state.modal.rangePickerVisible
})

export default connect(setState)(RangePickerContainer)
