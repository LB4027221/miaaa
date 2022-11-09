import { withClientState, ClientStateConfig } from 'apollo-link-state'

export default (config, cache) => config.clientState
  ? withClientState({ ...config.clientState, cache })
  : false
