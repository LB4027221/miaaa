import loadable from '@component/loadable'

const routes = {
  title: '报表记录',
  icon: 'copy',
  auth: 'developer',
  path: '/record',
  component: loadable({
    loader: import('./view')
  }),
  routes: [{
    title: 'sql时长',
    path: '/record/sqltrace',
    component: loadable({
      loader: import('./view/sqltrace')
    })
  }, {
    title: '操作详情',
    path: '/record/amount',
    component: loadable({
      loader: import('./view/amount')
    })
  }, {
    title: '操作排行',
    path: '/record/ranking',
    component: loadable({
      loader: import('./view/ranking')
    })
  }]
}

export default routes
