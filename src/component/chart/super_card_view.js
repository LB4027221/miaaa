/* eslint-disable */
import React, { Component } from 'react'
import { mapExcelData, formatToYuan, mapCardData } from '@lib'
import MiniArea from '@component/mini_area'
import { Icon } from 'antd'
import { path, isEmpty, allPass, compose, prop, pathOr } from 'ramda/src'
import { ChartCard, Field } from 'ant-design-pro/lib/Charts'
import { Link } from 'react-router-dom'
import { branch, renderNothing } from 'recompose'
import { isNotEmpty, dotPathOr } from 'ramda-extension'
import moment from 'moment'

const getId = path(['data', 'user', 'updateChart', 'data', '_id'])
const getTotalData = dotPathOr('', 'rows.0.total')

const Card = (props) => {
  const { conf, chart } = props
  const body = !isEmpty(conf) ? conf.body : null
  const d = [...props.getChartData(props)]
  const cols = d.shift()
  const data = mapExcelData(d, cols)

  const state = {
    _id: !isEmpty(chart) && chart._id,
    title: !isEmpty(conf) && conf.title,
    titleCol: !isEmpty(conf) && conf.titleCol,
    bodyCol: !isEmpty(conf) && conf.bodyCol,
    body,
    data,
    row: !isEmpty(conf) ? conf.row : 0,
    chart: conf.chart
  }
  const {
    title, titleCol, bodyCol, bodyAggregate, titleAggregate, idxCol
  } = conf

  const totalData = mapCardData({
    columns: cols,
    item: titleCol,
    aggregate: titleAggregate,
    itemFilter: props.itemFilter,
    value: 'total'
  })(d)
  const bodyData = mapCardData({
    columns: cols,
    item: bodyCol,
    aggregate: bodyAggregate,
    itemFilter: props.itemFilter,
    value: 'total'
  })(d)
  const _visitData = mapCardData({
    columns: cols,
    item: titleCol,
    aggregate: titleAggregate,
    itemFilter: props.itemFilter,
    value: 'y',
    groupBy: [idxCol]
  })(d)

  const visitData = _visitData.rows.map(d => ({
    x: moment(d[idxCol]).format('YYYY-MM-DD'),
    y: d.y
  }))
  const total = formatToYuan(titleCol, getTotalData(totalData))
  const footer = formatToYuan(bodyCol, getTotalData(bodyData))
  const tooltip = [
    'x*y',
    (x, y) => ({
      name: x,
      value: formatToYuan(titleCol, y)
    })
  ]

  return (
    <div style={{ width: 260}}>
      <ChartCard
        action={props.action}
        title={state.title}
        total={total}
        footer={state.body && <Field label={state.body} value={footer} />}
        contentHeight={46}
      >
        <MiniArea
          line
          height={46}
          tooltip={tooltip}
          data={visitData}
        />
      </ChartCard>
    </div>
  )
}

const keys = [
  'body',
  'bodyCol',
  'bodyAggregate',
  'title',
  'titleCol',
  'titleAggregate',
  'idxCol'
]
const propKeyAndTest = key => compose(
  isNotEmpty,
  prop(key)
)
const allPassTest = allPass(keys.map(propKeyAndTest))
const propsTest = branch(
  props => !allPassTest(props.conf),
  renderNothing
)

export default propsTest(Card)
