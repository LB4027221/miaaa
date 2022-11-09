import { notification } from 'antd'
import { updateGroup, addGroup, updateUser } from '@gql'
import { withProps } from 'recompose'

const handleAddSuccess = props => (res) => {
  if (!res.data.user.addReportsGroup.success) {
    return notification.error({
      message: '抱歉',
      description: res.data.user.addReportsGroup.errorMessage
    })
  }

  notification.success({
    message: 'tada',
    description: `${props.groupName}新建完成`
  })

  const newData = res.data.user.addReportsGroup.result

  addGroup(props.client, newData)
  return props.success()
}

const handleUpdateSuccess = props => (res) => {
  if (!res.data.user.updateReportsGroup.success) {
    return notification.error({
      message: '抱歉',
      description: res.data.user.updateReportsGroup.errorMessage
    })
  }

  notification.success({
    message: 'tada',
    description: `${props.groupName}更新完成`
  })

  const newData = res.data.user.updateReportsGroup.result

  updateGroup(props.client, newData)
  return props.success()
}

const mapMutate = withProps(props => ({
  onOk: () => {
    const add = () => props.addReportsGroupMutatehoc.submit({
      group: {
        name: props.groupName,
        reportIds: props.targetKeys
      }
    }, handleAddSuccess(props))

    const update = () => props.updateReportsGroupMutatehoc.submit({
      group: {
        _id: props.groupId,
        name: props.groupName,
        reportIds: props.targetKeys
      }
    }, handleUpdateSuccess(props))

    if (props.groupId) {
      return update()
    }

    return add()
  }
}))

const handleUpdateEditSuccess = props => (res) => {
  if (!res.data.user.editFavorite.success) {
    return notification.error({
      message: '抱歉',
      description: res.data.user.editFavorite.errorMessage
    })
  }

  notification.success({
    message: 'tada',
    description: '收藏更新完成'
  })

  const newData = {
    user: {
      favorite: res.data.user.editFavorite.result
    }
  }

  updateUser(props.client, newData)
  return props.success()
}

const editFavoriteMutate = withProps(props => ({
  onOk: () => {
    const update = () => props.mutatehoc.submit({
      reportIds: props.targetKeys
    }, handleUpdateEditSuccess(props))

    return update()
  }
}))

export {
  editFavoriteMutate,
  mapMutate,
  handleAddSuccess,
  handleUpdateSuccess
}
