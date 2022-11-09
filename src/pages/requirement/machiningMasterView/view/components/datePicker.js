import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Input, DatePicker } from 'antd'
import R from 'ramda/src'
import moment from 'moment'


const DATE_FORMAT = 'YYYY/MM/DD'
const today = moment(Date.now())

const defaultState = {
  label: '',
  date: today
}

class DatePickerContainer extends Component {
  state = {
    ...defaultState
  }


  componentDidMount() {
    const { editComp } = this.props

    if (!R.isEmpty(editComp)) {
      this.setState({ ...editComp })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { editComp } = nextProps

    if (!R.isEmpty(editComp)) {
      this.setState({
        ...editComp,
        date: moment(editComp.defaultValue)
      })
    }
  }
  setDefaultDate = date => this.setState({ date })

  handleInputLabel = ({ target }) => {
    const { value } = target
    this.setState({ label: R.trim(value) })
  }
  submit = () => {
    const { dispatch, editComp } = this.props

    if (!R.isEmpty(editComp)) {
      this.update()
    } else {
      this.create()
    }

    dispatch.modal.toggleDatePicker()
  }

  update = () => {
    const { date, label, key } = this.state
    const { dispatch } = this.props

    const data = {
      key,
      cname: '日期选择',
      name: 'datePicker',
      defaultValue: date.format(DATE_FORMAT),
      label
    }
    console.log(data)
    dispatch.component.setComponent(data)
  }

  create = () => {
    const { date, label } = this.state
    const { dispatch, components } = this.props
    const index = components.length
    const key = `datePicker${index}`

    const data = {
      key,
      cname: '日期选择',
      name: 'datePicker',
      defaultValue: date.format(DATE_FORMAT),
      label
    }

    dispatch.component.addComponent(data)
  }

  render() {
    const { visible, dispatch } = this.props
    const { label, date } = this.state

    return (
      <div>
        <Modal
          title='日期选择'
          visible={visible}
          style={{ width: 1000 }}
          onCancel={(e) => {
            dispatch.editComp.updateComponent(defaultState)
            dispatch.modal.toggleDatePicker()
          }}
          onOk={this.submit}
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
              <DatePicker
                value={date}
                format={DATE_FORMAT}
                onChange={this.setDefaultDate}
                style={{ width: 276 }}
              />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

const setState = state => ({
  modal: state.modal,
  components: state.component,
  editComp: state.editComp,
  visible: state.modal.datePickerVisible
})

export default connect(setState)(DatePickerContainer)
