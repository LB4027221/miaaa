/* eslint-disable */

import { Operation, ApolloLink, Observable } from 'apollo-link'
import ApolloClient from 'apollo-client'
import { withClientState, ClientStateConfig } from 'apollo-link-state'
import { onError } from 'apollo-link-error'
import { getMainDefinition } from 'apollo-utilities'
import { split } from 'apollo-link'

import cache from './cache'
import HttpLink from './http_link'
import wsLink from './ws'

import { errorHandler } from './error_handler'

import { request } from './request_handler'
import { response } from './response_handler'
import state from './state_link'

const defaultConfig = {
  errorHandler,
  request,
  response
}

class GpmLink {
  constructor(config) {
    this.config = { ...defaultConfig, ...config }
    this.cache = cache(config)

    const ws = this.wsLink()
    const link = ApolloLink.from([
      this.errorLink(),
      this.requestHandler(),
      this.responseHandler(),
      this.stateLink(),
      this.httpLink()
    ].filter(x => !!x))

    const spiltLink = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      ws,
      link
    )

    this.link = spiltLink
  }

  httpLink() {
    return new HttpLink(this.config)
  }

  wsLink() {
    return wsLink(this.config)
  }

  responseHandler() {
    return new ApolloLink(this.config.response)
  }

  requestHandler() {
    return new ApolloLink((operation, forward) =>
      new Observable((observer) => {
        let handle

        Promise.resolve(operation)
          .then(oper => this.config.request(oper))
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
  }

  errorLink() {
    return onError(this.config.errorHandler)
  }

  stateLink() {
    return this.config.clientState
      ? withClientState({ ...this.config.clientState, cache: this.cache })
      : false
  }
}

const mapClient = (config = {}) => new ApolloClient({
  link: new GpmLink(config).link,
  cache: cache(config)
})

export default mapClient
