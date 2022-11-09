import { splitEvery } from 'ramda/src'

const gridMap = (charts) => {
  const cards = charts.filter(card => card.cardType === 'card')
  const superCards = charts.filter(card => card.cardType === 'superCard')
  const timelines = charts.filter(card => card.cardType === 'timeline')
  const stacks = charts.filter(card => card.cardType === 'stack')

  splitEvery(4, cards)
    .map()
}

const mapCard = (card, idx) => `card${idx}`
const mapStack = (stack, idx) => `stack${idx} stack${idx}`
const mapTimeline = (timeline, idx) => `timeline${idx} timeline${idx} timeline${idx} timeline${idx}`

export default gridMap
