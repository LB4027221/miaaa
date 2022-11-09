/* eslint-disable no-useless-constructor */
import React from 'react'
import { Card } from 'antd'
import { formatToYuan } from '@lib'
import { isEmpty } from 'ramda/src'

import {
  Chart,
  Geom,
  Axis,
  Legend,
  Coord,
  Label
} from 'bizcharts'
import numeral from 'numeral'
import withResizeObserverProps from '@hocs/with-resize-observer-props'

import WithSelect from './dataset'

// console.log(WithSelect)
class Stack extends WithSelect {
  // constructor(props) {
  //   super(props)
  // }
  render() {
    const { props } = this
    const chart = props.chart
    const conf = !isEmpty(chart) && chart.conf
      ? chart.conf
      : {}

    const state = {
      _id: !isEmpty(chart) && chart._id,
      title: !isEmpty(chart) && chart.title,
      item: !isEmpty(conf) && conf.item,
      percent: !isEmpty(conf) && conf.percent,
      aggregate: !isEmpty(conf) && conf.aggregate,
      itemFilter: !isEmpty(conf) && conf.itemFilter,
      options: !isEmpty(conf) ? conf.options : []
    }

    const dataSource = props.getChartData(props)
    const {
      item, percent
    } = state
    const scale = {}
    const __data = [...dataSource]
    const columns = __data.shift()
    state.columns = columns
    state.data = __data
    state.yAxis = [percent]
    state.xAxis = item
    this.required = state

    // console.log(this.required)
    this.createDataSource()

    console.log(this.dv, this.ds, this.total)
    if (!this.ds || !this.dv) {
      return (
        <div
          style={{
            width: '100%',
            height: 500
          }}
          ref={this.props.onRef}
        />
      )
    }


    return (
      <div
        style={{
          width: '100%',
          marginBottom: 20,
          height: '100%'
        }}
        ref={props.onRef}
      >
        {(item && percent) && (
          <Card
            title={props.chart.title}
            extra={this.actions(state.options || [])}
            bodyStyle={{
              padding: 0
            }}
          >
            <Chart
              data={this.dv}
              // forceFit
              width={props.containerWidth}
              scale={scale}
              padding={[10, 0, 10, -190]}
              height={props.containerHeight - 100}
            >
              <Coord type='theta' radius={0.75} />
              <Legend
                position='right'
                offsetY={-90}
                offsetX={-220}
                itemFormatter={(key) => {
                  if (this.dv.rows) {
                    const row = this.total.rows.filter(i => i[item] === key)
                    const p = this.dv.rows.filter(i => i[item] === key)

                    return row.length
                      ? `${key} | ${numeral(p[0].percent).format('0.0%')} | ${formatToYuan(percent, row[0].count)}`
                      : key
                  }
                  return key
                }}
                textStyle={{
                  fill: '#404040',
                  fontSize: '13'
                }}
              />
              <Axis name='percent' />
              <Geom
                type='intervalStack'
                position='percent'
                color={item}
                // tooltip={tooltipFormat}
              >
                <Label
                  content={item}
                  offset={-40}
                  textStyle={{
                    rotate: 0,
                    textAlign: 'center',
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 0, 0, .45)'
                  }}
                />
              </Geom>
            </Chart>
          </Card>
        )}
      </div>
    )
  }
}

export default withResizeObserverProps(({ width, height }) => ({
  containerWidth: width,
  containerHeight: height
}))(Stack)
