import React, { PureComponent } from 'react'
import { Form, Input, Button, message } from 'antd'
import { withCreateScomp } from '@gql'
import mutate from '@lib/mutate'
import { compose } from 'recompose'

const FormItem = Form.Item

class Tpl extends PureComponent {
  state = {
    cname: null,
    sql: null,
    done: false
  }

  edit = key => (e) => {
    this.setState({
      [key]: e.target.value
    })
  }

  submit = () => {
    const variables = {
      scomp: {
        cname: this.state.cname,
        sql: this.state.sql
      }
    }

    this.props.mutatehoc.submit(variables, this.afterSub)
  }

  afterSub = (res) => {
    if (!res.data.user.newScomp.success) {
      return message.warn('保存错误')
    }
    message.info('保存完成')
    this.setState({
      done: res.data.user.newScomp.success
    })
  }

  render() {
    return (
      <div>
        <Form layout='inline'>
          <FormItem>
            <Input onChange={this.edit('cname')} placeholder='中文名' value={this.state.cname} />
          </FormItem>
          <FormItem>
            <Input.TextArea
              autosize
              onChange={this.edit('sql')}
              placeholder='sql'
              value={this.state.sql}
              style={{
                minWidth: 500
              }}
            />
          </FormItem>
          <Button
            disabled={this.state.done}
            type='primary'
            onClick={this.submit}
            loading={this.props.mutatehoc.loading}
          >
            保存
          </Button>
        </Form>
      </div>
    )
  }
}

export default compose(
  withCreateScomp,
  mutate({ mutationName: 'createScomp', name: 'mutatehoc' })
)(Tpl)
