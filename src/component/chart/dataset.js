// import { compose, withProps, renderNothing, branch } from 'recompose'
import React, { Component } from 'react'
import {
  pluck,
  compose as Recompose,
  uniq,
  insert,
  memoizeWith
} from 'ramda/src'
import { sampleTime } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { Radio, Select } from 'antd'

const getOptMap = key => Recompose(
  uniq,
  pluck(key)
)

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const renderRadio = (data, onChange) => (optKey, idx) => {
  const values = insert(0, '全部', getOptMap(optKey)(data))
  if (values.length > 3) {
    return (
      <Select
        key={idx}
        onChange={value => onChange(optKey)(value)}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        // mode='multiple'
        defaultValue='全部'
        style={{ marginLeft: 10, minWidth: 100 }}
      >
        {values.map(val => (
          <Select.Option value={val} key={val}>{val}</Select.Option>
        ))}
      </Select>
    )
  }
  return (
    <RadioGroup
      key={idx}
      onChange={e => onChange(optKey)(e.target.value)}
      // eslint-disable-next-line react/jsx-no-duplicate-props
      key={`${idx}`}
      style={{ marginLeft: 10, minWidth: 100 }}
      defaultValue='全部'
    >
      {insert(0, '全部', getOptMap(optKey)(data))
        .map(val => (
          <RadioButton value={val} key={val}>{val}</RadioButton>
        ))}
    </RadioGroup>
  )
}

const _mapChartData = mapChartData => memoizeWith(({ _id }) => _id, mapChartData)

class WithSelect extends Component {
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
    if (this.required.xAxis && this.required.yAxis[0] && this.required.aggregate) {
      const { ds, dv, total } = _mapChartData(this.props.mapChartData)({
        _id: this.props.chart._id || Date.now(),
        fields: this.required.yAxis,
        // columns: this.required.columns,
        item: this.required.groupBy,
        // aggregate: this.required.aggregate,
        // itemFilter: this.required.itemFilter,
        // col: this.required.col,
        // val: this.required.val,
        groupBy: this.required.groupBy
          ? [this.required.groupBy, this.required.xAxis]
          : [this.required.xAxis],
        // xAxis: this.required.xAxis,
        // data: this.required._dataSource
        ...this.required
      })

      this.ds = ds
      this.dv = dv
      this.total = total
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
        {options && options
          .filter(i => i)
          .map(renderRadio(rows, this.onChangeSelect))}
      </div>
    )
  }
}

export default WithSelect
