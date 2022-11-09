import React from 'react'
import { graphql, Subscription } from 'react-apollo'
import { compose } from 'recompose'
import mutate from '@lib/mutate'

import GET_USER from './query/user.graphql'
import GET_REPORTS from './query/reports.graphql'
import GET_REPORT_TABLE_DATA from './query/report.graphql'
import GET_REPORT_TABLE_COUNT from './query/report_count.graphql'
import GET_MASTER_TABLE_DATA from './query/master.graphql'
import GET_MASTER_TABLE_COUNT from './query/master_count.graphql'
import GET_REQUIREMENT_LIST from './query/requirements.graphql'
import GET_REQUIREMENT from './query/requirement.graphql'
import GET_SCOMP from './query/scomp.graphql'
import GET_EXCEL_LIST from './query/excel_list.graphql'
import GET_TPL from './query/tpl.graphql'
import GET_SCHEDULE from './query/schedule.graphql'
import GET_CHART_DATA from './query/user_chart.graphql'
import GET_CHART_ALL_DATA from './query/chart_data.graphql'
import GET_CHART_ALL_REFS from './query/chart_refs.graphql'
import GET_CHART_INFO from './query/chart_info.graphql'
import GET_REPORT_CHARTS from './query/report_charts.graphql'
import GET_GRIDLIST from './query/grid_list.graphql'
import GET_GRID from './query/get_grid.graphql'
import GET_USER_GRID from './query/get_user_grid.graphql'
import GET_USER_SUBSCRIPTION from './query/user_subscription.graphql'
import GET_USER_REPORTS from './query/user_reports.graphql'

import MUTATE_EXPORT_EXCEL from './mutation/excel.graphql'
import UPDATE_REQUIREMENT from './mutation/update_requirement.graphql'
import ADD_REPORTS_GROUP from './mutation/add_reports_group.graphql'
import UPDATE_REPORTS_GROUP from './mutation/update_reports_group.graphql'
import DEL_REPORTS_GROUP from './mutation/del_reports_group.graphql'
import EDIT_USER_FAVORITE from './mutation/edit_user_favorite.graphql'
import CREATE_SCOMP from './mutation/create_scomp.graphql'
import EDIT_SCOMP from './mutation/edit_scomp.graphql'
import CREATE_EXCEL from './mutation/create_excel.graphql'
import UPDATE_EXT from './mutation/update_ext.graphql'
import BUILD_EXCEL from './mutation/build_excel.graphql'
import UPDATE_CHART from './mutation/update_chart.graphql'
import REMOVE_CHART from './mutation/remove_chart.graphql'
import UPDATE_REPORT_CHART from './mutation/update_report_chart.graphql'
import UPDATE_GRID from './mutation/update_grid.graphql'
import UPDATE_EXCEL from './mutation/update_excel.graphql'
import USER_SUBSCRIBE from './mutation/user_subscribe.graphql'
import USER_UNSUBSCRIBE from './mutation/user_unsubscribe.graphql'

import NOTIFICATION from './subscription/notification.graphql'
import NOTICE from './subscription/notice.graphql'

import { addGroup, updateGroup, delGroup, updateUser } from './actions'

export const withUser = graphql(GET_USER)
export const withReportData = graphql(GET_REPORT_TABLE_DATA, {
  skip: props => props.__typename !== 'Report'
})
export const withReportDataCount = graphql(GET_REPORT_TABLE_COUNT, {
  skip: props => props.__typename !== 'Report',
  name: 'total'
})
export const withMaster = graphql(GET_MASTER_TABLE_DATA, {
  skip: props => props.__typename !== 'Master'
})
export const withMasterDataCount = graphql(GET_MASTER_TABLE_COUNT, {
  skip: props => props.__typename !== 'Master',
  name: 'total'
})

export const withReport = compose(
  withReportData,
  withMaster
)

export const withReportCount = compose(
  withReportDataCount,
  withMasterDataCount
)

export const withCharts = graphql(GET_CHART_DATA, {
  name: 'charts'
})
export const withSubscription = graphql(GET_USER_SUBSCRIPTION, {
  name: 'subscription'
})
export const withGridList = graphql(GET_GRIDLIST, {
  name: 'gridList'
})
export const withGrid = graphql(GET_GRID, {
  name: 'grid',
  skip: props => !props._id
})
export const withUserGrid = graphql(GET_USER_GRID, {
  name: 'userGrid'
})
export const withReportCharts = graphql(GET_REPORT_CHARTS, {
  name: 'reportCharts'
})
export const withChart = graphql(GET_CHART_ALL_DATA, {
  name: 'chartData'
})
export const withChartRefs = graphql(GET_CHART_ALL_REFS, {
  name: 'chartData'
})
export const withChartInfo = graphql(GET_CHART_INFO, {
  name: 'chartData'
})
export const withReports = graphql(GET_REPORTS, {
  name: 'userReports'
})
export const withTpl = graphql(GET_TPL, {
  name: 'tpl'
})
export const withSchedule = graphql(GET_SCHEDULE, {
  name: 'schedule'
})
export const withRequirements = graphql(GET_REQUIREMENT_LIST, {
  name: 'requirements'
})
export const withScomp = graphql(GET_SCOMP, {
  name: 'scomp'
})
export const withExcelList = graphql(GET_EXCEL_LIST, {
  name: 'excelList'
})
export const withUpdateExt = graphql(UPDATE_EXT, {
  name: 'updateExt'
})
export const withRequirement = graphql(GET_REQUIREMENT)

export const withExportExcel = graphql(MUTATE_EXPORT_EXCEL)
export const withUpdateRequirement = graphql(UPDATE_REQUIREMENT)
export const withAddReportsGroup = graphql(ADD_REPORTS_GROUP, {
  name: 'addReportsGroup'
})
export const withUpdateReportsGroup = graphql(UPDATE_REPORTS_GROUP, {
  name: 'updateReportsGroup'
})
export const withDelReportsGroup = graphql(DEL_REPORTS_GROUP, {
  name: 'delReportsGroup'
})
export const withEditFavorite = graphql(EDIT_USER_FAVORITE, {
  name: 'editFavorite'
})
export const withCreateScomp = graphql(CREATE_SCOMP, {
  name: 'createScomp'
})
export const withEditScomp = graphql(EDIT_SCOMP, {
  name: 'editScomp'
})
export const withCreateExcel = graphql(CREATE_EXCEL, {
  name: 'createExcel'
})
export const withBuildExcel = graphql(BUILD_EXCEL, {
  name: 'buildExcel'
})
export const withUserReports = graphql(GET_USER_REPORTS, {
  name: 'userReports'
})
export const withUpdateChart = compose(
  graphql(UPDATE_CHART, {
    name: 'updateChart'
  }),
  mutate({
    mutationName: 'updateChart',
    name: 'updateChartHoc',
    path: 'data.user.updateChart'
  })
)
export const withRemoveChart = compose(
  graphql(REMOVE_CHART, {
    name: 'removeChart'
  }),
  mutate({
    mutationName: 'removeChart',
    name: 'removeChartHoc',
    path: 'data.user.removeChart'
  })
)
export const withUpdateReportChart = compose(
  graphql(UPDATE_REPORT_CHART, {
    name: 'updateReportChart'
  }),
  mutate({
    mutationName: 'updateReportChart',
    name: 'updateReportChartHoc',
    path: 'data.user.updateReportChart'
  })
)
export const withUpdateGrid = compose(
  graphql(UPDATE_GRID, {
    name: 'updateGrid'
  }),
  mutate({
    mutationName: 'updateGrid',
    name: 'updateGridHoc',
    path: 'data.user.updateGrid'
  })
)
export const withUpdateExcel = compose(
  graphql(UPDATE_EXCEL, {
    name: 'updateExcel'
  }),
  mutate({
    mutationName: 'updateExcel',
    name: 'updateExcelHoc',
    path: 'data.user.updateExcel'
  })
)
export const withUserSubscribe = compose(
  graphql(USER_SUBSCRIBE, {
    name: 'userSubscribe'
  }),
  mutate({
    mutationName: 'userSubscribe',
    name: 'userSubscribeHoc',
    path: 'data.user.subscribe'
  })
)
export const withUserUnSubscribe = compose(
  graphql(USER_UNSUBSCRIBE, {
    name: 'userUnsubscribe'
  }),
  mutate({
    mutationName: 'userUnsubscribe',
    name: 'userUnsubscribeHoc',
    path: 'data.user.unsubscribe'
  })
)

export const withNotification = BaseComp => props => (
  <Subscription
    subscription={NOTIFICATION}
    variables={props.variables}
  >
    {({ data, loading }) => (
      <BaseComp {...props} data={data} loading={loading} />
    )}
  </Subscription>
)
export const withNotice = BaseComp => props => (
  <Subscription
    subscription={NOTICE}
    variables={props.variables}
  >
    {({ data, loading }) => (
      <BaseComp {...props} data={data} loading={loading} />
    )}
  </Subscription>
)

export default withUser

export {
  updateUser,
  addGroup,
  updateGroup,
  delGroup,
  GET_USER,
  GET_REPORT_TABLE_DATA,
  GET_REQUIREMENT_LIST,
  GET_REQUIREMENT
}
