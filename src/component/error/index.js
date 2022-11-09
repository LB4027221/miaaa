import React, { Component, createFactory } from 'react'
import Lottie from 'react-lottie'
import animationData from './error.json'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}


class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  componentDidCatch(error, info) {
    // this.setState({ hasError: true, error: error.message })
    console.log('====================================')
    console.log(error)
    console.log(info)
    console.log('====================================')
    // logErrorToMyService(error, info)
  }

  componentWillReceiveProps() {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ paddingTop: 100 }}>
          <Lottie width={200} options={defaultOptions} />
          <h1 style={{ display: 'flex', justifyContent: 'center' }}>Something went wrong.</h1>
          <h5 style={{ display: 'flex', justifyContent: 'center' }}>{this.state.error}</h5>
        </div>
      )
    }
    return this.props.children
  }
}

const withErrorHandler = (BaseComp) => {
  const factory = createFactory(BaseComp)

  return props => (
    <ErrorBoundary>
      {factory(props)}
    </ErrorBoundary>
  )
}

export default withErrorHandler
