import React, { createElement, Component } from 'react'
import { Provider } from 'react-redux'
import { withCharts, withUser, withChart } from '@gql'
import withErrorHandler from '@component/error'
import { compose, branch, renderComponent, onlyUpdateForKeys, pure } from 'recompose'
import { getChartsFromUser, renderWhileLoadingByTest } from '@lib'
import withTitle from '@component/title'
import { Skeleton, Card } from 'antd'
import { renderRoutes } from 'react-router-config'
import { map, toPairs } from 'ramda/src'
import { of, fromEvent } from 'rxjs'
import { map as rxMap, mergeAll } from 'rxjs/operators'

import withStyles from '../styles'
import Chart from './form'
import store from './store'
// import Modal from './modal'
// import MapBox from './map'

const mapObj = fn => compose(
  map(fn),
  toPairs
)
const Fund = props => renderRoutes(props.route.routes)

export const CardChart = props => (
  <div style={{ width: '100%', height: '100%' }}>
    {props.chartData.loading ? (
      <Card bodyStyle={{ padding: 10 }}>
        <Skeleton loading active paragraph={{ rows: 2 }} />
      </Card>
    ) : (
      <Chart {...props} />
    )}
  </div>
)
export const MyChart = props => (
  <div style={{ width: '100%', height: '100%' }}>
    {props.chartData.loading ? (
      <Card bodyStyle={{ padding: 10 }}>
        <Skeleton loading active paragraph={{ rows: 7 }} />
      </Card>
    ) : (
      <Chart {...props} />
    )}
  </div>
)
const DataCartChart = withChart(CardChart)
const DataChart = withChart(MyChart)

const defaultLineStyle = {
  stroke: '#d9d9d9',
  lineWidth: 1,
  lineDash: [3, 3]
}

const darkLineStyle = {
  stroke: '#292D32',
  lineWidth: 1,
  lineDash: [2, 2]
}

export class ChartSwitch extends Component {
  state = { lineStyle: defaultLineStyle }

  componentDidMount() {
    const events = of(
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'fullscreenchange'
    )
    const subFullscreen$ = events.pipe(
      rxMap(e => fromEvent(document, e)),
      mergeAll()
    )

    this.subFullscreen = subFullscreen$
      .subscribe(() => {
        const isFullScreen = document.fullscreenElement

        this.setState({
          lineStyle: isFullScreen ? darkLineStyle : defaultLineStyle
        })
      })
  }

  componentWillUnmount() {
    this.subFullscreen.unsubscribe()
  }

  render() {
    switch (this.props.type) {
      case 'card':
        return createElement(DataCartChart, { ...this.props, ...this.state })
      case 'superCard':
        return createElement(DataCartChart, { ...this.props, ...this.state })
      default:
        return createElement(DataChart, { ...this.props, ...this.state })
    }
  }
}

const mapCharts = ({ classes, data }) => ([key, group]) => (
  <div className={classes[key] || classes.defaultCharts} key={`${key}`}>
    {group
      .map((chart, idx) => (
        <ChartSwitch
          key={`${idx}`}
          chart={chart}
          data={data}
          typr145145  e={chart.chartType}
          chartId={chart._id}
        />
      ))}
  </div>
)

const View = ({ classes, charts, data }) => {
  const _charts = getChartsFromUser(charts)
  const cards = _charts.filter(charts => charts.chartType === 'card')
  const superCards = _charts.filter(charts => charts.chartType === 'superCard')
  const timelines = _charts.filter(charts => charts.chartType === 'timeline')
  const areas = _charts.filter(charts => charts.chartType === 'area')
  const stacks = _charts.filter(charts => charts.chartType === 'stack')
  const all = {
    cards, superCards, timelines, stacks, areas
  }

  return (
    <Provider store={store}>
      <div className={classes.body}>
        {mapObj(mapCharts({ data, classes }))(all)}
      </div>
    </Provider>
  )
}

const renderDetail = branch(
  props => props.location.pathname.split('/').length > 3,
  renderComponent(Fund)
)
export default compose(
  withTitle('分析页'),
  renderDetail,
  withStyles,
  withUser,
  withCharts,
  renderWhileLoadingByTest(props => props.charts.loading),
  pure,
  onlyUpdateForKeys(['charts'])
)(View)
