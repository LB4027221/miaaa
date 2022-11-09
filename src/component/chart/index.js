import { createElement } from 'react'

import Card from './card'
import SuperCard from './super_card'
import Area from './area'
import Interval from './interval'
import Stack from './stack'
import Timeline from './timeline'
import Chord from './chord'

const ChartMap = (props) => {
  switch (props.type) {
    case 'area':
      return createElement(Area, props)
    case 'interval':
      return createElement(Interval, props)
    case 'stack':
      return createElement(Stack, props)
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

export const aggregates = [
  { type: 'count', title: '计数' },
  { type: 'sum', title: '求和' }
]


export default ChartMap
