import { ClientSocket } from 'use-socketio'

const server = process.env.NODE_ENV === 'development'
  ? 'http://local.songxiaocai.org:1024'
  : 'https://reports.songxiaocai.com'

export default props => (
  <ClientSocket url={server}>
    {props.children}
  </ClientSocket>
)
