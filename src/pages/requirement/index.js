import loadable from '@component/loadable'

const routes = {
  title: '表单',
  icon: 'form',
  path: '/requirement',
  component: loadable({
    loader: import('./view')
  }),
  routes: [
    {
      title: '库存',
      path: '/requirement/list',
      component: loadable({
        loader: import('./list')
      }),
      routes: [
        {
          title: '新建报表',
          path: '/requirement/list/new',
          exact: true,
          component: loadable({
            loader: import('./new')
          })
        },
        {
          title: '修改需求',
          path: '/requirement/list/:id',
          exact: true,
          component: loadable({
            loader: import('./new')
          })
        }
      ]
    },
    {
      title: '业务组件',
      authorization: true,
      icon: 'fire',
      path: '/requirement/scomp',
      component: loadable({
        loader: import('./scomp')
      }),
      routes: [
        {
          title: '列表',
          path: '/requirement/scomp/list',
          component: loadable({
            loader: import('./scomp/list')
          })
        },
        {
          title: '新建',
          path: '/requirement/scomp/new',
          component: loadable({
            loader: import('./scomp/new')
          })
        },
        {
          title: '修改',
          path: '/requirement/scomp/:id',
          component: loadable({
            loader: import('./scomp/edit')
          })
        }
      ]
    },
    {
      title: '我的需求',
      authorization: true,
      path: '/requirement/machiningList',
      component: loadable({
        loader: import('./machiningList')
      }),
      routes: [
        {
          title: '加工报表',
          path: '/requirement/machiningList/machiningMasterView/:reportId',
          component: loadable({
            loader: import('./machiningMasterView')
          })
        },
        {
          title: '加工报表',
          path: '/requirement/machiningList/machiningView/:reportId',
          component: loadable({
            loader: import('./machiningView')
          })
        },
        {
          title: '修改需求',
          path: '/requirement/machiningList/edit/:id',
          exact: true,
          component: loadable({
            loader: import('./new')
          })
        }
      ]
    }
  ]
}

export default routes
