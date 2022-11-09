import React from 'react'
import { Form, Button, Select, Input } from 'antd'
import { useEventCallback } from 'rxjs-hooks'
import { pathOr } from 'ramda/src'
import { map, pluck } from 'rxjs/operators'
import { compose } from 'recompose'
import { withUpdateChart, withRemoveChart } from '@gql'
import mutate from '@lib/mutate'

const FormItem = Form.Item
const { Option } = Select

export const getId = pathOr(null, ['chart', '_id'])
export const getTitle = pathOr(null, ['chart', 'title'])
export const getTarget = pathOr(null, ['chart', 'conf', 'target'])
export const getSource = pathOr(null, ['chart', 'conf', 'source'])

const makeSelectState = initState => useEventCallback(
  state$ => state$.pipe(map(val$ => val$)),
  initState[0]
)
const makeInputState = initState => useEventCallback(
  state$ => state$.pipe(map(val$ => val$), pluck('target', 'value')),
  initState[0]
)
const makeSelectStates = stateMap =>
  stateMap.map(state => {
    const [...a] = makeSelectState(state)
    return a
  })

const mapFormItems = cols => (item, idx) => (
  <FormItem label={item.label} key={`${idx}`}>
    <Select
      showSearch
      allowClear
      style={{ width: '100%' }}
      value={item.val}
      onChange={item.handler}
    >
      {cols.map((column, _idx) => (<Option key={`${_idx}`} value={column}>{column}</Option>))}
    </Select>
  </FormItem>
)

const Chord = (props) => {
  const { cols } = props
  const initStateMap = [
    [getTarget(props)],
    [getSource(props)]
  ]
  const [
    [targetHandler, target],
    [sourceHandler, source]
  ] = makeSelectStates(initStateMap)

  const forms = [
    { val: source, handler: sourceHandler, label: '边起点' },
    { val: target, handler: targetHandler, label: '边终点' }
  ]
  const [titleHandler, title] = makeInputState([getTitle(props)])

  const _id = getId(props)

  const submit = () => {
    const variables = {
      tplId: props.tpl._id,
      worksheet: props.worksheet.name,
      reportId: props.reportId,
      conf: {
        _id,
        chartType: 'chord',
        title,
        conf: {
          source,
          target
        }
      }
    }
    props.updateChartHoc.submit(variables)
  }

  const del = () => {
    const variables = {
      chartId: _id
    }
    props.removeChartHoc.submit(variables, () => props.tplFn.refetch())
  }

  return (
    <div style={{ position: 'relative' }}>
      <FormItem label='标题'>
        <Input onChange={titleHandler} value={title} />
      </FormItem>
      {forms.map(mapFormItems(cols))}
      <div
        style={{
          width: 1000,
          height: 1000,
          position: 'absolute',
          right: -1000,
          top: -57 - 24 - 32
        }}
      >
        {props.preview({
          chart: {
            data: {
              data: [props.cols, ...props.dataSource]
            },
            tplId: props.tpl._id,
            worksheet: props.worksheet.name,
            reportId: props.reportId,
            // _id: state._id,
            chartType: 'chord',
            // title: state.title,
            conf: {
              title,
              target,
              source
              // xAxis: state.xAxis,
              // yAxis: state.yAxis,
              // aggregate: state.aggregate,
              // itemFilter: state.itemFilter,
              // groupBy: state.groupBy,
              // options: options.filter(i => i)
            }
          },
          type: props.type,
          dataSource: [props.cols, ...props.dataSource]
        })}
      </div>
      <br />
      <br />
      <Button
        type='primary'
        onClick={submit}
        loading={props.updateChartHoc.loading}
      >
        保存
      </Button>
      {_id && (
      <Button
        style={{ marginLeft: 15 }}
        type='danger'
        onClick={del}
        loading={props.removeChartHoc.loading}
      >
        删除
      </Button>)}
    </div>
  )
}

export default compose(
  withUpdateChart,
  mutate({
    mutationName: 'updateChart',
    name: 'updateChartHoc',
    path: 'data.user.updateChart'
  }),
  withRemoveChart
)(Chord)
