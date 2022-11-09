import { updateById, removeById } from '@lib'
import mergeDeepRight from 'ramda/src/mergeDeepRight'
import { GET_USER } from '../index'

export const updateUser = (client, data) => {
  const oldData = client.readQuery({
    query: GET_USER
  })

  return client.writeQuery({
    query: GET_USER,
    data: mergeDeepRight(oldData, data)
  })
}

export const addGroup = (client, data) => {
  const oldData = client.readQuery({
    query: GET_USER
  })

  return client.writeQuery({
    query: GET_USER,
    data: {
      ...oldData,
      groups: [...oldData.groups, data]
    }
  })
}

export const updateGroup = (client, data) => {
  const oldData = client.readQuery({
    query: GET_USER
  })

  const groups = updateById(oldData.groups, [data])

  return client.writeQuery({
    query: GET_USER,
    data: {
      ...oldData,
      groups
    }
  })
}

export const delGroup = (client, id) => {
  const oldData = client.readQuery({
    query: GET_USER
  })

  const groups = removeById(id, oldData.groups)

  return client.writeQuery({
    query: GET_USER,
    data: {
      ...oldData,
      groups
    }
  })
}
