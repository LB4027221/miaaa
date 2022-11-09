import React from 'react'
import { branch, renderComponent } from 'recompose'
import { Link } from 'react-router-dom'
import { Divider } from 'antd'

const Authorizated = ({ id }) => (
  <span>
    <Link to={`/report/${id}`}>查看</Link>
    <Divider type='vertical' />
    <Link to={`/requirement/list/${id}`}>修改</Link>
  </span>
)

const Unauthorizated = () => (
  <span />
  // <span>
  //   <a onClick={() => beingAuthorized(id)}>申请查看</a>
  // </span>
)

const renderWhileUnauthorizated = branch(
  props => !props.authorizated,
  renderComponent(Unauthorizated)
)


export default renderWhileUnauthorizated(Authorizated)
