import { onError } from 'apollo-link-error'

export const errorHandler = ({ graphQLErrors, networkError }) => {
  console.log('======graphQLErrors===============')
  console.log(graphQLErrors, networkError)
  console.log('====================================')
}


export default config => onError(config.errorHandler || errorHandler)
