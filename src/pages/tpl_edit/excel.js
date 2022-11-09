import React from 'react'
import { Table, Affix, Modal } from 'antd'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { mapDataSource, mapColumn } from '@lib'
import { withReport } from '@gql'

// import Tools from './tools'
// import Pagination from './pagination'
import store from '../report/store'
import withStyles from './styles'

// Affix

const locale = {
  filterConfirm: '确定',
  filterReset: '重置',
  emptyText: '暂无数据'
}

const components = {
  header: {
    wrapper: 'thead',
    row: 'tr',
    cell: ({ children }) => (
      <th>
        <Affix>
          <div style={{ background: '#fafafa', minWidth: 60 }}>
            {children}
          </div>
        </Affix>
      </th>
    )
  }
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

const View = ({
  data,
  classes,
  id,
  visible,
  toggleModal
}) => (
  <div>
    {/* {data.report && <Tools id={id} />} */}
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
    <div className={classes.tableOverflow}>
      <Table
        components={components}
        locale={locale}
        rowClassName={classes.tableRow}
        loading={data.loading}
        columns={data.report && mapColumn(data.report.columns)}
        dataSource={data.report && mapDataSource(data.report.dataSource || [])}
        pagination={false}
      />
    </div>
    {/* {data.report && <Pagination id={id} total={data.report.total} />} */}
  </div>
)


const mapState = state => ({
  id: state.id,
  visible: state.visible,
  current: state[state.id].current,
  __typename: state[state.id].__typename,
  pageSize: state[state.id].pageSize,
  components: state[state.id].submitComponents
})

const mapDispatch = ({ visible }) => ({
  toggleModal: visible.toggleModal
})

export default compose(
  withStyles,
  connect(mapState, mapDispatch),
  withReport
)(View)
