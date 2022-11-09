import React from 'react'
import { List } from 'antd'
import { Link } from 'react-router-dom'
import withStyles from './styles'

const View = ({ data, classes, isAdmin }) => (
  <div className={classes.results}>
    <h2>共 {data.length} 条结果</h2>
    <List
      itemLayout='horizontal'
      dataSource={data}
      renderItem={item => (
        <List.Item
          actions={[
            isAdmin && <Link to={`/tplEdit/${item._id}`}>可视化编辑</Link>,
            isAdmin && <Link to={`/requirement/machiningList/machiningView/${item._id}`}>编辑</Link>,
            <span>
              <Link to={`/report/${item._id}`}>查看</Link>
            </span>
          ]}
        >
          <List.Item.Meta
            title={(<Link to={`/report/${item._id}`}>{item.cname}</Link>)}
            description={item.remarks}
          />
        </List.Item>
      )}
    />
  </div>
)

export default withStyles(View)
