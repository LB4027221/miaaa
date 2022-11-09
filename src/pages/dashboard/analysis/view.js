import React from 'react'
import GridLayout from 'react-grid-layout'
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { compose, pure, withPropsOnChange, withState, withProps } from 'recompose'
import withResizeObserverProps from '@hocs/with-resize-observer-props'
import { pathOr, filter } from 'ramda/src'
import { withUserGrid } from '@gql'
import { renderWhileLoadingByTest } from '@lib'
import withTitle from '@component/title'
import Fullscreen from './fullscreen'

import withStyles from './styles'
import renderCard, { cardLayoutMap } from '../view_grid/card_layout_map'

// const getId = pathOr(null, ['match', 'params', 'id'])
const getSelectedCards = compose(
  filter(i => i.chart),
  pathOr([], ['grid', 'user', 'grid', 'items'])
)
const layoutWatcher = ({ myLayout, layout, updateLayout }) => {
  const newLayout = myLayout.filter(i => !layout.find(l => i.i === l.i))
  updateLayout([...layout, ...newLayout])
}
const LayoutState = withState('layout', 'updateLayout', props => props.myLayout)
const withLayoutWatcher = withPropsOnChange(
  ['myLayout'],
  layoutWatcher
)
const MyGrid = compose(
  LayoutState,
  withLayoutWatcher,
  withProps(props => ({
    onDrag: (layout) => {
      props.updateLayout(layout)
    },
    onLayoutChange: (layout) => {
      props.subLayoutController(layout)
      return layout
    }
  }))
)(GridLayout)

const Edit = (props) => {
  const {
    classes,
    containerWidth,
    containerHeight,
    onRef
  } = props

  const selectedCards = getSelectedCards(props)
  return (
    <div ref={onRef} style={{ minHeight: '100%', minWidth: '100%' }}>
      <MyGrid
        isDraggable={false}
        isResizable={false}
        margin={[16, 0]}
        autoSize={false}
        className={classes.content}
        myLayout={selectedCards.map(cardLayoutMap)}
        cols={4}
        subLayoutController={() => {}}
        rowHeight={20}
        width={containerWidth || 0}
        height={containerHeight}
      >
        {selectedCards.map(cardLayoutMap).map(renderCard)}
      </MyGrid>
      <Fullscreen />
    </div>
  )
}

export default compose(
  withTitle('我的看板'),
  withStyles,
  withUserGrid,
  renderWhileLoadingByTest(props => props.userGrid && props.userGrid.loading),
  withResizeObserverProps(({ width, height }) => ({
    containerWidth: width,
    containerHeight: height
  })),
  pure
)(Edit)
