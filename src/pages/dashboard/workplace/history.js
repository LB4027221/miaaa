import React from 'react'
import Ajax from '@lib/ajax'
import { Card } from 'antd'
import { withUser, withUserReports } from '@gql'
import take from 'ramda/src/take'
import { withRouter } from 'react-router'
import { mapProps, compose } from 'recompose'
import { findBy } from '@lib'
import uniqBy from 'ramda/src/uniqBy'
import moment from 'moment'

const findById = findBy('_id')

const uniqById = uniqBy(data => data.reportId)

const bodyStyle = {
  padding: 0
}

const gridStyle = {
  width: '33.33%',
  textAlign: 'center'
}

const cardTitle = {
  color: 'rgba(0,0,0,.85)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  height: 20,
  WebkitBoxOrient: 'vertical'
}
const cardDescription = {
  color: 'rgba(0,0,0,.45)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  height: 40,
  WebkitBoxOrient: 'vertical'
}

const Grid = ({ item, history }) => (
  <Card.Grid
    style={gridStyle}
    onClick={() => {
      history.push(`/report/${item.reportId}`)
    }}
  >
    <p style={cardTitle}>{item.reportName}</p>
    <div style={cardDescription}>{item.remarks}</div>
  </Card.Grid>
)

const EnhanceGrid = withRouter(Grid)
const renderCard = item => <EnhanceGrid key={item.reportId} item={item} />

const View = ({
  dataSource
}) => (
  <Card
    bodyStyle={bodyStyle}
    title='我的历史'
  >
    {take(8, dataSource).map(renderCard)}
  </Card>
)

const filterList = mapProps(props => ({
  dataSource: uniqById(props.dataSource.filter(item =>
    findById(item.reportId, props.userReports.user.reports)))
}))

const CardList = compose(
  withUser,
  withUserReports,
  filterList
)(View)

const History = ({
  data
}) => (
  <Ajax
    url={`/records/list?current=1&pageSize=10&startDate=${moment().day(-10).format('YYYY/MM/DD')}&endDate=${moment().format('YYYY/MM/DD')}&actionType=0&userId=${data.user._id}`}
  >
    {value => <CardList dataSource={value.body.list} />}
  </Ajax>
)

export default withUser(History)
