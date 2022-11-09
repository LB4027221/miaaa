import React from 'react'
import { Skeleton, Card } from 'antd'
import Form from '@component/chart/views'
import { withChartInfo } from '@gql'
import { pathOr } from 'ramda/src'

const getChartAllData = pathOr([], ['dataSource'])

const Chart = props => (
  <Form
    {...props}
    getChartData={getChartAllData}
  />
)

const CardChart = props => (
  <div
    style={{
      width: 260,
      marginRight: 15,
      marginBottom: 18
    }}
  >
    {props.chartData.loading ? (
      <Card bodyStyle={{ padding: 10 }}>
        <Skeleton loading active paragraph={{ rows: 2 }} />
      </Card>
    ) : (
      <Chart {...props} />
    )}
  </div>
)
const MyChart = props => (
  <div>
    {props.chartData.loading ? (
      <Card bodyStyle={{ padding: 10 }}>
        <Skeleton loading active paragraph={{ rows: 7 }} />
      </Card>
    ) : (
      <Chart {...props} />
    )}
  </div>
)

export const DataCartChart = withChartInfo(CardChart)
export const DataChart = withChartInfo(MyChart)
