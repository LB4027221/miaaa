import React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { compose, pure, withProps } from 'recompose'
import withResizeObserverProps from '@hocs/with-resize-observer-props'
import { pathOr, filter } from 'ramda/src'
import { withGrid } from '@gql'
import { renderWhileLoadingByTest } from '@lib'
import { isMobile } from 'react-device-detect'

import Fullscreen from './fullscreen'
import withStyles from './styles'
import renderCard, { cardLayoutMap, mapResponsiveLayout } from './card_layout_map'

const getId = pathOr(null, ['match', 'params', 'id'])
const getSelectedCards = compose(
  filter(i => i.chart),
  pathOr([], ['grid', 'user', 'grid', 'items'])
)
const ResponsiveGridLayout = WidthProvider(Responsive)

const Edit = (props) => {
  const {
    containerWidth,
    containerHeight,
    onRef
  } = props
  const selectedCards = getSelectedCards(props)

  return (
    <div ref={onRef} style={{ minHeight: '100%' }}>
      {containerWidth && (
        <ResponsiveGridLayout
          isDraggable={false}
          isResizable={false}
          margin={[isMobile ? 0 : 16, 0]}
          breakpoints={{
            lg: 1200,
            md: 996,
            sm: 768,
            xs: 480,
            xxs: 0
          }}
          cols={{
            lg: 4,
            md: 4,
            sm: 4,
            xs: 1,
            xxs: 1
          }}
          compactType='vertical'
          // useCSSTransforms={false}
          autoSize={false}
          // className={classes.content}
          width={containerWidth}
          style={{
            width: containerWidth,
            height: containerHeight
          }}
          layouts={mapResponsiveLayout(selectedCards.map(cardLayoutMap))}
          // subLayoutController={() => {}}
          rowHeight={20}
        >
          {selectedCards
            .map(cardLayoutMap)
            .map(renderCard)}
        </ResponsiveGridLayout>
      )}
      <Fullscreen />
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
  })),
  pure
)(Edit)
