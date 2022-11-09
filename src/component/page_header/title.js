import React from 'react'
import { connect } from 'react-redux'
import { compose, withProps } from 'recompose'
import { Row, Col, Button } from 'antd'
import { findBy } from '@lib'
import mutate from '@lib/mutate'
import { withExportExcel, withUser, withUserReports } from '@gql'
import moment from 'moment'

import download from './download'

import withStyles from './styles'

const DATE = 'YYYY-MM-DD hh:mm:ss'
const findById = findBy('_id')

export const mapState = (state, ownProps) => ({
  report: state.id ? findById(state.id, ownProps.userReports.user.reports) : {},
  components: state.id ? state[state.id].submitComponents : []
})

const View = ({
  mutatehoc,
  report,
  classes,
  exportExcel,
  jumpToEdit,
  isAdmin
}) => (
  <div className={classes.title}>
    <Row>
      <Col span={12}>
        <h2>{report.cname}</h2>
        <p style={{ paddingRight: 20 }}>{report.remarks}</p>
        <div className={classes.tools}>
          <Button loading={mutatehoc.loading} onClick={exportExcel} size='small' type='primary' shape='circle' icon='export' ghost />
          <span onClick={exportExcel} className={classes.icon}>导出 Excel</span>
          <div style={{ width: 20 }} />
          {isAdmin &&
            <div>
              <Button onClick={jumpToEdit} size='small' type='primary' shape='circle' icon='form' ghost />
              <span onClick={jumpToEdit} className={classes.icon}>编辑</span>
            </div>
          }
        </div>
      </Col>
      <Col span={12}>
        <img className={classes.img} src='https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png' alt='这是一张图片' />
      </Col>
    </Row>
  </div>
)

const handleSuccess = props => res => download(res.data.exportExcel, {
  url: res.data.exportExcel.publicPath,
  filename: `${props.report.cname}_${moment().format(DATE)}.xlsx`
})

const mapMutate = withProps(props => ({
  isAdmin: props.data.user.roles.map(item => item.roleId).includes(500),
  jumpToEdit: () => {
    window.location.href = `/#/requirement/machiningList/machiningView/${props.report._id}`
  },
  exportExcel: () => props.mutatehoc.submit({
    excel: {
      _id: props.report._id,
      timestamp: Date.now(),
      user: {
        userName: props.data.user.userName,
        userId: props.data.user.userId,
        mobilePhone: props.data.user.mobilePhone
      },
      components: props.components,
      max: 3000000
    }
  }, handleSuccess(props))
}))

const Excel = props => props.children(props)

// render
export const ExportExcel = compose(
  withUser,
  withUserReports,
  connect(mapState),
  withExportExcel,
  mutate(),
  mapMutate
)(Excel)

export default compose(
  withUser,
  withUserReports,
  withStyles,
  connect(mapState),
  withExportExcel,
  mutate(),
  mapMutate
)(View)
