import React from 'react'
import { Form, Input } from 'antd'
import withStyles from './styles'
import { Consumer } from './context'

const FormItem = Form.Item

const View = ({
  onSearch,
  classes
}) => (
  <div className={classes.tools}>
    <Form layout='inline'>
      <FormItem label='报表名称'>
        <Input onChange={onSearch} placeholder='中文 || 拼音 => OK' />
      </FormItem>
      {/* <FormItem label='修改日期'>
        <DatePicker placeholder='' />
      </FormItem> */}
    </Form>
  </div>
)

const EnhanceView = props => (
  <Consumer>
    {ctx => <View {...props} onSearch={ctx.onSearch} />}
  </Consumer>
)

export default withStyles(EnhanceView)
