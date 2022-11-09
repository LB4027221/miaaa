import axios from 'axios'
import { message } from 'antd'
import Fingerprint2 from 'fingerprintjs2sync'

const deviceUUID = (new Fingerprint2()).getSync().fprint
const axiosInstance = axios.create()
const { location } = window
const href = location

axios.defaults.headers.common.deviceUUID = deviceUUID

axios.interceptors.request.use(config => ({
  ...config,
  withCredentials: true
}))

// 添加响应拦截器
axiosInstance.interceptors.response.use((response) => {
  const { data } = response
  if (data.errors) {
    data.errors.map(err => message.error(err.message))
  }
  if (data.success && data.msg) {
    message.info(data.msg)
  }
}, (error) => {
  if (error.response.status === 403) {
    message.error('登录失效，即将跳回登录页')
    setTimeout(() => {
      location.href = `${process.env.GATEWAY}/login/login.htm?goto_page=${href}`
    }, 2000)
  }
  if (error.response.status === 422) {
    if (error.response.data.errors) {
      error.response.data.errors.map(err => message.error(err.message))
    }
  }
})

export default axiosInstance
