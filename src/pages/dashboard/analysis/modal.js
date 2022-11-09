import React, { createElement } from 'react'
import { Modal } from 'antd'
import { connect } from 'react-redux'

const MyModal = ({
  body,
  toggleVisible,
  visible,
  worksheet
}) => {
  if (!body) {
    return null
  }
  return (
    <Modal
      title={worksheet}
      visible={visible}
      onOk={toggleVisible}
      onCancel={toggleVisible}
      width={800}
      footer={null}
    >
      {createElement(body)}
    </Modal>
  )
}

const mapState = state => ({
  body: state.modalBody,
  visible: state.visible,
  worksheet: state.worksheet
})
const mapDispatch = dispatch => ({
  toggleVisible: dispatch.visible.toggle
})

export default connect(mapState, mapDispatch)(MyModal)
