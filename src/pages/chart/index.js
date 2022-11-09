import loadable from '@component/loadable'

const routes = {
  title: '我的图表',
  hide: true,
  icon: 'file-text',
  path: '/chart',
  component: loadable({
    loader: import('./view')
  }),
  routes: [
    {
      path: '/chart/:id',
      component: loadable({
        loader: import('./table')
      })
    }
  ]
}

export default routes
