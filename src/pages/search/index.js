import loadable from '@component/loadable'

const routes = {
  title: '搜索',
  hide: true,
  icon: 'search',
  path: '/search',
  component: loadable({
    loader: import('./view')
  })
}

export default routes
