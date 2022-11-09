import React from 'react'
import { withChartRefs } from '@gql'
import { compose, withProps } from 'recompose'
import { pathOr } from 'ramda/src'
import { renderWhileLoadingByTest } from '@lib'
import { Layout, Tabs, Button } from 'antd'
import withTitle from '@component/title'
import PageContent from '@component/page_header/content'
import { DataChart } from '@component/chart/with_data'
import { HotTable } from '@lib/handsontable'

import PageHeader from '../page_header'
import withStyle from '../styles'

const getChartTitle = pathOr('', ['chartData', 'user', 'chart', 'title'])
const getData = pathOr([], ['chartData', 'user', 'chart', 'data', 'data'])
const getRefs = pathOr([], ['chartData', 'user', 'chart', 'refs'])

const TabPane = Tabs.TabPane

const mapRef = ({ dataSource, chartId }) => (ref, idx) => (
  <DataChart
    key={`${idx}`}
    chartId={chartId}
    chart={ref}
    dataSource={dataSource}
    type={ref.chartType}
  />
)

const { Content } = Layout

const conf = {
  stretchH: 'all',
  // width: 'calc(100% - 50px)',
  // height: 200,
  // colHeaders: true,
  autoWrapRow: true,
  rowHeaders: true,
  manualRowMove: false,
  manualColumnMove: false,
  contextMenu: false,
  filters: false,
  // fixedRowsTop: false,
  readOnly: true,
  // dropdownMenu: true,
  formulas: true,
  language: 'zh-CN'
}

const Chart = (props) => {
  const data = [...getData(props)]
  let dataSource = [[]]
  data.reduce((acc, item) => {
    if (!item.join('')) {
      dataSource = [...dataSource, []]
    } else {
      dataSource[dataSource.length - 1].push(item)
    }

    return []
  }, [])
  let hot
  const exportFile = () => {
    const exportPlugin = hot.hotInstance.getPlugin('exportFile')
    exportPlugin.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: false,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      filename: `${getChartTitle(props)}-[YYYY]-[MM]-[DD]`,
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: false,
      encoding: 'utf-8'
    })
  }
  return (
    <div>
      <PageContent>
        <PageHeader title={getChartTitle(props)} />
      </PageContent>
      <Content className={props.classes.content}>
        <div className={props.classes.timelineCtx}>
          {getRefs(props)
            .filter(chart => chart.chartType === 'timeline')
            .map(mapRef({ chartId: props.chartId, dataSource: getData(props) }))}
        </div>
        <div style={{ display: 'none' }}>
          <HotTable
            data={data}
            {...conf}
            ref={ref => hot = ref}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            right: 50,
            zIndex: 9999
          }}
        >
          <Button
            onClick={() => exportFile()}
            type='primary'
            size='large'
            shape='circle'
            icon='download'
          />
        </div>
        <Tabs defaultActiveKey='1'>
          {dataSource.map((d, idx) => {
            const cols = d.shift()

            return (
              <TabPane tab={`Tab ${idx}`} key={`${idx + 1}`} className={props.classes.pane}>
                <HotTable
                  data={d}
                  colHeaders={cols}
                  columns={cols}
                  {...conf}
                />
              </TabPane>
            )
          })}
        </Tabs>
      </Content>
    </div>
  )
}

export default compose(
  withStyle,
  withTitle(getChartTitle),
  withProps(props => ({
    chartId: props.match.params.id
  })),
  withChartRefs,
  renderWhileLoadingByTest(props => props.chartData.loading)
)(Chart)
