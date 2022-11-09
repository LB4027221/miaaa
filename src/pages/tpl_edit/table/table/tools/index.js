import { connect } from 'react-redux'
import { branch, renderComponent, compose, mapProps } from 'recompose'
import { findBy } from '@lib'
import { withUser, withUserReports } from '@gql'

import Full from './full'
import Simple from './simple'

const findById = findBy('_id')

const mapComponents = mapProps((props) => {
  const report = findById(props.id, props.userReports.user.reports)

  return {
    id: props.id,
    components: {
      // SelectIn: report.SelectIn,
      // Search: report.Search,
      RangePicker: report.RangePicker
      // datePicker: report.datePicker
    },
    submit: props.submit,
    reset: props.reset,
    expand: props.expand,
    toggle: props.toggle
  }
})

const mapState = (state, ownProps) => ({
  expand: false,
  submitComponents: state[ownProps.id].submitComponents
})

const mapDispatch = (state, ownProps) => ({
  toggle: state[ownProps.id].toggle,
  submit: state[ownProps.id].submit,
  reset: state[ownProps.id].reset
})

const renderWhileIsSimple = branch(
  () => true,
  renderComponent(Simple)
)

export default compose(
  withUser,
  withUserReports,
  connect(mapState, mapDispatch),
  mapComponents,
  renderWhileIsSimple
)(Full)
