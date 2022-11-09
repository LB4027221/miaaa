import React from 'react'
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts'
import DataSet from '@antv/data-set'
import Slider from 'bizcharts-plugin-slider'
import autoHeight from '@lib/auto_height'

const TimelineChart = (props) => {
  const {
    title,
    height = 400,
    padding = [60, 20, 40, 40],
    titleMap = {
      y1: 'y1',
      y2: 'y2'
    },
    borderWidth = 2,
    data: sourceData
  } = props

  const data = Array.isArray(sourceData) ? sourceData : [{ x: 0, y1: 0, y2: 0 }]

  data.sort((a, b) => a.x - b.x)

  let max
  if (data[0] && data[0].y1 && data[0].y2) {
    max = Math.max(
      [...data].sort((a, b) => b.y1 - a.y1)[0].y1,
      [...data].sort((a, b) => b.y2 - a.y2)[0].y2
    )
  }

  const ds = new DataSet({
    state: {
      start: data[0].x,
      end: data[data.length - 1].x
    }
  })

  const dv = ds.createView()
  dv.source(data)
    .transform({
      type: 'filter',
      callback: (obj) => {
        const date = obj.x
        return date <= ds.state.end && date >= ds.state.start
      }
    })
    .transform({
      type: 'map',
      callback(row) {
        const newRow = { ...row }
        newRow[titleMap.y1] = row.y1
        newRow[titleMap.y2] = row.y2
        return newRow
      }
    })
    .transform({
      type: 'fold',
      fields: [titleMap.y1, titleMap.y2], // 展开字段集
      key: 'key', // key字段
      value: 'value'
    })

  // const timeScale = {
  //   type: 'time',
  //   mask: 'MM-DD'
  // }

  // const cols = {
  //   x: timeScale
  // }

  // console.log('====================================')
  // console.log(ds)
  // console.log('====================================')

  const SliderGen = () => (
    <Slider
      padding={[0, padding[1] + 20, 0, padding[3]]}
      width='auto'
      height={26}
      xAxis='x'
      yAxis='y1'
      // scales={{ x: timeScale }}
      data={data}
      start={ds.state.start}
      end={ds.state.end}
      backgroundChart={{ type: 'line' }}
      onChange={(props) => {
        const { startText, endText } = props

        ds.setState('start', startText)
        ds.setState('end', endText)
      }}
    />
  )

  return (
    <div style={{ height: height + 30, background: '#fff' }}>
      <div>
        {title && <h4>{title}</h4>}
        <Chart height={height} padding={padding} data={dv}>
          <Axis name='x' />
          <Tooltip />
          <Legend name='key' position='top' />
          <Geom type='line' position='x*value' size={borderWidth} color='key' />
        </Chart>
        <div style={{ marginRight: -20 }}>
          <SliderGen />
        </div>
      </div>
    </div>
  )
}

export default autoHeight(TimelineChart)
