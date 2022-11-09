import { setPropTypes } from 'recompose'
import PropTypes from 'prop-types'

const withPropTypes = setPropTypes({
  classes: PropTypes.object,
  login: PropTypes.func
})

export default withPropTypes
