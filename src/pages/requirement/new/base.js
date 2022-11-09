import React from 'react'
import { Form, Card, Input } from 'antd'
import withStyles from './styles'
import { formItemLayout } from './index'

const FormItem = Form.Item

const placeholder = '备注：\n 报表的使用场景\n 报表的统计纬度 \n \n'

const View = ({ getFieldDecorator, classes }) => (
  <Card bordered={false} hoverable title='基本信息'>
    <Form onSubmit={() => {}} hideRequiredMark style={{ marginTop: 8 }}>
      <FormItem {...formItemLayout} label='标题'>
        {/* {getFieldDecorator('title', {
          rules: [{
            required: true,
            message: '请输入标题'
          }]
        })(<Input placeholder='给这个报表起个名字吧' />)} */}
      </FormItem>
      <FormItem {...formItemLayout} label='简介'>
        {/* {getFieldDecorator('description', {
          rules: [{
            required: true,
            message: '请输入这个报表的相关简介'
          }]
        })(<Input.TextArea
          className={classes.description}
          autosize
          placeholder={placeholder}
        />)} */}
      </FormItem>
    </Form>
  </Card>
)

export default withStyles(View)
