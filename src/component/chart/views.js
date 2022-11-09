import { createElement } from 'react'
import { isEmpty, path } from 'ramda/src'
import { compose, withProps, renderNothing, branch } from 'recompose'
import { mapStackData } from '@lib'

import Card from './card_view'
import Area from './area_view'
import Interval from './interval_view'
import Stack from './stack_view'
import Timeline from './timeline_view'
import SuperCard from './super_card_view'
import Chord from './chord_view'

const ChartMap = (props) => {
  switch (props.type) {
    case 'area':
      return createElement(Area, props)
    case 'interval':
      return createElement(Interval, props)
    case 'stack':
      return createElement(Stack, { ...props, mapChartData: mapStackData })
    case 'card':
      return createElement(Card, props)
    case 'timeline':
      return createElement(Timeline, props)
    case 'superCard':
      return createElement(SuperCard, props)
    case 'chord':
      return createElement(Chord, props)

    default:
      return null
  }
}

const withConf = withProps(props => ({
  conf: path(['chart', 'conf'], props)
}))
const renderNothingWhileNoConf = branch(
  props => isEmpty(props.conf),
  renderNothing
)

export default compose(
  withConf,
  renderNothingWhileNoConf
)(ChartMap)
