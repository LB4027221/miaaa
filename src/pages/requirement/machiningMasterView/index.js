import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import withTitle from '@component/title'
// import { compose } from 'recompose'
// import { withUser } from '@gql'
import store from './store'
import EditMaster from './view/index'

const View = (props) => {
  console.log(props)
  return (
    <Provider store={store}>
      <Fragment>
        <EditMaster {...props} _id={props.match.params.reportId} />
      </Fragment>
    </Provider>
  )
}

export default withTitle('编辑报表')(View)
