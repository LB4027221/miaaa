/*eslint-disable*/

import { Operation, ApolloLink, Observable } from 'apollo-link'

export const response = (operation, forward) => {
  return forward(operation).map((response) => {
    let { data } = response

    if (typeof data === 'string') {
      data = JSON.parse(data)
    }

    return Object.assign(response, { data })
  })
}

export default config => new ApolloLink(config.response || response)
