import React, { PureComponent } from 'react'
import { Form, Input, Button } from 'antd'
import { withEditScomp, withScomp } from '@gql'
import mutate from '@lib/mutate'
import { compose, branch, renderNothing } from 'recompose'
import { indexByKey } from '@lib'

const FormItem = Form.Item

class Tpl extends PureComponent {
  constructor(props) {
    super(props)
    const data = indexByKey(props.scomp.scomp)
    const id = props.match.params.id
    const scomp = data[id]

    this.state = {
      ...scomp
    }
  }

  edit = key => (e) => {
    this.setState({
      [key]: e.target.value
    })
  }

  submit = () => {
    const variables = {
      scomp: {
        _id: this.state.key,
        cname: this.state.cname,
        sql: this.state.sql
      }
    }

    this.props.mutatehoc.submit(variables)
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

const renderNothingWhileLoading = branch(
  props => props.scomp.loading,
  renderNothing
)

export default compose(
  withScomp,
  withEditScomp,
  renderNothingWhileLoading,
  mutate({ mutationName: 'editScomp', name: 'mutatehoc' })
)(Tpl)
