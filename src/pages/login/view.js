import React from 'react'
import { Alert } from 'antd'

const Login = () => {
  const { location } = window
  setTimeout(() => {
    location.href = `${process.env.GATEWAY}/login/login.htm?goto_page=${process.env.DOMAIN}/${location.hash}`
  }, 2000)
  return (
    <div style={{ width: 400, margin: '0 auto', paddingTop: 300 }}>
      <Alert
        message='登录失效'
        description='即将跳转到登陆页'
        type='info'
        showIcon
      />
    </div>
  )
}

export default Login
