import React from 'react'
import { HashRouter, Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import * as R from 'ramda'
import removeAdmin from '@lib/remove_admin'
import { BackTop } from 'antd'
import withRefetch from '@lib/refetch'

import Layout from './layouts'
import pages from './pages'
// import Notification from './global/notification'

const filterDeveloperPage = R.filter(v => v.auth !== 'developer')

// 如果有其他特殊页面的话，可以在这里加入
const routes = ({ roles }) => (roles.map(item => item.roleId).includes(500) ?
  pages :
  removeAdmin(filterDeveloperPage(pages)))

const Router = ({
  data,
  refetchdata,
  dataRefetching
}) => (
  <HashRouter>
    <Switch>
      <Layout
        routes={routes(data.user)}
        user={data.user}
        refetching={dataRefetching}
        refetch={refetchdata}
      >
        <div className='home-page'>
          {/* <Notification variables={{ userId: data.user.userId }} /> */}
          {renderRoutes(routes(data.user))}
        </div>
        <BackTop />
      </Layout>
    </Switch>
  </HashRouter>
)

export default withRefetch('data')(Router)
