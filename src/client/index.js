import Fingerprint2 from 'fingerprintjs2sync'
import cookie from 'cookie'
import { notification } from 'antd'
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import introspectionQueryResultData from './fragmentTypes.json'

const uri = process.env.NODE_ENV === 'development'
  ? 'http://local.songxiaocai.org:4444/graphql'
  : '/graphql'

const { localStorage } = window
const deviceUUID = (new Fingerprint2()).getSync().fprint
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

const transformResponse = observer => (data) => {
  // if (!data.success) {
  //   observer.error(data)
  // }
  observer.next(data)
  observer.complete()

  return data
}

const request = async (operation) => {
  const cookies = cookie.parse(document.cookie)

  operation.setContext({
    headers: {
      ...cookies,
      deviceUUID
    }
  })
}

const cacheRedirects = {
  Query: {
    report: (_, args, { getCacheKey }) =>
      getCacheKey({ __typename: 'Report', id: args._id })
  }
}

const dataIdFromObject = object => object.id || object._id

const errorHandler = (props) => {
  const { graphQLErrors, networkError } = props
  console.log('====================================')
  console.log(props)
  console.log('====================================')
  if (graphQLErrors) {
    graphQLErrors.map(err =>
      notification.open({ message: '抱歉', description: err.message }))
  }

  if (networkError) {
    console.log('==========networkError=============')
    console.log(networkError)
    console.log('====================================')

    if (networkError.code && networkError.code === 'ECONNABORTED') {
      return notification.open({
        message: '导出任务已经加入后台',
        description: '请留意右上角的铃铛图标'
      })
    }

    const errors = networkError.response.data.errors
      .map(error => error.message)
      .join('\n')

    notification.open({
      message: networkError.message,
      description: errors
    })
  }
}


const config = {
  uri,
  // clientState,
  request,
  credentials: 'include',
  browser: true,
  useBody: true,
  storage: {
    localStorage,
    key: 'miaaa_yahaha'
  },
  fragmentMatcher,
  errorHandler,
  dataIdFromObject,
  cacheRedirects,
  transformResponse
}

export default config
