import React from 'react'
import { Button, Drawer, Divider, Input, Form, Select } from 'antd'
import { useEventCallback } from 'rxjs-hooks'
import { map, pluck } from 'rxjs/operators'
import { compose } from 'recompose'
import { withCharts } from '@gql'
import { renderWhileLoadingByName, getChartsFromUser } from '@lib'
import { pickAll, map as rMap } from 'ramda/src'
import Submit from './submit'

import withStyles from './styles'

const beforeSubmit = source => data => {
  const newSource = source.map(card => {
    const layout = data.filter(i => i.i === card.i).pop()
    return { ...card, ...layout }
  })
  return rMap(pickAll(['i', 'w', 'h', 'x', 'y', '_id', 'chart']), newSource)
}
const FormItem = Form.Item
const Option = Select.Option

const chartTypeMap = type => {
  switch (type) {
    case 'superCard':
      return '复杂卡片'
    case 'area':
      return '面积图'
    case 'timeline':
      return '带时间轴的折线图'
    case 'stack':
      return '饼图'
    case 'chord':
      return '和弦图'
    default:
      return '卡片'
  }
}

const renderChart = (chart) => (
  <Option
    key={chart._id}
    value={`${chart._id}`}
  >
    {chart.title} - {chartTypeMap(chart.chartType)}
  </Option>
)

const DrawerComp = ({
  classes,
  charts,
  toggleSelectCard,
  selectedCards,
  subLayout,
  grid,
  _id
}) => {
  const [toggleVisible, visible] = useEventCallback(visible$ =>
    visible$.pipe(map(visible => !visible)), false)
  const [updateTitle, _title] = useEventCallback(title$ =>
    title$.pipe(pluck('target', 'value'), map(title => title)), grid.title)
  const [updateDescription, _description] = useEventCallback(description$ =>
    description$.pipe(pluck('target', 'value'), map(description => description)), grid.description)
  const _charts = getChartsFromUser(charts)
  const data = {
    _id,
    items: beforeSubmit(selectedCards)(subLayout),
    title: _title,
    description: _description
  }

  return (
    <div className={classes.drawer}>
      <Button size='large' icon='setting' type='primary' onClick={() => toggleVisible(visible)} />
      <Drawer
        width={300}
        title='我的模板'
        placement='right'
        closable={false}
        onClose={() => toggleVisible(visible)}
        visible={visible}
      >
        <FormItem label='标题'>
          <Input onChange={updateTitle} value={_title} />
        </FormItem>
        <FormItem label='说明'>
          <Input.TextArea onChange={updateDescription} value={_description} />
        </FormItem>
        <FormItem label='图表列表'>
          <Select
            showSearch
            style={{
              width: 200
            }}
            mode='multiple'
            value={[...selectedCards.map(i => i.chart._id)]}
            onChange={(vals) => {
              const _data = vals.map(v => ({
                chart: _charts.find(chart => chart._id === v)
              }))

              toggleSelectCard(_data)
            }}
          >
            {_charts.map(renderChart)}
          </Select>
        </FormItem>
        <Divider />
        <Submit data={data} />
      </Drawer>
    </div>
  )
}

export default compose(
  withStyles,
  withCharts,
  renderWhileLoadingByName('charts')
)(DrawerComp)
