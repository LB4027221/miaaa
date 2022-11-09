import loadable from '@component/loadable'

const routes = {
  title: '工作站',
  icon: 'dashboard',
  path: '/dashboard',
  component: loadable({
    loader: import('./view')
  }),
  routes: [
    // {
    //   title: '我的看板',
    //   path: '/dashboard/analysis',
    //   component: loadable({
    //     loader: import('./analysis/view')
    //   })
    // },
    {
      title: '看板列表',
      path: '/dashboard/list',
      component: loadable({
        loader: import('./grid_list')
      }),
      routes: [
        {
          title: '新建看板',
          path: '/dashboard/list/new',
          exact: true,
          component: loadable({
            loader: import('./grid')
          })
        },
        {
          title: '修改看板',
          path: '/dashboard/list/:id',
          exact: true,
          component: loadable({
            loader: import('./grid')
          })
        }
      ]
    },
    {
      title: '工作台',
      path: '/dashboard/workplace',
      component: loadable({
        loader: import('./workplace')
      })
    }
  ]
}

export default routes
