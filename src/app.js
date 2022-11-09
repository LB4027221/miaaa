import { compose, branch, renderComponent } from 'recompose'
import { withUser } from '@gql'

import Login from './pages/login'
import Routes from './routes'
import Loading from './loading'

type Props = {
  data: {
    loading: boolean,
    user: Object | null
  }
}

const renderWhileNoUserInfo = branch(
  (props:Props):boolean => !props.data.user,
  renderComponent(Login)
)

const renderWhileLoading = branch(
  (props:Props):boolean => props.data.loading,
  renderComponent(Loading)
)

export default compose(
  withUser,
  renderWhileLoading,
  renderWhileNoUserInfo
)(Routes)
