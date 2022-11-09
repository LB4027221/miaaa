import { WebSocketLink } from 'apollo-link-ws'

const uri = process.env.NODE_ENV === 'development'
  ? 'ws://local.songxiaocai.org:4444/graphql'
  : 'wss://reports.songxiaocai.com/graphql'

const wsLink = confg => new WebSocketLink({
  uri,
  options: {
    reconnect: true
  }
})

export default wsLink
