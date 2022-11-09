
import React from 'react'
import { Select, Card, Col, Row, Button } from 'antd'
import Preview from '@component/chart/views'
import Form from '@component/chart'
import { getChartData } from '@lib'
import { useEventCallback } from 'rxjs-hooks'
import { map } from 'rxjs/operators'


const { Option } = Select

const Charts = (props) => {
  const {
    _data,
    cols,
    charts
  } = props
  const [updateChart, _charts] = useEventCallback(charts$ =>
    charts$.pipe(map(c => c)), charts)

  return (
    <Row gutter={16}>
      <Col span={8}>
        {_charts.map((chart, idx) => (
          <Card title='图表编辑' key={`${idx}`}>
            <Select
              defaultValue={chart.chartType}
              style={{ width: '100%' }}
              onChange={chartType =>
                updateChart(_charts.map((i, _idx) => (_idx === idx ? { ...chart, chartType } : i)))}
              placeholder='请选择你的图表类型'
            >
              <Option value='area'>面积图</Option>
              {/* <Option value='interval'>柱状图</Option> */}
              <Option value='stack'>饼图</Option>
              <Option value='card'>卡片</Option>
              <Option value='superCard'>复杂卡片</Option>
              <Option value='timeline'>带时间线的折线</Option>
              <Option value='chord'>和弦图</Option>
            </Select>
            <Form
              type={chart.chartType}
              chart={chart}
              reportId={props.reportId}
              worksheet={props.worksheet}
              tpl={props.tpl}
              cols={cols}
              dataSource={_data}
              tplFn={props.tplFn}
              preview={_props => <Preview {..._props} getChartData={getChartData} />}
            />
          </Card>
        ))}
        <br />
        <Button onClick={() => updateChart([..._charts, {}])}>
          添加图表
        </Button>
      </Col>
    </Row>
  )
}

export default Charts

