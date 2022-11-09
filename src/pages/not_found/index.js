import loadable from '@component/loadable'

const routes = {
  component: loadable({
    loader: import('./view')
  })
}

export default routes
