import { withContext } from 'recompose'
import PropTypes from 'prop-types'


const provider = store => withContext(
  { store: PropTypes.object },
  () => ({ store })
)

export default provider
