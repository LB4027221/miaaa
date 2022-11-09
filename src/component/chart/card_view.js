/* eslint-disable */
import React, { Component } from 'react'
import { mapExcelData, formatToYuan } from '@lib'
import { Icon } from 'antd'
import { path, isEmpty } from 'ramda/src'
import { ChartCard, Field } from 'ant-design-pro/lib/Charts'
import { Link } from 'react-router-dom'
// import { isEmpty } from 'ramda/src'

const getId = path(['data', 'user', 'updateChart', 'data', '_id'])

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

  if (!data) {
    console.log('=======chart error==================')
    console.log(chart)
    console.log('====================================')
    return null
  }

  const {
    title, titleCol, bodyCol
  } = state
  const total = title
    ? state.data[titleCol] && state.data[titleCol].length > state.row
      ? formatToYuan(titleCol, state.data[titleCol][state.row])
      : null
    : null
  const footer = body
    ? state.data[bodyCol] && state.data[bodyCol].length > state.row
      ? formatToYuan(bodyCol, state.data[bodyCol][state.row])
      : null
    : null

  return (
    <div style={{ minWidth: 'calc(100vh/4.5)' }}>
      <ChartCard
        action={props.action}
        title={state.title}
        total={total}
        footer={state.body && <Field label={state.body} value={footer} />}
        contentHeight={46}
      />
    </div>
  )
}

export default Card
