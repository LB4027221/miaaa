import loadable from '@component/loadable'

const routes = {
  title: '我的报表',
  hide: true,
  icon: 'file-text',
  path: '/report',
  component: loadable({
    loader: import('./view')
  }),
  routes: [
    {
      path: '/report/list/:id',
      component: loadable({
        loader: import('./table')
      })
    },
    {
      path: '/report/:id',
      component: loadable({
        loader: import('./table')
      })
    }
  ]
}

export default routes
