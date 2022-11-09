import React, { Component } from 'react'
import { Input } from 'antd'
// import { setReport } from '../../action'
import { connect } from 'react-redux'
import { groupByComponentTemplate } from '../../util'

const { TextArea } = Input

class View extends Component {
  state = {}
  render() {
    let {
      item, dispatch, report, index
    } = this.props
    return (
      <div className='form-item'>
        <TextArea
          autosize
          placeholder='值'
          value={item.options.join(',\n')}
          style={{
            width: 150
          }}
          onChange={({ target }) => {
            let options = target.value.replace(/\n/g, '').split(',')
            item = { ...item, options: [...options] }
            let { groupByComponents } = report

            groupByComponents.splice(index, 1, item)
            report.groupByComponents = [...groupByComponents]

            // dispatch(setReport({ ...report }))
            dispatch.editReport.setReport({ ...report })
          }}
        />
        <TextArea
          autosize
          placeholder='显示选项'
          style={{
            width: 150,
            marginLeft: 10
          }}
          value={item.text.join(',\n')}
          onChange={({ target }) => {
            let text = target.value.replace(/\n/g, '').split(',')
            item = { ...item, text: [...text] }
            let { groupByComponents } = report

            groupByComponents.splice(index, 1, item)
            report.groupByComponents = [...groupByComponents]

            // dispatch(setReport({ ...report }))
            dispatch.editReport.setReport({ ...report })
          }}
        />
        <div
          className='action'
          style={{ marginLeft: 5 }}
          onClick={(e) => {
            let m = groupByComponentTemplate()
            let i = index + 1
            let { groupByComponents } = report

            groupByComponents.splice(i, 0, m)
            report.groupByComponents = [...groupByComponents]

            // dispatch(setReport({ ...report }))
            dispatch.editReport.setReport({ ...report })
          }}
        >
          插入
        </div>

        {index
          ? <div
            className='action'
            onClick={(e) => {
            let { groupByComponents } = report

            groupByComponents.splice(index, 1)
            report.groupByComponents = [...groupByComponents]

            // dispatch(setReport({ ...report }))
            dispatch.editReport.setReport({ ...report })
          }}
          >删除
          </div>
          : ''
        }
      </div>
    )
  }
}

export default connect(state => ({
  report: state.editReport
}))(View)
