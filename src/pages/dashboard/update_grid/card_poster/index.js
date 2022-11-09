import React from 'react'
import cardPng from './card.png'
import timelinePng from './timeline.png'
import stackPng from './stack.png'

const imgs = {
  card: cardPng,
  timeline: timelinePng,
  stack: stackPng
}

const cardMap = chart => {
  switch (chart.chartType) {
    case 'superCard':
      return 'card'
    default:
      return chart.chartType
  }
}

export default ({ chart }) => (
  <img alt={chart.title} src={imgs[cardMap(chart)]} />
)
