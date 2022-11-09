import React from 'react'
import { Redirect } from 'react-router'
import dashboard from './dashboard'
import edit from './edit'
import notFound from './not_found'
import requirement from './requirement'
import report from './report'
import search from './search'
import record from './record'
import chartEdit from './chart_edit'
import tplEdit from './tpl_edit'
import chart from './chart'


export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to='dashboard/workplace' />
  },
  chart,
  search,
  dashboard,
  edit,
  requirement,
  report,
  record,
  chartEdit,
  tplEdit,
  notFound
]
