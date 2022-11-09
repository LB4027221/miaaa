import { compose, withProps, branch, renderComponent } from 'recompose'
import withErrorHandler from '@component/error'
import ViewGrid from './view_grid'
import UpdateGrid from './update_grid'

const renderWhileIsView = branch(
  props => props.type && props.type === 'edit',
  renderComponent(UpdateGrid)
)

export default compose(
  withProps(props => {
    const params = new URLSearchParams(props.location.search)
    return {
      type: params.get('type')
    }
  }),
  renderWhileIsView
)(ViewGrid)
