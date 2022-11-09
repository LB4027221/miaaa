import React, { createElement } from 'react'
import { Row, Col, InputNumber, Tabs, Button, message, Upload, Icon, Form, Card, Select, Switch } from 'antd'
import { withCreateExcel, withReport, withTpl, withBuildExcel, withUser, withSchedule } from '@gql'
import { compose, withProps } from 'recompose'
import mutate from '@lib/mutate'
import { initWsConf, renderWhileLoadingByTest, beforeSubmit } from '@lib'
import { connect } from 'react-redux'
import { path, pathOr, fromPairs, toPairs, filter, isEmpty } from 'ramda/src'

import store from '../store'
import Tools from './tools'

import Tpl from './tpl'

const TabPane = Tabs.TabPane
const { Dragger } = Upload
const FormItem = Form.Item
const { Option } = Select
const getClearSource = pathOr(true, ['clearSource'])

const filterEmpty = filter(i => i && !isEmpty(i))
const mapFilter = filter(i => i && !isEmpty(filter(_i => _i && filterEmpty(_i))(i)))

const makePanes = (reportId, tpl, workbook, tplFn, up) => workbook.map(ws => ({
  ...ws,
  content: createElement(Tpl, { up, worksheet: ws, tpl, tplFn, reportId })
}))

const openHref = ({
  url,
  filename
}) => {
  const link = document.createElement('a')
  link.download = filename
  link.href = url

  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false
  })

  link.dispatchEvent(clickEvent)
}

const uploadConfig = ({ user, report }) => ({
  name: 'file',
  multiple: true,
  action: '/upload',
  withCredentials: true,
  data: obj => ({ ...obj, userId: user._id, reportId: report._id }),
  onChange(info) {
    const status = info.file.status
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传文件成功`)
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传文件失败`)
    }
  }
})

const INTERVAL = {
  intervalValue: 1,
  intervalUnit: 'day'
}

const parseInterval = (inverval) => {
  const [intervalValue, intervalUnit] = inverval.split('*')

  return {
    intervalValue,
    intervalUnit
  }
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

class Demo extends React.Component {
  constructor(props) {
    super(props)
    const workbook = pathOr([], ['tpl', 'user', 'tpl', 'workbook'], props)
    const tpl = path(['tpl', 'user', 'tpl'], props)
    const schedule = path(['schedule', 'user', 'schedule'], props)

    const panes = makePanes(props.id, tpl, workbook, props.tpl, this.up)
    const interval = schedule && schedule.interval
      ? parseInterval(schedule.interval)
      : INTERVAL

    this.newTabIndex = 0
    this.state = {
      pageSize: schedule && schedule.pageSize ? schedule.pageSize : 50,
      ...interval,
      visible: false,
      newChild: false,
      linkChild: false,
      clearSource: getClearSource(schedule),
      activeKey: workbook.length ? workbook[0]._id : null,
      panes
    }
  }

  onChange = (activeKey) => {
    this.setState({ activeKey })
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  add = () => {
    this.showModal()
  }

  remove = (targetKey) => {
    let activeKey = this.state.activeKey
    let lastIndex
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const panes = this.state.panes.filter(pane => pane.key !== targetKey)
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key
    }
    this.setState({ panes, activeKey })
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = (e) => {
    console.log(e)
    this.setState({
      visible: false
    })
  }

  handleCancel = (e) => {
    console.log(e)
    this.setState({
      visible: false
    })
  }

  showChildrenDrawer = key => () => {
    this.setState({
      [key]: true
    })
  }

  onChildrenDrawerClose = key => () => {
    this.setState({
      [key]: false
    })
  }

  up = ({ conditions, ref }) => {
    const filter = conditions.map(i => ({
      ...i,
      columnName: ref.getColHeader(i.column)
    }))
    this.props.dispatch[ref.worksheet._id].onChange({ filter })
  }

  createExcel = () => {
    const variables = {
      arg: {
        title: '品类区分',
        data: [
          ['品类id', '品类名称', '业务组'],
          [68, '四季豆', '叶菜'],
          [74, '生菜', '叶菜'],
          [75, '上海青', '叶菜'],
          [79, '油麦菜', '叶菜']
        ]
      }
    }
    this.props.createExcelHoc.submit(variables)
  }

  setPageSize = pageSize => this.setState({ pageSize })
  setIntervalValue = intervalValue => this.setState({ intervalValue })
  setIntervalUnit = e => this.setState({ intervalUnit: e })
  setClearSource = clearSource => this.setState({ clearSource })

  componentWillReceiveProps(nextProps) {
    const workbook = pathOr([], ['tpl', 'user', 'tpl', 'workbook'], nextProps)
    const tpl = path(['tpl', 'user', 'tpl'], nextProps)
    const panes = makePanes(this.props.id, tpl, workbook, this.props.tpl, this.up)

    if (JSON.stringify(this.props.tpl.user.tpl.workbook)
      !== JSON.stringify(nextProps.tpl.user.tpl.workbook)) {
      this.setState({ panes })
    }
  }

  render() {
    const workbook = pathOr([], ['tpl', 'user', 'tpl', 'workbook'], this.props)

    workbook.forEach((ws) => {
      const reducer = initWsConf(ws)
      store.model(reducer)
    })

    store.dispatch({ type: '@@RESET' })

    return (
      <div>
        <br />
        <Card>
          <Tabs
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            // type='editable-card'
            onEdit={this.onEdit}
            tabPosition='left'
          >
            {this.state.panes.map(pane => (
              <TabPane tab={pane.name} key={pane._id} closable={false}>
                {pane.content}
              </TabPane>
            ))}
          </Tabs>
        </Card>
        <br />
        <Row gutter={16}>
          <Col span={24}>
            <Card title='数据源查询条件'>
              <FormItem
                label='组件'
                {...tailFormItemLayout}
                style={{ minWidth: 200 }}
              >
                {this.props.id && <Tools id={this.props.id} />}
              </FormItem>
              <FormItem label='最大数据条数' {...tailFormItemLayout}>
                <InputNumber value={this.state.pageSize} onChange={this.setPageSize} />
              </FormItem>
              <FormItem label='脚本更新周期' {...tailFormItemLayout}>
                <InputNumber value={this.state.intervalValue} onChange={this.setIntervalValue} />
                <Select
                  defaultValue={this.state.intervalUnit}
                  style={{ width: 200 }}
                  onChange={this.setIntervalUnit}
                >
                  <Option value='min'>分钟</Option>
                  <Option value='hour'>小时</Option>
                  <Option value='day'>天</Option>
                  <Option value='week'>周</Option>
                  <Option value='month'>月</Option>
                </Select>
              </FormItem>
              <FormItem label='不保留原数据' {...tailFormItemLayout}>
                <Switch
                  defaultChecked={this.state.clearSource}
                  onChange={this.setClearSource}
                />
              </FormItem>
              <Button
                type='primary'
                block
                loading={this.props.buildExcelHoc.loading}
                onClick={() => {
                  const variables = {
                    interval: `${this.state.intervalValue}*${this.state.intervalUnit}`,
                    current: this.props.current,
                    pageSize: this.state.pageSize,
                    components: beforeSubmit(this.props.componentsData),
                    reportId: this.props.id,
                    filename: `${this.props.tpl.user.tpl.filename}`,
                    conf: mapFilter(this.props.conf),
                    clearSource: this.state.clearSource
                  }
                  this.props.buildExcelHoc.submit(variables, () => this.props.tpl.refetch())
                }}
              >
                保存并更新数据
              </Button>
            </Card>
          </Col>
        </Row>
        <br />
        <Card title='操作模板'>
          <Dragger {...uploadConfig({ user: this.props.user, report: this.props.data.report })}>
            <p className='ant-upload-drag-icon'>
              <Icon type='inbox' />
            </p>
            <p className='ant-upload-text'>点击或拖拽文件到此处</p>
          </Dragger>
          <br />
          <Button
            type='primary'
            onClick={() => openHref({
              url: `/downloadTpl?q=${this.props.tpl.user.tpl.filename}`,
              filename: `${this.props.tpl.user.tpl.filename}`
            })}
          >
            下载模板
          </Button>
          <Button
            type='primary'
            style={{ marginLeft: 20 }}
            onClick={() => openHref({
              url: `/downloadData?q=${this.props.tpl.user.tpl.filename}`,
              filename: `${this.props.tpl.user.tpl.filename}`
            })}
          >
            下载数据
          </Button>
        </Card>
      </div>
    )
  }
}


const mapConf = fn => compose(
  fromPairs,
  filter(fn),
  toPairs
)

const mapState = state => ({
  id: state.id,
  columns: state.columns,
  visible: state.visible,
  current: state[state.id].current,
  __typename: state[state.id].__typename,
  pageSize: state.pageSize,
  components: state[state.id].submitComponents,
  componentsData: state[state.id].components
})

const mapConfFromState = (state, props) => {
  const tpl = pathOr([], ['tpl', 'user', 'tpl'], props)
  return {
    conf: mapConf(i => i[0].includes(tpl._id))(state)
  }
}

const mapDispatch = ({
  pageSize
}) => ({
  setPageSize: pageSize.onChange
})

export default compose(
  withUser,
  withProps(_props => ({ user: _props.data.user })),
  connect(mapState, mapDispatch),
  withReport,
  renderWhileLoadingByTest(props => props.data.loading),
  withProps(_props => ({ reportId: _props.data.report._id })),
  withTpl,
  renderWhileLoadingByTest(props => props.tpl.loading),
  withSchedule,
  renderWhileLoadingByTest(props => props.schedule.loading),
  withCreateExcel,
  mutate({ mutationName: 'createExcel', name: 'createExcelHoc' }),
  withBuildExcel,
  connect(mapConfFromState),
  mutate({ mutationName: 'buildExcel', name: 'buildExcelHoc' }),
  connect(null, x => x)
)(Demo)
