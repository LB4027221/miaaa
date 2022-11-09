import React, { Component } from 'react'
import {
  Select,
  Cascader,
  Input
} from 'antd'
import { connect } from 'react-redux'
import R from 'ramda/src'
import { converTarget } from '../../util'
// import { setReport, setTargets } from '../../action'
// import { bindActionCreators } from 'redux'
// import PropTypes from 'prop-types'
// import { bindActionCreators } from 'redux'
// import * as action from '../../action'

const { Option } = Select

// const resolver = (fieldName, root) => root[fieldName]

class ReportName extends Component {
  state = {
    manual: 'auto'
  }

  componentWillReceiveProps(nextProps) {
    const { report } = nextProps
    const { database, table } = report

    this.setState({
      manual: !database && table ? 'manual' : 'auto'
    })
  }

  _toggleManual = (manual) => {
    if (manual === 'manual') {
      const report = { ...this.props.report, database: '' }
      this.props.dispatch.editReport.setReport({ ...report })
    } else {
      const report = { ...this.props.report, database: null, table: null }
      this.props.dispatch.editReport.setReport({ ...report })
    }
  }

  render() {
    let {
      report, targets, database, treeData, dispatch
    } = this.props

    let value = R.find(R.propEq('alias', 'a'))(targets)
    value = value
      ? R.props(['database', 'table'])(value)
      : []

    return (
      <div className='form-item'>
        <Input
          placeholder='报表中文名'
          className='table-name'
          onChange={({ target }) => {
            // dispatch(setReport({ ...report, cname: target.value }))
            dispatch.editReport.setReport({ ...report, cname: target.value })
          }}
          value={report.cname}
        />
        <Select
          value={this.state.manual}
          onChange={this._toggleManual}
        >
          <Option value='auto'>选项</Option>
          <Option value='manual'>自定义</Option>
        </Select>
        {this.state.manual === 'auto' && <Cascader
          showSearch
          placeholder='报表英文名'
          options={database}
          value={value}
          style={{ width: 328 }}
          onChange={(value) => {
            targets = []
            value = R.zipObj(['database', 'table'])(value)
            let t = converTarget(targets)(value)

            targets.push(t)
            targets = [...targets]
            value.target = t.key
            value.name = value.table
            report = { ...report, ...value }
            // dispatch(setTargets(targets))
            dispatch.targets.setTargets(targets)
            // dispatch(setReport(report))
            dispatch.editReport.setReport({ ...report })
          }}
        />}
        {this.state.manual === 'manual' && <Input.TextArea
          placeholder='报表英文名'
          autosize
          value={value.length && value[1]}
          style={{ width: 328 }}
          onChange={(e) => {
            targets = []
            let value = {
              table: `${e.target.value}`,
              database: ''
            }

            let t = converTarget(targets)(value)

            targets.push(t)
            targets = [...targets]
            value.target = t.key
            value.name = value.table
            report = { ...report, ...value }
            // dispatch(setTargets(targets))
            dispatch.targets.setTargets(targets)
            // dispatch(setReport(report))
            dispatch.editReport.setReport({ ...report })
          }}
        />}
      </div>
    )
  }
}

export default connect(state => ({
  report: state.editReport,
  treeData: state.treeData,
  targets: state.targets,
  database: state.database
}))(ReportName)
