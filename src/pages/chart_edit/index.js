import loadable from '@component/loadable'

const routes = {
  path: '/chartEdit',
  hide: true,
  component: loadable({
    loader: import('./table/view')
  }),
  routes: [
    {
      path: '/chartEdit/:id',
      component: loadable({
        loader: import('./table/table')
      })
    }
  ]
}

export default routes
