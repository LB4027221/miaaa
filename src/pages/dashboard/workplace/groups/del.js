import React from 'react'
import { compose, withProps } from 'recompose'
import { withDelReportsGroup, delGroup } from '@gql'
import mutate from '@lib/mutate'
import { Icon, notification, Popconfirm } from 'antd'
import { withApollo } from 'react-apollo'

const handleSuccess = props => (res) => {
  if (!res.data.user.delReportsGroup.success) {
    return notification.error({
      message: '抱歉',
      description: res.data.user.delReportsGroup.errorMessage
    })
  }

  return delGroup(props.client, props.group._id)
}

const mapMutate = withProps(props => ({
  del: () => props.mutateHoc.submit({
    groupId: props.group._id
  }, handleSuccess(props))
}))

const Del = ({
  del
}) => (
  <Popconfirm title='删除' onConfirm={del} okText='删了' cancelText='让我再想想'>
    <Icon type='delete' />
  </Popconfirm>
)

export default compose(
  withApollo,
  withDelReportsGroup,
  mutate({
    mutationName: 'delReportsGroup',
    name: 'mutateHoc'
  }),
  mapMutate
)(Del)
