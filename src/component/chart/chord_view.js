import React from 'react'
import { Card } from 'antd'
import DataSet from '@antv/data-set/src'
import {
  union,
  isEmpty,
  map,
  mergeAll,
  addIndex,
  flatten,
  groupBy,
  reduce,
  concat,
  filter
} from 'ramda/src'
import {
  renderNothing,
  branch,
  withProps,
  compose,
  lifecycle,
  onlyUpdateForKeys,
  pure
} from 'recompose'
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from 'bizcharts'
import withResizeObserverProps from '@hocs/with-resize-observer-props'
import { getSource, getTarget } from './chord'
import routes from './routes.json'

const mapIndex = addIndex(map)
const ChordView = props => {
  const data = props.chordData
  console.log('========source================')
  console.log(data)
  console.log('====================================')
  // console.log('===========dv===========')
  // console.log(dv)
  // console.log('====================================')
  const ds = new DataSet()
  const dv = ds.createView().source(props.data, {
    type: 'graph',
    edges: d => d.links
  })
  dv.transform({
    type: 'diagram.arc',
    sourceWeight: e => e.sourceWeight,
    targetWeight: e => e.targetWeight,
    weight: true,
    marginRatio: 0.3
  })
  const scale = {
    x: {
      sync: true
    },
    y: {
      sync: true
    }
  }

  console.log('====================================')
  console.log(dv)
  console.log('====================================')

  return null

//   return (
//     <div>
//       <Chart
//         data={data}
//         width={1000}
//         // forceFit={true}
//         height={500}
//         scale={scale}
//       >
//         <Tooltip
//           // showTitle={false}
//         />
//         <View data={dv.edges} axis={false}>
//           <Coord type='polar' reflect='y' />
//           <Geom
//             type='edge'
//             position='x*y'
//             shape='arc'
//             color='source'
//             opacity={0.5}
//             tooltip={['sourceWeight*targetWeight*sourceName*targetName*value', (sourceWeight, targetWeight, sourceName, targetName) => {
//               console.log('====================================')
//               console.log(sourceWeight, targetWeight, sourceName, targetName)
//               console.log('====================================')
//               return {
//                 name: sourceWeight,
//                 title: `${sourceName}--${targetName}`
//               }
//             }]}
//           />
//         </View>
//         <View data={dv.nodes} axis={false}>
//           <Coord type='polar' reflect='y' />
//           <Geom
//             type='polygon'
//             position='x*y'
//             color='id'
//             tooltip={['name*value', (name, value) => {
//               return {
//                 name: value,
//                 title: name
//               }
//             }]}
//           >
//             <Label
//               content='name'
//               labelEmit
//               textStyle={{
//                 fill: 'black'
//               }}
//             />
//           </Geom>
//         </View>
//       </Chart>
//     </div>
//   )
}

const setProps = withProps(props => ({
  source: getSource(props),
  target: getTarget(props)
}))

const renderEmpty = branch(
  props => !props.source || !props.target,
  renderNothing
)
const renderEmpty2 = branch(
  props => !props.chordData,
  renderNothing
)

const withLifecycle = lifecycle({
  componentDidMount() {
    const props = this.props
    const { source, target } = props
    const dataSource = [...props.getChartData(props)]
    const cols = dataSource.shift()
    const data = dataSource
      .map(row => row.reduce((rowVal, col, idx) => ({ ...rowVal, [cols[idx]]: col }), {}))

    const nodesKeys = Array
      .from(new Set(data.reduce((acc, item) => ([...acc, item[source], item[target]]), [])))

    const a2b = nodesKeys.map((node, nodeIdx) => ({
      id: nodeIdx,
      name: routes.find(route => route.routeName === node).desc,
      value: data.filter(item => item[source] === node).length,
      targets: nodesKeys.reduce(
        (acc, b, targetIdx) => [
          ...acc,
          {
            sourceName: routes.find(route => route.routeName === nodesKeys[nodeIdx]).desc,
            targetName: routes.find(route => route.routeName === nodesKeys[targetIdx]).desc,
            source: nodeIdx,
            target: targetIdx,
            targetWeight: data.filter(item => item[target] === b && item[source] === node).length,
            sourceWeight: data.filter(item => item[source] === b && item[target] === node).length
          }
        ],
        []
      )
    }))

    const nodes = a2b
    const links = compose(
      filter(i => i.targetWeight && i.sourceWeight),
      flatten,
      map(i => i.targets)
    )(a2b)
    // const b2a = nodesKeys.map(node => ({
    //   source: node,
    //   targets: data.filter(d => d[source] === node)
    // }))
    console.log('====================================')
    console.log(nodes)
    console.log(links)
    console.log('====================================')
    this.setState({ chordData: { links, nodes } })
  }
})

export default compose(
  setProps,
  renderEmpty,
  withLifecycle,
  renderEmpty2,
  pure,
  onlyUpdateForKeys([]),
  // withResizeObserverProps(({ width, height }) => ({
  //   containerWidth: width,
  //   containerHeight: height
  // }))
)(ChordView)
