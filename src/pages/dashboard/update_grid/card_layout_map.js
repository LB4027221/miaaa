import React from 'react'
import withUser from '@gql'
import { dissoc } from 'ramda/src'
import { compose, pure, onlyUpdateForKeys } from 'recompose'
import { ChartSwitch } from '../analysis'

export const cardLayoutMap = (gridItem, idx) => {
  if (gridItem._id) {
    return { ...gridItem }
  }
  switch (gridItem.chart.chartType) {
    case 'superCard':
      return {
        i: gridItem.chart._id,
        x: 0,
        y: idx,
        w: 1,
        h: 10,
        key: gridItem.chart._id,
        chart: gridItem.chart
      }
    case 'card':
      return {
        i: gridItem.chart._id,
        x: 0,
        y: idx,
        w: 1,
        h: 7.5,
        key: gridItem.chart._id,
        chart: gridItem.chart
      }
    case 'timeline':
      return {
        i: gridItem.chart._id,
        x: 0,
        y: idx,
        w: 4,
        h: 26,
        key: gridItem.chart._id,
        chart: gridItem.chart
      }
    default:
      return {
        i: gridItem.chart._id,
        x: 0,
        y: idx,
        w: 2,
        h: 23,
        key: gridItem.chart._id,
        chart: gridItem.chart
      }
  }
}

const WithUserChart = compose(
  onlyUpdateForKeys([]),
  pure,
  withUser
)(ChartSwitch)

const cardMap = gridItem => (
  <div key={gridItem.i} style={{ width: '100%', height: '100%' }}>
    <WithUserChart
      chart={gridItem.chart}
      type={gridItem.chart.chartType}
      chartId={gridItem.chart._id}
      onlyPreview
    />
  </div>
)

export default cardMap
