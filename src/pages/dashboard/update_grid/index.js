import React from 'react'
import GridLayout from 'react-grid-layout'
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { compose, withPropsOnChange, withState, withProps } from 'recompose'
import { useEventCallback } from 'rxjs-hooks'
import { map } from 'rxjs/operators'
import withResizeObserverProps from '@hocs/with-resize-observer-props'
import { pathOr, filter } from 'ramda/src'
import { withGrid } from '@gql'
import { renderWhileLoadingByTest } from '@lib'

import DrawerComp from './drawer'
import withStyles from './styles'
import renderCard, { cardLayoutMap } from './card_layout_map'
// import Screenshot from './screenshot'
import './style.css'

// const dissocId = dissoc('_id')
const getId = pathOr(null, ['match', 'params', 'id'])
const getSelectedCards = compose(
  filter(i => i.chart),
  pathOr([], ['grid', 'user', 'grid', 'items'])
)
const getLayout = compose(
  filter(i => i.chart),
  pathOr([], ['grid', 'user', 'grid', 'items'])
)
const getGrid = pathOr({}, ['grid', 'user', 'grid'])

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
    onRef,
    _id
  } = props
  const [toggleSelectCard, selectedCards] = useEventCallback(cards$ =>
    cards$.pipe(map(cards => cards)), getSelectedCards(props))
  const [subLayoutController, subLayout] = useEventCallback(layouts$ =>
    layouts$.pipe(map(layouts => layouts)), getLayout(props))

  return (
    <div ref={onRef} style={{ minHeight: '100%' }} id='grid-editor'>
      <DrawerComp
        toggleSelectCard={toggleSelectCard}
        selectedCards={selectedCards.map(cardLayoutMap)}
        subLayout={subLayout}
        grid={getGrid(props)}
        _id={_id}
      />
      <MyGrid
        margin={[16, 0]}
        autoSize={false}
        className={classes.content}
        myLayout={selectedCards.map(cardLayoutMap)}
        cols={4}
        subLayoutController={subLayoutController}
        rowHeight={20}
        width={containerWidth || 0}
        height={containerHeight}
      >
        {selectedCards.map(cardLayoutMap).map(renderCard)}
      </MyGrid>
    </div>
  )
}

export default compose(
  withStyles,
  withProps(props => ({ _id: getId(props) })),
  withGrid,
  renderWhileLoadingByTest(props => props.grid && props.grid.loading),
  withResizeObserverProps(({ width, height }) => ({
    containerWidth: width,
    containerHeight: height
  }))
)(Edit)
