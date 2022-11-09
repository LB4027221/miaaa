import React, { Component } from 'react'
import {
  Button,
  message,
  Modal
} from 'antd'
import R from 'ramda/src'

import axios from 'axios'
import 'moment/locale/zh-cn'
import { connect } from 'react-redux'

import '../styles/createNewReport.sass'
// import { initEditedReport, setTargets } from '../store'
import SelectJoin from './joins/select_join'
import Join from './joins/render_join'
import Meta from './meta'
import GroupBy from './groupBy/render_groupBy'
// import GroupByComponent from './groupBy/group_by_component'
import SelectWhere from './where'
import ReportName from './report_name'
// import RegionComponent from './service_component/region'
import Limit from './limit'
import OrderBy from './orderBy'
import SQL from './SQL/'
import UsedOn from './used_on'
import Tags from './tags'
import IsRealTime from './is_real_time'
// import RestApi from './rest_api'
import Alias from './alias'
import Child from './child'
// import Friend from './friend'
import TabBrothers from './tab_brothers/'
import Sort from './sort'
import Having from './having'
// import Scomp from './scomp'
import withEditReport from '../gql/mutation'
import { componentTemplate } from '../util'

const isTabType = ({ tags }) => tags.includes('detailTab')
class EditReport extends Component {
  state = {
    modalBody: '',
    visible: false
  }

  async componentDidMount() {
    const { params: { reportId } } = this.props.match
    // let report = await this.props.dispatch(initEditedReport(reportId))
    await this.props.dispatch.editReport.initEditedReportAsync(reportId)
    let report = this.props.report
    const title = document.querySelector('title')
    title.innerHTML = `加工报表-${report.cname}`

    const { targets } = report
    if (targets.length) {
      await this.props.dispatch.treeData.setTreeDataSync(report.targets)
      this.props.dispatch.targets.setTargets(report.targets)
    }
    this.props.dispatch.metaList.initMetalist(report.metaList)
    this.props.dispatch.where.initWhere(report.where)
    // this.props.dispatch.having.initWhere(report.having)
  }

  async componentWillReceiveProps(nextProps) {
    const { targets } = nextProps

    if (targets.length && JSON.stringify(this.props.targets) !== JSON.stringify(targets)) {
      await nextProps.dispatch.treeData.setTreeDataSync(targets)
      nextProps.dispatch.targets.setTargets(targets)
    }
  }

  saveReport = async () => {
    const { params: { reportId } } = this.props.match
    let {
      report,
      metaList,
      joins,
      where,
      groupBy,
      orderBy,
      targets,
      mutate,
      having
    } = this.props
    joins = R.filter(item =>
      item.leftTarget &&
      item.leftColumn &&
      item.rightColumn &&
      item.rightTarget)(joins)
    orderBy = R.filter(item =>
      item.column)(orderBy)

    report.joins = joins
    report.components = where
    report.groupBy = groupBy
    report.having = having
    report.targets = targets
    report.orderBy = orderBy
    let reports = report.reports
    report.reports = 'fuck'
    report.report = 'the'
    report.databases = 'schema'
    report.metaList = metaList
    // const { data: { success, msg } } = await axios.put(`/report/${reportId}`, body)
    const res = await mutate({
      variables: {
        _id: reportId,
        data: {
          ...report
        }
      }
    })
    report.reports = reports
    // if (!success) return message.error(msg)

    // eslint-disable-next-line
    if (!res.data.user.editReport.success) return message.error(res.data.user.editReport.errorMessage)
    message.success('更新成功')
  }

  preview = () => {
    const { params: { reportId } } = this.props.match

    window.open(`/#/report/${reportId}`)
  }

  copy = async () => {
    const toCopy = window.confirm('确定复制吗')

    if (toCopy) {
      const { params: { reportId } } = this.props.match

      const { data } = await axios.get('/report/copy', {
        params: {
          reportId
        }
      })
      const { body, success } = data

      if (!success) return message.error('复制出错了')

      message.info('复制完成')

      const timeout = 1.5 * 1000

      setTimeout(() => {
        window.open(`/#/requirement/machiningList/machiningView/${body._id}`)
      }, timeout)
    }
  }

  showModal = () => this.setState({ visible: true })
  handleOk = e => this.setState({ visible: false })
  handleCancel = e => this.setState({ visible: false })

  addMetaChild = child => () => {
    const modalBody = child()

    this.setState({ modalBody, visible: true })
  }

  render() {
    return (
      <div className='edit-wrap'>
        <div className='app-content'>
          <Modal
            title='Basic Modal'
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            {this.state.modalBody}
          </Modal>
          <section className='form'>
            <div className='title'>备注</div>
            <div className='remarks'>{this.props.report.remarks || ''}</div>
          </section>
          <section className='form'>
            <div className='title'>报表名称</div>
            <ReportName />
          </section>
          <section className='form'>
            <div className='title'>报表别名(app默认显示报表别名)</div>
            <Alias />
          </section>
          <section className='form'>
            <div className='title'>应用范围(默认在报表平台上展示)</div>
            <UsedOn />
          </section>
          <section className='form'>
            <div className='title'>实时数据 or 离线数据</div>
            <IsRealTime />
          </section>
          <section className='form'>
            <div className='title'>报表类型（影响在 APP 端的展现形式）</div>
            <Tags />
          </section>
          {this.props.report.tags && isTabType(this.props.report) &&
            <section className='form'>
              <div className='title'>Tab 上的报表</div>
              <TabBrothers />
            </section>
          }
          {/* <section className='form'>
            <div className='title'>实时数据 API </div>
            <RestApi />
          </section> */}
          <br />
          <br />
          <br />
          <section className='form'>
            <div className='title'>JOIN</div>
            <SelectJoin />
            {this.props.joins.map((item, index) => (<Join
              item={item}
              index={index}
              key={`${index}`}
            />))}
          </section>
          <section className='form'>
            <div className='title'>GroupBy</div>
            <GroupBy />
          </section>
          <section className='form'>
            <div className='title'>报表字段</div>
            {this.props.metaList && this.props.metaList.map((item, index) =>
              (<Meta
                index={index}
                key={item.key}
                item={item}
                addMetaChild={this.addMetaChild}
              />))
            }
          </section>
          <section className='form'>
            <div className='title'>查询条件</div>
            {this.props.where.map((item, index) => (
              <SelectWhere item={item} index={index} key={item.key} />
            ))}
          </section>
          {/* <section className='form'>
            <div className='title'>微服务组件</div>
            <RegionComponent />
          </section> */}
          <section className='form'>
            <div className='title'>LIMIT</div>
            <Limit />
          </section>
          <section className='form'>
            <div className='title'>OrderBy</div>
            {this.props.orderBy && this.props.orderBy.map((item, index) => (
              <OrderBy item={item} index={index} key={item.key} />
            ))}
          </section>
          <section className='form'>
            <div className='title'>HAVING</div>
            {this.props.having.map((item, index) => (
              <Having item={item} index={index} key={item.key} />
            ))}
          </section>
          {/* <section className='form'>
            <div className='title'>GroupBy 组件</div>
            {this.props.report.groupByComponents && this.props.report.groupByComponents.map((item, index) => (
              <GroupByComponent item={item} index={index} key={index} />
            ))}
          </section> */}
          <section className='form'>
            <div className='title'>子报表</div>
            <Child />
          </section>
          {/* <section className='form'>
            <div className='title'>离线或实时报表ID</div>
            <Friend />
          </section> */}
          <section className='form'>
            <div className='title'>排序序号</div>
            <Sort />
          </section>
          {/* <section className='form'>
            <div className='title'>业务组件（Beta, 销售服务站）</div>
            <Scomp />
          </section> */}
          {this.props.report.targets && <section className='form'>
            <div className='title'>SQL</div>
            <div className='form-item'>
              <SQL />
            </div>
            <Button type='primary' onClick={this.saveReport}>生成报表</Button>
            <Button style={{ marginLeft: 10 }} onClick={this.preview}>查看</Button>
            <Button style={{ float: 'right' }} onClick={this.copy}>复制报表</Button>
          </section>}
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return ({
    report: state.editReport,
    treeData: state.treeData,
    targets: state.targets,
    metaList: state.metaList,
    where: state.where,
    orderBy: state.orderBy,
    having: state.having,
    joins: state.join,
    groupBy: state.groupBy || []
  })
}
export default connect(mapState)(withEditReport(EditReport))
