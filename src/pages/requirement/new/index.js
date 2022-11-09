import React, { Fragment } from 'react'
import Meta from './meta'
import MetaEditor from './meta_editor'
import provide from './context'
import store from './store'


export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 }
  }
}

const View = ({
  match
}) => (
  <Fragment>
    {/* <Base /> */}
    {!match.params.id && <Meta />}
    {match.params.id && <MetaEditor id={match.params.id} />}
  </Fragment>
)

export default provide(store)(View)
