import { message } from 'antd'

export const openHref = ({
  url,
  filename
}) => {
  const link = document.createElement('a')
  link.download = filename
  link.href = url

  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false
  })

  link.dispatchEvent(clickEvent)
}

const downloadFile = (res, {
  url,
  filename
}) => {
  if (!res.success) {
    return message.error(res.errors[0])
  }

  return openHref({ url, filename })
}

export default downloadFile
