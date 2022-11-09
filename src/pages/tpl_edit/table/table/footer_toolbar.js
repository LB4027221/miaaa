import React from 'react'
import FooterToolbar from '@component/footer_toolbar'
import { ExportExcel } from '@component/page_header/title'
import { Dropdown, Menu, Button } from 'antd'
import { connect } from 'react-redux'
import { withUser, withUserReports } from '@gql'
import { findBy, renderNotingByName } from '@lib'
// import tab$ from '@lib/keyboard/tab'
import { compose } from 'recompose'

import withStyles from '../styles'
import store from '../store'


const findById = findBy('_id')

const rmTag = (id) => {
  const state = store.getState()

  if (state.id === id) {
    return store.dispatch({
      type: 'ids/removeTagAndRedirect',
      payload: id
    })
  }

  return store.dispatch({
    type: 'ids/removeTag',
    payload: id
  })
}

const redirectTo = id => window.location.href = `/#/report/${id}`

const Excel = ({ exportExcel, mutatehoc }) => (
  <div
    style={{
      display: 'inline-block',
      padding: '4px 10px'
    }}
  >
    <Button
      onClick={exportExcel}
      icon='export'
      type='primary'
      loading={mutatehoc.loading}
    >
      导出 Excel
    </Button>
  </div>
)

const Extra = () => (
  <ExportExcel>
    {props => <Excel mutatehoc={props.mutatehoc} exportExcel={props.exportExcel} />}
  </ExportExcel>
)

const ExtraContainer = ({ toggleModal }) => (
  <div>
    <Button onClick={toggleModal}>查看字段逻辑</Button>
    <Extra />
  </div>
)

const menu = (closable, report) => (
  <Menu>
    <Menu.Item disabled={!closable}>
      <div onClick={() => (closable ? rmTag(report._id) : null)}>删除</div>
    </Menu.Item>
  </Menu>
)

const renderTabs = ({ ids, reports, classes }) => {
  const state = store.getState()
  const closable = ids.length > 1

  return ids.map((id) => {
    const report = findById(id, reports) || {}
    return (
      <Dropdown key={id} overlay={menu(closable, report)} placement='topCenter'>
        <div
          className={classes.footerTab}
          style={{
            boxShadow: state.id === id ? '0 -1px 2px rgba(0, 0, 0, 0.03)' : 'none',
            background: state.id === id ? '#fff' : '#f0f0f0'
          }}
          onClick={() => redirectTo(id)}
        >
          {report.cname}
        </div>
      </Dropdown>
    )
  })
}

const mapState = state => ({
  ids: state.ids
})
const Tags = compose(
  withStyles,
  connect(mapState)
)(renderTabs)

const View = ({ userReports, toggleModal }) => (
  <FooterToolbar extra={() => <ExtraContainer toggleModal={toggleModal} />}>
    <Tags reports={userReports.user.reports} />
  </FooterToolbar>
)

const mapDispatch = ({ visible }) => ({
  toggleModal: visible.toggleModal
})

export default compose(
  withStyles,
  withUser,
  withUserReports,
  renderNotingByName('userReports'),
  connect(null, mapDispatch)
)(View)
