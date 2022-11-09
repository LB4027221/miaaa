import React from 'react'
import { Card, Button, Icon } from 'antd'
import { withUser, withUserReports } from '@gql'
import take from 'ramda/src/take'
import { withRouter } from 'react-router'
import { withProps, compose } from 'recompose'
import { findBy } from '@lib'

import store from './store'

const findById = findBy('_id')

const toggle = payload => () => store.dispatch({
  type: 'favoriteVisible/toggle',
  payload
})

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
      history.push(`/report/${item._id}`)
    }}
  >
    <p style={cardTitle}>{item.cname}</p>
    <div style={cardDescription}>{item.remarks}</div>
  </Card.Grid>
)

const EnhanceGrid = withRouter(Grid)

const renderCard = item => <EnhanceGrid key={item._id} item={item} />

const View = ({
  data,
  favorite
}) => (
  <Card
    bodyStyle={bodyStyle}
    title='我的收藏'
    // extra={<Link to=''>查看全部</Link>}
  >
    {take(8, favorite).filter(i => i).map(renderCard)}
    <Button
      type='dashed'
      onClick={toggle(data.user.favorite)}
      style={{
        width: '33.33%',
        height: 122,
        color: '#40a9ff',
        borderColor: '#40a9ff'
      }}
    >
      <Icon type='plus' />
      <span> 新增收藏</span>
    </Button>
  </Card>
)

const mapFavorite = withProps(props => ({
  favorite: props.data.user.favorite.map(id =>
    findById(id, props.userReports.user.reports))
}))

export default compose(
  withUser,
  withUserReports,
  mapFavorite
)(View)
