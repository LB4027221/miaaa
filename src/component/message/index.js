import { notification } from 'antd'
import { Component } from 'react'

const openNotificationWithIcon = ({
  type,
  message = '',
  description = ''
}) => {
  notification[type || 'info']({
    message,
    description
  })
}

class NotificationWithIcon extends Component {
  componentWillReceiveProps(nextProps) {
    const { data } = nextProps
    if (data) {
      console.log('====================================')
      console.log(data)
      console.log('====================================')
      openNotificationWithIcon(data.notification)
    }
  }
  render() {
    if (this.props.loading) {
      return null
    }

    return null
  }
}

export default NotificationWithIcon
