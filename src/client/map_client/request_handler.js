/*eslint-disable*/
import { Operation, ApolloLink, Observable } from 'apollo-link'

export const request = config => async (operation) => {
  // const { localStorage } = window
  // const token = await localStorage.getItem('yahaha_saigao')
  const { storage } = config

  let authorizationKey = 'cookie'
  let authorizationValue = ''

  if (!config.browser) {
    const session = await storage.localStorage.getItem(config.storage.key)
    authorizationValue = session
      ? `SESSION=${session}`
      :  ''
  } else {
    authorizationKey = 'authorization'
    const token = await storage.localStorage.getItem(config.storage.key)
    authorizationValue = token
      ? `Yarua ${token}`
      : ''
  }

  operation.setContext({
    headers: {
      [authorizationKey]: authorizationValue,
      ...config.headers || {}
    }
  })
}

const requestHandler = requestFn => new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle
    Promise.resolve(operation)
      .then(oper => requestFn(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer)
        })
      })
      .catch(observer.error.bind(observer))

    return () => {
      if (handle) handle.unsubscribe
    }
  })
)

export default config => requestHandler(config.request || request(config))
