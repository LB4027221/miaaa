import React, { Component } from 'react'
import { Modal, Skeleton } from 'antd'
import { compose, withState } from 'recompose'
import { connect } from 'react-redux'
// import { mapDataSource, tryNumOrDate } from '@lib'
import { withReport } from '@gql'
import { HotTable } from '@lib/handsontable'
import mapCols from '@lib/handsontable/render'
import { fromEvent } from 'rxjs'
import { sampleTime } from 'rxjs/operators'
import withResizeObserverProps from '@hocs/with-resize-observer-props'

import { dissoc, pathOr, multiply, length } from 'ramda/src'
import Empty from './empty'
import Spin from './spin'

import Tools from './tools'
import Pagination from './pagination'
// import store from '../store'
import withStyles from '../styles'

// const mapRow = compose(
//   Object.values,
//   dissoc('key')
// )
const dissocIdx = dissoc('index')
const getDataSource = pathOr([], ['report', 'dataSource', 'data'])
const getColumns = pathOr([], ['report', 'dataSource', 'columns'])
const getHeight = compose(
  multiply(35),
  length,
  getDataSource
)
// Affix

let bindEvent
const bindScoll = (hot) => {
  if (bindEvent) {
    bindEvent.unsubscribe()
  }
  bindEvent = fromEvent(hot.hotElementRef, 'wheel')
    .pipe(sampleTime(10))
    .subscribe((event) => {
      const elm = document.querySelector('#tab-ctx')
      event.preventDefault()
      let deltaY = isNaN(event.deltaY) ? -1 * event.wheelDeltaY : event.deltaY

      if (event.deltaMode === 1) {
        deltaY += deltaY * parseInt(getComputedStyle(document.body).lineHeight, 10)
      }

      elm.scrollTop += deltaY / 2
    })
}

const conf = {
  stretchH: 'all',
  width: '100%',
  height: 200,
  autoWrapRow: true,
  rowHeaders: true,
  manualRowMove: true,
  manualColumnMove: true,
  contextMenu: false,
  filters: false,
  fixedRowsTop: false,
  readOnly: true,
  // dropdownMenu: true,
  formulas: true,
  language: 'zh-CN'
}

const renderMeta = (meta, idx) => (
  <p key={idx}>
    <strong>
      {meta.alias}:
    </strong>
    <span style={{ marginLeft: 10 }}>
      {meta.annotate}
    </span>
  </p>
)

class View extends Component {
  setHeight = (height) => {
    const _height = height > 200 ? (height + 40) : 200

    this.props.setHeight(_height)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data.report) !== JSON.stringify(nextProps.data.report)) {
      this.setHeight(getHeight(nextProps.data))
    }
    if (this.props.header !== nextProps.header) {
      this.setHeight(getHeight(nextProps.data))
    }
    if (this.props.expand !== nextProps.expand) {
      this.setHeight(getHeight(nextProps.data))
    }
  }

  componentWillUnmount() {
    if (bindEvent && bindEvent.unsubscribe) {
      bindEvent.unsubscribe()
    }
  }

  render() {
    const {
      data,
      classes,
      id,
      visible,
      toggleModal,
      height
    } = this.props
    const colHeaders = data.report
      ? data.report.metaList.map(i => i.alias || '无')
      : []
    const _rows = getDataSource(data)
      .map(dissocIdx)
    const columns = getColumns(data)
      .filter(i => i.name !== 'index')
      .map(mapCols)

    const rows = _rows.length
      ? _rows
      : [columns.map(() => '')]

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 78px)'
        }}
        ref={ref => this.ctx = ref}
      >
        {data.report ? (
          <Tools id={id} ctx={this.ctx} />
        ) : (
          <div className={classes.loadingSket}>
            <Skeleton active paragraph={{ rows: 0 }} />
            <Skeleton active paragraph={{ rows: 0 }} />
            <Skeleton active paragraph={{ rows: 0 }} />
            <Skeleton active paragraph={{ rows: 0 }} />
          </div>
        )}
        <Modal
          title='字段逻辑'
          visible={visible}
          onOk={toggleModal}
          onCancel={toggleModal}
          cancelText='关闭'
        >
          {data.report && (<p>{data.report.remarks}</p>)}
          {data.report && data.report.metaList.map(renderMeta)}
        </Modal>
        <div
          style={{
            width: '100%',
            flex: 1,
            overflow: 'scroll'
          }}
        >
          {data.loading && <Spin />}
          {colHeaders.length && (
            <HotTable
              data={rows}
              {...conf}
              ref={hot => hot && bindScoll(hot)}
              colHeaders={colHeaders}
              columns={columns}
              height={height}
            />
          )}
          {(!rows.length && !data.loading) && <Empty />}
        </div>
        <Pagination
          id={id}
          style={{
            display: 'block',
            width: '100vw',
            margin: '0 -16px',
            padding: '16px',
            boxShadow: '1px 1px 10px #eee',
            boxSizing: 'border-box'
          }}
        />
      </div>
    )
  }
}

const mapState = state => ({
  id: state.id,
  visible: state.visible,
  header: state.header,
  current: state[state.id].current,
  __typename: state[state.id].__typename,
  pageSize: state[state.id].pageSize,
  components: state[state.id].submitComponents,
  expand: state[state.id].expand
})

const mapDispatch = ({ visible }) => ({
  toggleModal: visible.toggleModal
})

const setHeight = withState('height', 'setHeight', 200)

export default compose(
  withStyles,
  connect(mapState, mapDispatch),
  withReport,
  setHeight
)(View)
