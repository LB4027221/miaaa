import React, { Fragment } from 'react'
import { compose } from 'recompose'
import { Select, Form, DatePicker, Button } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import { StreamProps, plan, scanPlans } from 'react-streams'
import { map } from 'rxjs/operators'
import { withUpdateExcel } from '@gql'

import withStyles from '../styles'

const { Option } = Select
const FormItem = Form.Item
const { RangePicker } = DatePicker

const dateFormat = 'YYYY/MM/DD'
const mapDate = range =>
  [moment(range[0]).format(dateFormat), moment(range[1]).format(dateFormat)]

const setMode = plan(map(mode => ({ mode })))
const sysDateMap = ['近一周', '近一月', '上周', '上月', '本周', '本月', '昨日', '今日']

const formItemLayout = {
  // labelCol: {
  //   xs: { span: 24 },
  //   sm: { span: 8 }
  // },
  // wrapperCol: {
  //   xs: { span: 24 },
  //   sm: { span: 16 }
  // }
}

const toNumber = val => {
  if (val === null || val === Boolean) {
    return val
  }
  const r = Number(val)

  return Number.isNaN(r)
    ? val
    : r
}

const tailFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16
    }
  }
}

const Index = ({
  dataSource,
  onChange,
  index,
  style
}) => (
  <Select
    allowClear
    placeholder='设置日期索引'
    style={style}
    defaultValue={index}
    onChange={val => onChange({ index: val })}
  >
    {dataSource.map(d => (
      <Option value={d} key={d}>
        {d}
      </Option>
    ))}
  </Select>
)

const SetDate = props => (
  <StreamProps
    mode={props.dateRange && (typeof props.dateRange === 'string') ? 'auto' : 'manual'}
    pipe={scanPlans({ setMode })}
  >
    {({ mode, setMode }) => <DateFrom {...props} mode={mode} setMode={setMode} />}
  </StreamProps>
)

const DateFrom = (props) => {
  const { mode, setMode } = props
  return (
    <Fragment>
      <Select
        allowClear
        style={{ width: 100 }}
        defaultValue={mode}
        onChange={setMode}
      >
        <Option value='manual'>指定日期</Option>
        <Option value='auto'>系统预设</Option>
      </Select>
      {mode === 'manual' && <TimeHandler {...props} />}
      {mode !== 'manual' && <SeletBySys {...props} />}
    </Fragment>
  )
}

const SeletBySys = ({
  dateRange,
  onChange
}) => (
  <Select
    style={{ width: 100 }}
    defaultValue={dateRange}
    allowClear
    onChange={val => onChange({ dateRange: val })}
  >
    {sysDateMap.map(d => (<Option value={d} key={d}>{d}</Option>))}
  </Select>
)

const TimeHandler = ({
  dateRange,
  onChange
}) => (
  <RangePicker
    format={dateFormat}
    defaultValue={(dateRange && dateRange.length)
      ? [moment(dateRange[0], dateFormat), moment(dateRange[1], dateFormat)]
      : null
    }
    onChange={(m, range) => onChange({ dateRange: mapDate(range) })}
  />
)

const Conf = ({
  classes,
  onChange,
  timeHandler,
  dateRange,
  unique,
  dataSource,
  index,
  updateExcelHoc,
  tpl,
  ws,
  hot
}) => (
  <div className={classes.conf}>
    <Form {...formItemLayout}>
      <FormItem label='日期控制器' {...tailFormItemLayout}>
        <Fragment>
          <Select
            allowClear
            style={{ width: 200, marginRight: 20 }}
            defaultValue={timeHandler}
            placeholder='时间控制'
            onChange={timeHandler => onChange({ timeHandler })}
          >
            <Option value='fitlerByTime'>
              过滤日期范围
            </Option>
            <Option value='insertTime'>
              插入日期范围列
            </Option>
          </Select>
          <br />
          {timeHandler && <Index
            style={{ width: 200 }}
            dataSource={dataSource}
            index={index}
            onChange={onChange}
          />}
          <br />
          {timeHandler && <SetDate
            timeHandler={timeHandler}
            dateRange={dateRange}
            onChange={onChange}
          />}
        </Fragment>
      </FormItem>
      <FormItem label='去重控制' {...tailFormItemLayout}>
        <Select
          mode='multiple'
          placeholder='去重的 key'
          style={{ width: 200 }}
          defaultValue={unique || []}
          onChange={unique => onChange({ unique })}
        >
          {dataSource.map(d => (
            <Option value={d} key={d}>
              {d}
            </Option>
          ))}
        </Select>
      </FormItem>
      <FormItem label='同步至模板' {...tailFormItemLayout}>
        <Button
          loading={updateExcelHoc.loading}
          type='danger'
          onClick={() => {
            const cols = hot().hotInstance.worksheet.data[0]
            const data = hot().hotInstance.getData()
            const variables = {
              filename: tpl.filename,
              ws: ws.name,
              data: [cols, ...data].map(col => col.map(toNumber))
            }
            updateExcelHoc.submit(variables)
          }}
        >
          同步
        </Button>
      </FormItem>
    </Form>
  </div>
)

const mapState = (state, ownProps) => ({
  timeHandler: state[ownProps.ws._id].timeHandler,
  dateRange: state[ownProps.ws._id].dateRange,
  unique: state[ownProps.ws._id].unique,
  index: state[ownProps.ws._id].index
})

const mapDispatch = (dispatch, ownProps) => ({
  onChange: dispatch[ownProps.ws._id].onChange
})

export default compose(
  withStyles,
  connect(mapState, mapDispatch),
  withUpdateExcel
)(Conf)
