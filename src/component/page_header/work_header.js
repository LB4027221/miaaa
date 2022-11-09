import React from 'react'
import { withUser, withUserReports } from '@gql'
import { Avatar } from 'antd'
import { compose } from 'recompose'
import { debug } from '@lib'
import withStyles from './styles'

const View = ({
  data,
  userReports,
  classes
}) => (
  <div className={classes.workPlaceHeader}>
    <div className={classes.pageHeaderContent}>
      <div className={classes.avatar}>
        <Avatar
          size='large'
          src={data.user.dingding.avatar}
        />
      </div>
      <div className={classes.titleContent}>
        <div className={classes.contentTitle}>Hey，{data.user.userName}，祝你开心每一天！</div>
        <div className={classes.userPosition}>{data.user.position}</div>
      </div>
    </div>
    <div className={classes.extraContent}>
      <div className={classes.statItem}>
        <p>报表数</p>
        <div className={classes.p}>{userReports.user.reports.length}</div>
      </div>
    </div>
  </div>
)

export default compose(
  withStyles,
  withUser,
  withUserReports,
  debug
)(View)
