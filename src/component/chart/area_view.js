import React, { Component } from 'react'
import { Card, Radio } from 'antd'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from 'bizcharts'
import {
  isEmpty,
  pluck,
  compose,
  uniq,
  insert,
  memoizeWith
} from 'ramda/src'
import Slider from '@component/slider'
import mapChartData from '@lib/chart_data'
import { sampleTime } from 'rxjs/operators'
import { Subject } from 'rxjs'
import withResizeObserverProps from '@hocs/with-resize-observer-props'

const getOptMap = key => compose(
  uniq,
  pluck(key)
)

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const renderRadio = (data, onChange) => (opt, idx) => (
  <RadioGroup
    onChange={e => onChange(opt)(e.target.value)}
    key={`${idx}`}
    defaultValue='全部'
  >
    {insert(0, '全部', getOptMap(opt)(data))
      .map(val => (
        <RadioButton value={val} key={val}>{val}</RadioButton>
      ))}
  </RadioGroup>
)

const _mapChartData = memoizeWith(({ _id }) => _id, mapChartData)

class TimeLine extends Component {
  constructor(props) {
    super(props)
    const sub = new Subject()
      .pipe(sampleTime(300))
      .subscribe((obj) => {
        const { startText, endText } = obj
        this.ds.setState('start', startText)
        this.ds.setState('end', endText)
      })
    this.sub = sub
  }

  createDataSource = () => {
    if (this.xAxis && this.yAxis[0] && this.aggregate) {
      const { ds, dv } = _mapChartData({
        _id: this.props.chart._id || Date.now(),
        fields: this.yAxis,
        columns: this.columns,
        item: this.groupBy,
        aggregate: this.aggregate,
        itemFilter: this.itemFilter,
        col: this.col,
        val: this.val,
        groupBy: this.groupBy ? [this.groupBy, this.xAxis] : [this.xAxis],
        xAxis: this.xAxis,
        data: this._dataSource
      })

      this.ds = ds
      this.dv = dv
    }
  }

  onChange = (obj) => {
    this.sub.next(obj)
  }

  onChangeSelect = col => (val) => {
    this.ds.setState('col', col)
    this.ds.setState('val', val === '全部' ? [] : [val])
  }

  actions = (options) => {
    const rows = this.dv.rows

    return (
      <div>
        {options.map(renderRadio(rows, this.onChangeSelect))}
      </div>
    )
  }

  render() {
    const { props } = this
    const chart = props.chart
    const conf = !isEmpty(chart) && chart.conf
      ? chart.conf
      : {}
    const state = {
      _id: !isEmpty(chart) && chart._id,
      title: !isEmpty(chart) && chart.title,
      xAxis: !isEmpty(conf) && conf.xAxis,
      yAxis: !isEmpty(conf) ? conf.yAxis : [null],
      aggregate: !isEmpty(conf) && conf.aggregate,
      groupBy: !isEmpty(conf) && conf.groupBy,
      itemFilter: !isEmpty(conf) ? conf.itemFilter : '',
      options: !isEmpty(conf) ? conf.options : []
    }

    const {
      aggregate,
      groupBy,
      itemFilter
    } = state
    const _dataSource = [...props.getChartData(props)]
    const columns = _dataSource.shift()
    const { xAxis, yAxis = [null] } = state

    this._dataSource = _dataSource
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.aggregate = aggregate
    this.itemFilter = itemFilter
    this.columns = columns
    this.groupBy = groupBy

    const timeScale = {
      [`${xAxis}`]: {
        type: 'timeCat',
        mask: 'YYYY.MM.DD',
        tickInterval: 60 * 60 * 1000 * 24
      }
    }

    if (!xAxis || !yAxis[0]) {
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
    this.createDataSource()

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

    // console.log(this.props.containerHeight)

    return (
      <div
        style={{
          width: '100%',
          height: '100%'
        }}
        ref={this.props.onRef}
      >
        <Card
          title={props.chart.title}
          // extra={props.action}
          extra={this.actions(state.options)}
        >
          <Chart
            ref={ref => this.chart = ref}
            data={this.dv}
            scale={timeScale}
            width={this.props.containerWidth - 64}
            height={this.props.containerHeight - 130}
            // forceFit
          >
            <Axis name={xAxis} />
            <Axis name='yAxis' grid={{ lineStyle: this.props.lineStyle }} />
            <Legend />
            <Tooltip
              crosshairs={{
                type: 'y'
              }}
            />
            <Geom
              type='lineStack'
              position={`${xAxis}*yAxis`}
              size={2}
              color={[groupBy || 'color']}
              // color={groupBy}
              // shape='smooth'
            />
            <Geom
              type='areaStack'
              position={`${xAxis}*yAxis`}
              // size={4}
              // shape='circle'
              // color={groupBy}
              color={[groupBy || 'color']}

              // color={[groupBy || 'color', ['#8AD5E2', '#9BABFF']]}
              // style={{
              //   stroke: '#fff',
              //   lineWidth: 1
              // }}
            />
          </Chart>
        </Card>
      </div>
    )
  }
}

export default withResizeObserverProps(({ width, height }) => ({
  containerWidth: width,
  containerHeight: height
}))(TimeLine)
