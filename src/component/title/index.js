import { createFactory } from 'react'

const withTitle = titleFn => (BaseComponent) => {
  const title = document.querySelector('title')

  const factory = createFactory(BaseComponent)
  const MapProps = (props) => {
    title.innerText = typeof titleFn === 'function'
      ? titleFn(props)
      : titleFn

    return factory(props)
  }

  return MapProps
}

export default withTitle
