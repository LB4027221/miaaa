import {
  serializeFetchParameter,
  selectURI,
  checkFetcher,
  createSignalIfSupported,
  fallbackHttpConfig,
  Body,
  HttpOptions,
  UriFunction as _UriFunction,
} from 'apollo-link-http-common';
import { ApolloLink, Observable, RequestHandler, fromError } from 'apollo-link'
import { print } from 'graphql/language/printer'
import qs from 'qs'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

let AbortController
NProgress.configure({ showSpinner: false })

const transformResponse = observer => res => {
  const data = res.data
  console.log('=========transformResponse=================')
  console.log(data)
  console.log('====================================')
  if (!data.success) {
    observer.error(data)
  }
  data.data = JSON.parse(data.response)

  observer.next(data.data)
  observer.complete()

  return data
}

const operator = (operation, { uri, fetchOptions = {}, mock, dev, params, transformResponse = transformResponse, useBody }) => observer => {
  const { operationName, extensions, variables, query } = operation
  const context = operation.getContext()

  const { headers } = context
  const body = {
    operationName,
    extensions,
    variables,
    query: query.loc.source.body,
    mock,
    dev
  }

  params = {
    ...params,
    gpmQuery: JSON.stringify(body).replace(/\s\\n/g, '')
  }

  const { controller, signal } = createSignalIfSupported()
  if (controller) fetchOptions.signal = signal

  if (variables.file) {
    const operations = {
      operationName,
      extensions,
      variables: {
        ...variables
      },
      query: query.loc.source.body
    }
    const form = new FormData()
    form.append('operations', JSON.stringify([operations]))
    const map = {}
    map[0] = ['variables.file']

    form.append('map', JSON.stringify(map))
    form.append(0, variables.file, variables.file.name)

    axios({
      baseURL: uri,
      method: 'POST',
      data: form
    })
      // .then(response => {
      //   operation.setContext({ response })
      //   return response.data
      // })
      .then(transformResponse(observer))
      .catch(e => observer.error(e))


    return () => {
      if (controller) controller.abort()
    }
  }

  const conf = !useBody
    ? {
        baseURL: uri,
        method: 'POST',
        params,
        headers,
        responseType: 'json'
      }
    : {
        timeout: 1000 * 60,
        baseURL: uri,
        method: 'POST',
        data: {
          ...params,
          operationName,
          extensions,
          variables,
          query: query.loc.source.body
        },
        headers,
        responseType: 'json'
      }

  NProgress.start()
  axios(conf)
    .then(response => {
      NProgress.done()
      operation.setContext({ response })
      return response.data
    })
    .then(transformResponse(observer))
    .catch(e => {
      NProgress.done()
      observer.error(e)
    })


  return () => {
    if (controller) controller.abort()
  }
}

const createHttpLink = config =>
  new ApolloLink(operation =>
    new Observable(operator(operation, config)))

class HttpLink extends ApolloLink {
  constructor (opts) {
    super()
    this.requester = createHttpLink(opts).request
  }

  request (op) {
    return this.requester(op)
  }
}

export default HttpLink
