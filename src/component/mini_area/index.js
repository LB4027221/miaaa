import React from 'react'
import { Chart, Axis, Tooltip, Geom } from 'bizcharts'
import autoHeight from '@lib/auto_height'
import { compose } from 'recompose'
import withStyles from './styles'

const MiniArea = (props) => {
  const {
    height,
    data = [],
    forceFit = true,
    color = 'rgba(24, 144, 255, 0.2)',
    borderColor = '#1089ff',
    scale = {},
    borderWidth = 2,
    line,
    xAxis,
    yAxis,
    classes,
    animate = true
  } = props

  const padding = [36, 5, 30, 5]

  const scaleProps = {
    x: {
      type: 'cat',
      range: [0, 1],
      ...scale.x
    },
    y: {
      min: 0,
      ...scale.y
    }
  }

  const tooltip = props.tooltip || [
    'x*y',
    (x, y) => ({
      name: x,
      value: y
    })
  ]

  const chartHeight = height + 54

  return (
    <div className={classes.miniChart} style={{ height }}>
      <div className={classes.chartContent}>
        {height > 0 && (
          <Chart
            animate={animate}
            scale={scaleProps}
            height={46}
            forceFit={forceFit}
            data={data}
            padding={padding}
          >
            <Axis
              key='axis-x'
              name='x'
              label={false}
              line={false}
              tickLine={false}
              grid={false}
              {...xAxis}
            />
            <Axis
              key='axis-y'
              name='y'
              label={false}
              line={false}
              tickLine={false}
              grid={false}
              {...yAxis}
            />
            <Tooltip showTitle={false} crosshairs={false} />
            <Geom
              type='area'
              position='x*y'
              color={color}
              tooltip={tooltip}
              shape='smooth'
              style={{
                fillOpacity: 1
              }}
            />
            {line ? (
              <Geom
                type='line'
                position='x*y'
                shape='smooth'
                color={borderColor}
                size={borderWidth}
                tooltip={false}
              />
            ) : (
              <span style={{ display: 'none' }} />
            )}
          </Chart>
        )}
      </div>
    </div>
  )
}

export default compose(
  withStyles,
  autoHeight
)(MiniArea)
