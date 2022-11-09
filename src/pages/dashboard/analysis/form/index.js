import React from 'react'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Form from '@component/chart/views'
import { getChartAllData } from '@lib'
import { branch, renderComponent, compose } from 'recompose'
import { withUserSubscribe, withUserUnSubscribe, withSubscription } from '@gql'
import { pathOr } from 'ramda/src'

const getSubscription = pathOr([], ['subscription', 'user', 'subscription'])

const iconLoading = branch(
  props => props.subscription.loading,
  renderComponent(() => (
    <Icon
      type='loading'
      spin
      style={{
        color: '#999',
        marginRight: 10
      }}
    />
  ))
)

const UnSub = withUserUnSubscribe(props => (
  <Icon
    type={`${props.userUnsubscribeHoc.loading ? 'sync' : 'heart'}`}
    spin={props.userUnsubscribeHoc.loading}
    theme='filled'
    style={{
      color: '#999',
      marginRight: 10
    }}
    onClick={() => {
      props.userUnsubscribeHoc.submit({
        chartId: props.chartId,
        userId: props.user._id,
        dingtalkId: props.user.dingding.dingtalkUserId
      }, () => props.subscription.refetch())
    }}
  />
))
const Sub = withUserSubscribe(props => (
  <Icon
    type={`${props.userSubscribeHoc.loading ? 'sync' : 'heart'}`}
    spin={props.userSubscribeHoc.loading}
    theme='outlined'
    style={{
      color: '#999',
      marginRight: 10
    }}
    onClick={() => {
      props.userSubscribeHoc.submit({
        chartId: props.chartId,
        userId: props.user._id,
        dingtalkId: props.user.dingding.dingtalkUserId
      }, () => props.subscription.refetch())
    }}
  />
))

const EnhanceSub = compose(
  withSubscription,
  iconLoading,
  branch(
    props => getSubscription(props).filter(i => i.chartId === props.chartId).length,
    renderComponent(UnSub)
  )
)(Sub)

const action = props => (props.data.user.roles.map(item => item.roleId).includes(500)
  ? (
    <span>
      <EnhanceSub
        user={props.data.user}
        chartId={props.chart._id}
      />
      <Link to={`/chart/${props.chart._id}`}>
        <Icon type='fund' style={{ color: '#999' }} />
      </Link>
      <Link style={{ marginLeft: 10 }} to={`/tplEdit/${props.chart.report}`}><Icon type='form' style={{ color: '#999' }} /></Link>
    </span>)
  : (
    <span>
      <EnhanceSub
        user={props.data.user}
        chartId={props.chart._id}
      />
      <Link to={`/chart/${props.chart._id}`}>
        <Icon type='fund' style={{ color: '#999' }}  />
      </Link>
    </span>))

const FormMap = props => (
  <Form
    {...props}
    getChartData={getChartAllData}
    action={action({
      ...props
    })}
  />
)

const mapDispatch = dispatch => ({
  toggleVisible: dispatch.modalBody.onChange
})

const OnlyPreview = props => (
  <Form
    {...props}
    getChartData={getChartAllData}
    action={action({
      ...props
    })}
  />
)

const FullView = connect(null, mapDispatch)(FormMap)

export default branch(
  props => props.onlyPreview,
  renderComponent(OnlyPreview)
)(FullView)
