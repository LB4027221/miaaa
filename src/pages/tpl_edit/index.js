import loadable from '@component/loadable'

const routes = {
  path: '/tplEdit',
  hide: true,
  component: loadable({
    loader: import('./table/view')
  }),
  routes: [
    {
      path: '/tplEdit/:id',
      component: loadable({
        loader: import('./table/table')
      })
    }
  ]
}

export default routes
