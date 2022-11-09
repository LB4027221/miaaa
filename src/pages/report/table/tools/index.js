import { connect } from 'react-redux'
import { branch, renderComponent, compose, mapProps } from 'recompose'
import { lessThanThree, findBy } from '@lib'
import { withUser, withUserReports } from '@gql'

import Full from './full'
import Simple from './simple'

const findById = findBy('_id')

const mapComponents = mapProps((props) => {
  const report = findById(props.id, props.userReports.user.reports)

  return {
    components: {
      SelectIn: report.SelectIn,
      Search: report.Search,
      RangePicker: report.RangePicker,
      datePicker: report.datePicker
    },
    width: props.ctx ? props.ctx.clientWidth : 0,
    submit: props.submit,
    reset: props.reset,
    expand: props.expand,
    toggle: props.toggle
  }
})

const mapState = (state, ownProps) => ({
  expand: state[ownProps.id].expand,
  submitComponents: state[ownProps.id].submitComponents
})

const mapDispatch = (state, ownProps) => ({
  toggle: state[ownProps.id].toggle,
  submit: state[ownProps.id].submit,
  reset: state[ownProps.id].reset
})

const renderWhileIsSimple = branch(
  props => !props.expand || lessThanThree(props.width)(props.components),
  renderComponent(Simple)
)

export default compose(
  withUser,
  withUserReports,
  connect(mapState, mapDispatch),
  mapComponents,
  renderWhileIsSimple
)(Full)
