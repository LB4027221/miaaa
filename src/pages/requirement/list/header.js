import React from 'react'
import { Card, Row, Col } from 'antd'
import withStyles from './styles'

const Info = ({
  classes,
  title,
  value,
  bordered
}) => (
  <div className={classes.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
)

const View = ({ classes }) => (
  <Card bordered={false}>
    <Row>
      <Col sm={8} xs={24}>
        <Info classes={classes} title='我的待办' value='8个任务' bordered />
      </Col>
      <Col sm={8} xs={24}>
        <Info title='本周任务平均处理时间' value='32分钟' bordered />
      </Col>
      <Col sm={8} xs={24}>
        <Info title='本周完成任务数' value='24个任务' />
      </Col>
    </Row>
  </Card>
)

export default withStyles(View)
