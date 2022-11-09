// import React from 'react'
// import { compose, withProps } from 'recompose'
// import { connect } from 'react-redux'
// import { renderWhileLoading } from '@lib'
// import { withReport, withUpdateExt, withUser, withTpl } from '@gql'
// import mutate from '@lib/mutate'
// import { HotTable } from '@lib/handsontable'
// import { Button, Upload, Icon, message } from 'antd'
// import { drop, mergeAll } from 'ramda/src'
// import dataset from '@antv/data-set'
// import {
//   G2,
//   Chart,
//   Geom,
//   Axis,
//   Tooltip,
//   Coord,
//   Label,
//   Legend,
//   View,
//   Guide,
//   Shape,
//   Facet,
//   Util
// } from 'bizcharts'
// import 'handsontable-pro/dist/handsontable.full.css'

// import withStyles from '../styles'

// const conf = {
//   stretchH: 'all',
//   width: 806,
//   height: 600,
//   autoWrapRow: true,
//   rowHeaders: true,
//   colHeaders: true,
//   manualRowMove: true,
//   manualColumnMove: true,
//   contextMenu: true,
//   filters: true,
//   fixedRowsTop: true,
//   readOnly: false,
//   dropdownMenu: true,
//   formulas: true,
//   language: 'zh-CN',
//   columnSummary: [{
//     destinationRow: 0,
//     reversedRowCoords: true,
//     destinationColumn: 10,
//     forceNumeric: true,
//     type: 'sum'
//   }]
// }

// const data = [
//   {
//     name: "London",
//     "Jan.": 18.9,
//     "Feb.": 28.8,
//     "Mar.": 39.3,
//     "Apr.": 81.4,
//     May: 47,
//     "Jun.": 20.3,
//     "Jul.": 24,
//     "Aug.": 35.6
//   },
//   {
//     name: "Berlin",
//     "Jan.": 12.4,
//     "Feb.": 23.2,
//     "Mar.": 34.5,
//     "Apr.": 99.7,
//     May: 52.6,
//     "Jun.": 35.5,
//     "Jul.": 37.4,
//     "Aug.": 42.4
//   }
// ];

// const dd = new dataset.View().source(data)
// console.log(dd.transform({
//       type: "fold",
//       fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."],
//       // 展开字段集
//       key: "月份",
//       // key字段
//       value: "月均降雨量" // value字段
//     }))

// let hot

// const exportFile = () => {
//   // console.log(hot.hotInstance)
//   const exportPlugin = hot.hotInstance.getPlugin('exportFile')
//   exportPlugin.downloadFile('csv', {
//     bom: false,
//     columnDelimiter: ',',
//     columnHeaders: false,
//     exportHiddenColumns: true,
//     exportHiddenRows: true,
//     fileExtension: 'csv',
//     filename: 'Handsontable-CSV-file_[YYYY]-[MM]-[DD]',
//     mimeType: 'text/csv',
//     rowDelimiter: '\r\n',
//     rowHeaders: true,
//     encoding: 'utf-8'
//   })
// }

// // groupBy  sum count max min average

// const charts = [{
//   x: '进单时间',
//   y: '件数',
//   summary: '城市名称',
//   operations: 'sum',
//   chartType: 'line'
// }, {
//   field: '成交额',
//   dimension: '城市名称',
//   chartType: 'percent'
// }, {
//   chartType: 'sum',
//   fx: '件数*成交额'
// }]

// const cols = {
//   '进单时间': {
//     range: [0, 1]
//   }
// }

// const trans = (str) => {
//   const res = Number(str)

//   return Number.isNaN(res)
//     ? str
//     : res
// }

// const { Dragger } = Upload

// const props = ({ user, report }) => ({
//   name: 'file',
//   multiple: true,
//   action: '/upload',
//   withCredentials: true,
//   data: obj => ({ ...obj, userId: user._id, reportId: report._id }),
//   onChange(info) {
//     const status = info.file.status
//     if (status !== 'uploading') {
//       console.log(info.file, info.fileList)
//     }
//     if (status === 'done') {
//       message.success(`${info.file.name} 上传文件成功`)
//     } else if (status === 'error') {
//       message.error(`${info.file.name} 上传文件失败`)
//     }
//   }
// })

// const Tpl = (__props) => {
//   const {
//     datav,
//     datap,
//     setDatai,
//     datai,
//     data,
//     user,
//     setDatav,
//     setDatap,
//     updateExtHoc,
//     tpl
//   } = __props
//   const dataSource = data.report.dataSource || []
//   const columns = data.report.columns.map(i => i.title)
//   const rows = dataSource.map(i => i.row.map(item => item.value))
//   const _data = [columns, ...rows, columns.map(() => '')]
//   const homePage = document.querySelector('.home-page')
//   const width = homePage.clientWidth - 40 - 64
//   const height = homePage.clientHeight - 40 - 64
//   const { tpl } = tpl.user

//   return (
//     <div id='hot-table' style={{ marginTop: -16 }}>
//       <HotTable
//         ref={ref => hot = ref}
//         data={_data}
//         {...conf}
//         width={width}
//         height={500}
//       />
//       <Dragger {...props({ user, report: data.report })}>
//         <p className='ant-upload-drag-icon'>
//           <Icon type='inbox' />
//         </p>
//         <p className='ant-upload-text'>点击或拖拽文件到此处</p>
//       </Dragger>
//       {columns.map((title, idx) => (
//         <div key={`${idx}`}>{(idx + 10).toString(36).toUpperCase()} -- {title}</div>
//       ))}
//       <div onClick={exportFile}>daochu</div>
//       <br />
//       <Button
//         onClick={() => {
//           const __data = hot.hotInstance
//             .getData()
//             .map(item => item.filter(i => i))
//             .filter(item => item && item.length)
//           const keys = __data[0]
//           const _columns = __data[0].map((title, idx) => ({ title, idx }))
//           const source = drop(1, __data)
//             .map(items => mergeAll(items.map((item, i) => ({ [keys[i]]: trans(item) }))))
//           const dv1 = new dataset.View().source(source)
//           const dv2 = new dataset.View().source(source)
//           const dv3 = new dataset.View().source(source)

//           const line = dv1
//             .transform({
//               type: 'aggregate',
//               fields: ['件数', 'gmv', '成交额', '客户id'],
//               operations: ['sum', 'sum', 'sum', 'count'],
//               as: ['count件数', 'countgmv', 'count成交额', 'count客户数'],
//               groupBy: ['进单时间', '城市名称']
//             })
//           const interval = dv3
//             .transform({
//               type: 'aggregate',
//               fields: ['成交额'],
//               operations: ['sum'],
//               as: ['成交额'],
//               groupBy: ['城市名称']
//             })
//             // .transform({
//             //   type: 'partition',
//             //   groupBy: ['进单时间']
//             // })

//           const percent = dv2.transform({
//             type: 'percent',
//             field: '成交额',
//             dimension: '城市名称',
//             as: 'percent'
//           })

//           // .transform({
//           //   type: 'partition',
//           //   groupBy: ['进单时间']
//           // })

//           setDatav(line)
//           setDatai(interval)
//           setDatap(percent)
//           // charts.map((chart) => {
//           //   const y = _columns.find(i => i.title === chart.y)
//           //   const x = _columns.find(i => i.title === chart.x)
//           //   const summary = _columns.find(i => i.title === chart.summary)
//           // })
//         }}
//       >
//         生成
//       </Button>
//       <br />
//       <br />
//       <Button
//         onClick={() => {
//           const __data = hot.hotInstance
//             .getData()
//             .map(item => item.filter(i => i))
//             .filter(item => item && item.length)
//           const _columns = __data[0].map(title => ({
//             title
//           }))

//           const variables = {
//             data: {
//               columns: _columns
//             }
//           }

//           updateExtHoc.submit(variables)
//         }}
//         type='primary'
//         loading={updateExtHoc.loading}
//       >
//         保存
//       </Button>
//       <Chart height={400} data={datai} forceFit>
//         <Axis name='城市名称' />
//         <Axis name='成交额' />
//         <Legend />
//         <Tooltip
//           crosshairs={{
//             type: 'y'
//           }}
//         />
//         <Geom
//           type='interval'
//           position='城市名称*成交额'
//         />
//       </Chart>
//       <Chart height={400} data={datav} scale={cols} forceFit>
//         <Legend />
//         <Axis name='进单时间' />
//         <Axis
//           name='件数'
//           label={{
//             formatter: val => `${val}件`
//           }}
//         />
//         <Tooltip
//           crosshairs={{
//             type: 'y'
//           }}
//         />
//         <Geom
//           type='line'
//           position='进单时间*件数'
//           size={2}
//           color='城市名称'
//           shape='smooth'
//         />
//         <Geom
//           type='point'
//           position='进单时间*件数'
//           size={4}
//           shape='circle'
//           color='城市名称'
//           style={{
//             stroke: '#fff',
//             lineWidth: 1
//           }}
//         />
//       </Chart>
//       <Chart
//         height={window.innerHeight}
//         data={datap}
//         scale={cols}
//         padding={[80, 100, 80, 80]}
//         forceFit
//       >
//         <Coord type='theta' radius={0.75} />
//         <Axis name='percent' />
//         <Legend
//           position='right'
//           offsetY={-window.innerHeight / 2 + 120}
//           offsetX={-100}
//         />
//         <Tooltip
//           crosshairs={{
//             type: 'y'
//           }}
//         />
//         <Geom
//           type='intervalStack'
//           position='percent'
//           color='城市名称'
//           tooltip={[
//             '城市名称*percent',
//             (item, percent) => {
//               percent = percent * 100 + '%'
//               return {
//                 name: item,
//                 value: percent
//               }
//             }
//           ]}
//           style={{
//             lineWidth: 1,
//             stroke: '#fff'
//           }}
//         >
//           <Label
//             content='percent'
//             formatter={(val, item) => {
//               return item.point['城市名称'] + ' : ' + val * 100 + '%'
//             }}
//           />
//         </Geom>
//       </Chart>
//     </div>
//   )
// }


// const mapState = state => ({
//   datav: state.datav,
//   datap: state.datap,
//   datai: state.datai,
//   id: state.id,
//   columns: state.columns,
//   visible: state.visible,
//   current: state[state.id].current,
//   __typename: state[state.id].__typename,
//   pageSize: 200,
//   components: state[state.id].submitComponents
// })

// const mapDispatch = ({ visible, datav, datap, datai }) => ({
//   toggleModal: visible.toggleModal,
//   setDatav: datav.onChange,
//   setDatap: datap.onChange,
//   setDatai: datai.onChange
// })

// export default compose(
//   withUser,
//   withProps(_props => ({ user: _props.data.user })),
//   withStyles,
//   connect(mapState, mapDispatch),
//   withReport,
//   renderWhileLoading,
//   withUpdateExt,
//   withProps(_props => ({ reportId: _props.data.report._id })),
//   withTpl,
//   mutate({ mutationName: 'updateExt', name: 'updateExtHoc' })
// )(Tpl)
